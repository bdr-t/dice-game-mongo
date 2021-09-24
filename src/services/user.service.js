const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */

const createUser = async (userBody) => {
  if (await User.isNameTaken(userBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }
  return User.create(userBody);
};

/**
 * Get user by name
 * @param {string} name
 * @returns {Promise<User>}
 */
const getUserByName = async (name) => {
  return User.findOne({ name });
};

module.exports = {
  createUser,
  getUserByName,
};
