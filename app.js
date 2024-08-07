const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const billsRoutes = require('./routes/bills-routes');
const newsRoutes = require('./routes/news-routes');
const usersRoutes = require('./routes/users-routes');
const shopListRoutes = require('./routes/shoplist-routes');
const HttpError = require('./models/http-error');
// -------------------------------------------------------
const app = express();

// will extract any json data that is coming with req and passes it to next middleware
app.use(bodyParser.json());
app.use(cookieParser());

// builds middleware that exposes the images from files
app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use(
  '/uploads/news-images',
  express.static(path.join('uploads', 'news-images'))
);

// CORS configuration middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    '*'
    /* 'GET, POST, PATCH, DELETE, PUT, HEAD, OPTIONS' */
  );
  next();
});

app.use('/api/news', newsRoutes);
app.use('/api/bills', billsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/shop-list', shopListRoutes);

// this middleware will execute if none of the above returned a response (unsupported routes)
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route', 404);
  throw error;
});

// error handler will execute if any midlleware before is throws error
app.use((error, req, res, next) => {
  if (req.file) {
    // TODO: maybe delete file from the uploads/images
    console.warn('Error with file upload');
  }
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || 'An unknown error occurred' });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER_NAME}:${
      process.env.ATLAS_PASS
    }@${process.env.DB_NAME.toLowerCase()}.d6tjshu.mongodb.net/?retryWrites=true&w=majority`,
    { dbName: process.env.DB_NAME }
  )
  .then(() => app.listen(process.env.PORT))
  .catch((err) => console.warn(err));
