const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users-controller');
const fileUpload = require('../middlware/file-upload');
const cleanFileDir = require('../middlware/clean-file-dir');
const checkPreFlight = require('../middlware/check-pre-flight');

router.use(checkPreFlight);

router.get('/getAllUsers', usersController.getAllUsers);

router.post('/signup', usersController.signup);

router.post('/login', usersController.login);

router.post(
  '/:userId',
  cleanFileDir,
  fileUpload.single('image'),
  usersController.editUser
);

router.get('/:userId', usersController.getUser);

module.exports = router;
