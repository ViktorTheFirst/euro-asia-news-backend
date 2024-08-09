const express = require('express');
const newsController = require('../controllers/news-controller');
const router = express.Router();
const checkPreFlight = require('../middlware/check-pre-flight');

//router.use(checkPreFlight);

router.get('/getNews', newsController.getAllNews);

router.get('/:newsId', newsController.getNewsById);

//router.use(checkCookieAuth);

router.post('/addArticle', newsController.addArticle);

module.exports = router;
