const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log('METHOD', req.method);
  if (req.method === 'OPTIONS') return next();
  const token = req.cookies.token;

  try {
    if (!token) {
      throw new Error('Authentication failed');
    }
    const decodedToken = jwt.verify(token, process.env.SECRET);
    req.userData = { userId: decodedToken.userId, email: decodedToken.email };
    next();
  } catch (err) {
    const error = new HttpError('Authentication failed ' + err, 401);
    res.clearCookie('token');
    return next(error);
  }
};
