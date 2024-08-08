const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
  try {
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');

      res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      );
      res.setHeader(
        'Access-Control-Allow-Methods',
        '*'
        /* 'GET, POST, PATCH, DELETE, PUT, HEAD, OPTIONS' */
      );
    }

    next();
  } catch (err) {
    const error = new HttpError('Preflight check failed ' + err, 401);
    return next(error);
  }
};
