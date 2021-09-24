const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../src/models/user.model');

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const userOne = {
  _id: mongoose.Types.ObjectId(),
  name: 'userOne',
  games: [
    {
      sumDice: 10,
      resutlt: 0,
    },
    {
      sumDice: 7,
      resutlt: 1,
    },

    {
      sumDice: 8,
      resutlt: 0,
    },

    {
      sumDice: 7,
      resutlt: 1,
    },
  ],

  succes_rate: 50,
  password,
};

const userTwo = {
  _id: mongoose.Types.ObjectId(),
  name: 'userTwo',
  games: [
    {
      sumDice: 10,
      resutlt: 0,
    },
    {
      sumDice: 8,
      resutlt: 0,
    },

    {
      sumDice: 8,
      resutlt: 0,
    },

    {
      sumDice: 6,
      resutlt: 0,
    },
  ],

  succes_rate: 0,
  password,
};

const insertUsers = async (users) => {
  await User.insertMany(users.map((user) => ({ ...user, password: hashedPassword })));
};

module.exports = {
  userOne,
  userTwo,
  insertUsers,
};
