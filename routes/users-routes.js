const express = require('express');
const usersController = require('../controllers/users-controller');
const router = express.Router();
const fileUpload = require('../middlware/file-upload');
const cleanFileDir = require('../middlware/clean-file-dir');

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
