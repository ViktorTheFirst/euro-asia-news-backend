const HttpError = require('../models/http-error');
const Article = require('../models/article');

const getAllNews = async (req, res, next) => {
  let news;

  try {
    news = await Article.find({});
  } catch (err) {
    const error = new HttpError('Fetching news failed', 500);
    return next(error);
  }

  console.log('AMOUNT OF ARTICLES ', news.length);

  if (!news) {
    const error = new HttpError(`There are no news to show`, 404);
    return next(error);
  }
  res.status(200).json(news);
};

const getNewsById = async (req, res, next) => {
  const newsId = req.params.newsId;
  let newsItem;

  console.log(`Fetching article with id: ${newsId}`);

  try {
    newsItem = await Article.findOne({ itemId: newsId });
  } catch (err) {
    console.log('err', err);
    const error = new HttpError('Fetching news item failed', 500);
    return next(error);
  }

  if (!newsItem) {
    const error = new HttpError(
      `There are no news item with id ${newsId}`,
      404
    );
    return next(error);
  }

  res.status(200).json(newsItem);
};

const addArticle = async (req, res, next) => {
  const {
    itemId,
    articleType,
    previewImageURL,
    previewImageAlt,
    h1,
    date,
    h1Paragraphs,
    h2,
    h2Paragraphs,
    h3,
    h3Paragraphs,
    imageURL,
    imageAlt,
    authorh4,
    authorParagraph,
    authorMedia,
    tags,
  } = req.body;

  const createdArticle = new Article({
    itemId,
    articleType,
    previewImageURL,
    previewImageAlt,
    h1,
    date,
    h1Paragraphs,
    h2,
    h2Paragraphs,
    h3,
    h3Paragraphs,
    imageURL,
    imageAlt,
    authorh4,
    authorParagraph,
    authorMedia,
    tags,
  });

  try {
    await createdArticle.save();
  } catch (err) {
    console.log('err', err);
    const error = new HttpError('Creating article failed', 500);
    return next(error);
  }
  console.log(`ARTICLE WITH ID ${itemId} ADDED`);
  res.status(201).json({
    itemId,
    h1,
  });
};

exports.getAllNews = getAllNews;
exports.getNewsById = getNewsById;
exports.addArticle = addArticle;
