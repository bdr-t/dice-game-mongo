const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
// const httpMocks = require('node-mocks-http');
// const moment = require('moment');
// const bcrypt = require('bcryptjs');
const app = require('../../src/app');
// const config = require('../../src/config/config');
// const auth = require('../../src/middlewares/auth');
// const { tokenService, emailService } = require('../../src/services');
// const ApiError = require('../../src/utils/ApiError');
const setupTestDB = require('../utils/setupTestDB');
const { User } = require('../../src/models');
// const { roleRights } = require('../../src/config/roles');
// const { tokenTypes } = require('../../src/config/tokens');
const { userOne, userTwo, insertUsers } = require('../fixtures/user.fixture');
// const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Auth routes', () => {
  describe('POST /auth/register', () => {
    let newUser;
    beforeEach(() => {
      newUser = {
        name: faker.name.findName(),
        password: 'password1',
      };
    });

    test('should return 201 and successfully register user if request data is ok', async () => {
      const res = await request(app).post('/auth/register').send(newUser).expect(httpStatus.CREATED);

      expect(res.body.user).not.toHaveProperty('password');

      expect(res.body.user).toEqual({
        id: expect.anything(),
        name: newUser.name,
        succes_rate: 0,
        games: [],
      });

      const dbUser = await User.findById(res.body.user.id);
      expect(dbUser).toBeDefined();
      expect(dbUser.password).not.toBe(newUser.password);
      expect(dbUser).toMatchObject({ name: newUser.name });

      expect(res.body.tokens).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() },
      });
    });

    test('should return 400 error if name is already used', async () => {
      await insertUsers([userOne]);
      newUser.name = userOne.name;

      await request(app).post('/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if password length is less than 8 characters', async () => {
      newUser.password = 'passwo1';

      await request(app).post('/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if password does not contain both letters and numbers', async () => {
      newUser.password = 'password';

      await request(app).post('/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);

      newUser.password = '11111111';

      await request(app).post('/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('POST /auth/login', () => {
    test('should return 200 and login user if name and password match', async () => {
      await insertUsers([userTwo]);
      const loginCredentials = {
        name: userTwo.name,
        password: userTwo.password,
      };

      const res = await request(app).post('/auth/login').send(loginCredentials).expect(httpStatus.OK);

      expect(res.body.user).toEqual({
        id: expect.anything(),
        name: userTwo.name,
        games: [
          {
            result: userTwo.games[0].result,
            sumDice: userTwo.games[0].sumDice,
            _id: expect.anything(),
          },
        ],
        succes_rate: userTwo.succes_rate,
      });

      expect(res.body.tokens).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() },
      });
    });

    test('should return 401 error if there are no users with that name', async () => {
      const loginCredentials = {
        name: userOne.name,
        password: userOne.password,
      };

      const res = await request(app).post('/auth/login').send(loginCredentials).expect(httpStatus.UNAUTHORIZED);

      expect(res.body).toEqual({ code: httpStatus.UNAUTHORIZED, message: 'Incorrect name or password' });
    });

    test('should return 401 error if password is wrong', async () => {
      await insertUsers([userOne]);
      const loginCredentials = {
        name: userOne.name,
        password: 'wrongPassword1',
      };

      const res = await request(app).post('/auth/login').send(loginCredentials).expect(httpStatus.UNAUTHORIZED);

      expect(res.body).toEqual({ code: httpStatus.UNAUTHORIZED, message: 'Incorrect name or password' });
    });
  });
});
