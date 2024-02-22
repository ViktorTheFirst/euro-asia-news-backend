const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { headers } = req;
  console.log('headers', headers);
  if (req.method === 'OPTIONS') return next();
  try {
    const token = headers.authorization.split(' ')[1];

    if (!token) {
      throw new Error('Authentication failed');
    }
    const decodedToken = jwt.verify(token, process.env.SECRET);
    req.userData = { userId: decodedToken.userId, email: decodedToken.email };
    next();
  } catch (err) {
    const error = new HttpError('Authentication failed ' + err, 401);
    return next(error);
  }
};
