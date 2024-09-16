import express from 'express';
import {
  addArticle,
  getAllNews,
  getNewsById,
  getNextArticleId,
} from '../controllers/news-controller.js';
import fileUpload from '../middlware/file-upload.js';
import cleanFileDir from '../middlware/clean-file-dir.js';
import returnFilePath from '../middlware/returnFilePath.js';
import checkCookieAuth from '../middlware/check-cookie-auth.js';

const router = express.Router();

router.get('/getNews', getAllNews);

router.get('/getNextArticleId', getNextArticleId);

//router.use(checkCookieAuth);

router.post('/addArticle', checkCookieAuth, addArticle);

router.post(
  '/upload-image/:articleId',
  cleanFileDir,
  fileUpload.single('image'),
  returnFilePath
);

router.get('/:newsId', getNewsById);

export default router;
