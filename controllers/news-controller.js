import HttpError from '../models/http-error.js';
import { Article } from '../models/ArticleModel.js';

const getAllNews = async (req, res, next) => {
  try {
    const articleInstance = new Article();
    const news = await articleInstance.fetch();

    console.log(`Fetched ${news.length} articles`);

    if (!news.length) {
      const error = new HttpError(`There are no news to show`, 404);
      return next(error);
    }

    res.status(200).json({ news });
  } catch (err) {
    const error = new HttpError('Fetching news failed on BE', 500);
    return next(error);
  }
};

const getNewsById = async (req, res, next) => {
  const newsId = req.params.newsId;
  try {
    const articleInstance = new Article();
    const result = await articleInstance.getOneArticle(newsId);
    console.log(`Fetched article with id ${newsId}`);

    if (!result.length) {
      const error = new HttpError(
        `There are no news item with id ${newsId}`,
        404
      );
      return next(error);
    }

    res.status(200).json({ article: result[0] });
  } catch (err) {
    const error = new HttpError('Fetching news failed on BE', 500);
    return next(error);
  }
};

const addArticle = async (req, res, next) => {
  const {
    articleType,
    articleDate,
    previewImageUrl,
    previewImageAlt,
    author,
    tags,
    views,
    h1,
    h1Paragraphs,
    h2,
    h2Paragraphs,
    h3,
    h3Paragraphs,
    imageUrl,
    imageAlt,
    authorMedia,
  } = req.body;
  console.log('req.file.path', req.file.path);

  const newArticle = new Article({
    articleType,
    articleDate,
    previewImageUrl,
    previewImageAlt,
    author,
    tags,
    views,
    h1,
    h1Paragraphs,
    h2,
    h2Paragraphs,
    h3,
    h3Paragraphs,
    imageUrl,
    imageAlt,
    authorMedia,
  });

  let isArticleAdded;
  try {
    isArticleAdded = await newArticle.save();
  } catch (err) {
    const error = new HttpError('Creating article failed' + err, 500);
    return next(error);
  }
  if (isArticleAdded) {
    console.log(`ARTICLE WITH ID ${isArticleAdded} ADDED`);
    res.status(201).json({
      id: isArticleAdded,
      h1,
    });
    return;
  }
  const error = new HttpError('Creating article failed at the end', 409);
  return next(error);
};

const getNextArticleId = async (req, res, next) => {
  try {
    const articleInstance = new Article();
    const nextArticleId = await articleInstance.getNextPK();

    console.log(`Next article will be with id ${nextArticleId}`);

    if (nextArticleId === 0) {
      const error = new HttpError(`Error fetching next PK`, 404);
      return next(error);
    }

    res.status(200).json(nextArticleId);
  } catch (err) {
    const error = new HttpError('Fetching news failed on BE', 500);
    return next(error);
  }
};

export { getAllNews, getNewsById, addArticle, getNextArticleId };
