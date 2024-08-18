import express from 'express';
import {
  addArticle,
  getAllNews,
  getNewsById,
} from '../controllers/news-controller.js';
const router = express.Router();

router.get('/getNews', getAllNews);

router.post('/addArticle', addArticle);

router.get('/:newsId', getNewsById);

export default router;
