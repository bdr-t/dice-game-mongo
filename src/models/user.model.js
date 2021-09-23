const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { toJSON } = require('./plugins');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  games: {
    type: [
      {
        sumDice: {
          type: Number,
        },
        result: {
          type: Number,
        },
      },
    ],
  },
  succes_rate: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    validate(value) {
      if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        throw new Error('Password must contain at least one letter and one number');
      }
    },
    private: true, // used by the toJSON plugin
  },
});

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);

/**
 * Check if userName is taken
 * @param {string} user - The user's name
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isNameTaken = async function (name, excludeUserId) {
  const user = await this.findOne({ name, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */

const User = mongoose.model('User', userSchema);

module.exports = User;
