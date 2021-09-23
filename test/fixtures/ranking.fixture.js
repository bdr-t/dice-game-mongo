const mongoose = require('mongoose');

const ranking = {
  _id: mongoose.Types.ObjectId(),
  ranking: [
    {
      user: 'userOne',
      succes_rate: 50,
    },
    {
      user: 'userTwo',
      succes_rate: 0,
    },
  ],
};

/**
 * @typedef Ranking
 */

module.exports = {
  ranking,
};
