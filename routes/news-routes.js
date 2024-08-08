const express = require('express');
const newsController = require('../controllers/news-controller');
const router = express.Router();
const checkCookieAuth = require('../middlware/check-cookie-auth');

router.get('/getNews', newsController.getAllNews);

router.get('/:newsId', newsController.getNewsById);

//router.use(checkCookieAuth);

router.post('/addArticle', newsController.addArticle);

module.exports = router;
