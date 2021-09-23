const Joi = require('joi');

const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    password: Joi.string().required().custom(password),
  }),
};

module.exports = {
  register,
};
