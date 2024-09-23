import HttpError from '../models/http-error.js';
import jwt from 'jsonwebtoken';

const checkCookieAuth = async (req, res, next) => {
  console.log('METHOD', req.method);
  if (req.method === 'OPTIONS') return next();
  const token = req.cookies.token;

  try {
    if (!token) {
      throw new Error('Authentication failed');
    }
    const decodedToken = jwt.verify(token, process.env.SECRET);

    req.userData = {
      userName: decodedToken.userName,
      email: decodedToken.email,
    };
    next();
  } catch (err) {
    const error = new HttpError('Authentication failed ' + err, 401);
    res.clearCookie('token');
    return next(error);
  }
};

export default checkCookieAuth;
