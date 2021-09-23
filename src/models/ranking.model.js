const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const rankingSchema = mongoose.Schema({
  ranking: {
    type: [
      {
        user: {
          type: String,
        },
        succes_rate: {
          type: Number,
        },
      },
    ],
  },
});

// add plugin that converts mongoose to json
rankingSchema.plugin(toJSON);

const Ranking = mongoose.model('Ranking', rankingSchema);

module.exports = Ranking;
