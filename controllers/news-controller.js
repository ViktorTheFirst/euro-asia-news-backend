const HttpError = require('../models/http-error');
const Bill = require('../models/bill');
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

const getNewsByTags = async (req, res, next) => {
  const billType = req.params.billType;
  const incomingHouseholdId = req.body.householdId;
  let billsBySelectedType;
  console.log('BILLS FETCHED - billType', billType);
  console.log('BILLS FETCHED - incomingHouseholdId', incomingHouseholdId);

  try {
    billsBySelectedType = await Bill.find({
      billType,
      householdId: incomingHouseholdId,
    });
  } catch (err) {
    const error = new HttpError('Fetching bills failed', 500);
    return next(error);
  }

  console.log('AMOUNT OF BILLS ', billsBySelectedType.length);

  if (!billsBySelectedType) {
    const error = new HttpError(`There are no ${billType} type bills`, 404);
    return next(error);
  }
  res.status(200).json(billsBySelectedType);
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

const editArticle = async (req, res, next) => {
  console.log('BILL EDITED');
  const id = req.params.billId;

  const {
    billType,
    confirmationNumber,
    payedAmount,
    year,
    months,
    householdId,
  } = req.body;

  try {
    await Bill.updateOne(
      { _id: id, householdId },
      { billType, confirmationNumber, payedAmount, year, months }
    );
  } catch (err) {
    const error = new HttpError('Editing bill failed', 500);
    return next(error);
  }

  res.status(200).json({
    id,
    billType,
    confirmationNumber,
    payedAmount,
    year,
    months,
    householdId,
  });
};

const deleteArticle = async (req, res, next) => {
  console.log('BILL DELETED');
  const id = req.params.billId;
  let deletedBill;
  try {
    deletedBill = await Bill.findByIdAndDelete({ _id: id });
  } catch (err) {
    const error = new HttpError('Deleting bill failed', 500);
    return next(error);
  }

  res.status(200).json(deletedBill);
};

exports.getAllNews = getAllNews;
exports.getNewsById = getNewsById;
exports.getNewsByTags = getNewsByTags;
exports.addArticle = addArticle;
exports.editArticle = editArticle;
exports.deleteArticle = deleteArticle;
