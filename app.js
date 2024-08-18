import './loadEnv.js';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import HttpError from './models/http-error.js';
import newsRoutes from './routes/news-routes.js';
import usersRoutes from './routes/users-routes.js';
import pool from './DB/db-connect.js';

// -------------------------------------------------------
const app = express();

// will extract any json data that is coming with req and passes it to next middleware
app.use(bodyParser.json());
app.use(cookieParser());

// builds middleware that exposes the images from files
app.use(
  '/uploads/news-images',
  express.static(path.join('uploads', 'news-images'))
);

// CORS configuration middleware
app.use((req, res, next) => {
  res.setHeader('Vary', 'origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Request-Headers', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, PUT, HEAD, OPTIONS'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // End the preflight request successfully
  }

  next();
});

app.use('/api/news', newsRoutes);
app.use('/api/users', usersRoutes);

app.use('/', async (req, res, next) => {
  /* const sql = 'SELECT username, email, create_time, role FROM user';
  try {
    const [rows, fields] = await pool.execute(sql);
    console.log(rows);
  } catch (error) {
    console.error('Error fetching data:', error.message);
  } */

  res.send(`This is root with req.path: ${req.path}`);
});

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

pool
  .query('SELECT 1')
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      app.listen(5001);
      console.log(`Development server started on port 5001 `);
    }

    if (process.env.NODE_ENV === 'production') {
      app.listen(process.env.PORT);
      console.log(`Production server started on port ${process.env.PORT}`);
    }
  })
  .catch((err) => console.warn(err));
