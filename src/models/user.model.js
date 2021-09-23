const mongoose = require('mongoose');
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
});

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);

const User = mongoose.model('User', userSchema);

module.exports = User;
