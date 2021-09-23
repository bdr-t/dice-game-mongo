const express = require('express');
// const validate = require('../../middlewares/validate');
const validate = require('../middlewares/validate');
const authValidation = require('../validations/auth.validation');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);

router.get('/', function (req, res) {
  res.status(200).send('auth');
});

module.exports = router;
