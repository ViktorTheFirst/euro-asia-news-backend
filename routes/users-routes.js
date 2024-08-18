import express from 'express';

import {
  getAllUsers,
  getUser,
  signup,
  login,
  editUser,
} from '../controllers/users-controller.js';
import fileUpload from '../middlware/file-upload.js';
import cleanFileDir from '../middlware/clean-file-dir.js';
const router = express.Router();

router.get('/getAllUsers', getAllUsers);

router.get('/:userId', getUser);

router.post('/signup', signup);

router.post('/login', login);

router.post('/:userId', cleanFileDir, fileUpload.single('image'), editUser);

export default router;
