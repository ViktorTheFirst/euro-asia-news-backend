const { mkdir, readdir, unlink } = require('fs/promises');
const path = require('path');

const HttpError = require('../models/http-error');

// creates a folder for the images in uploads/images if this is first upload
// deletes previous image on each new upload
module.exports = async (req, res, next) => {
  const directoryPath = path.join(
    process.cwd(),
    'uploads',
    'images',
    req.params.userId
  );
  try {
    await mkdir(directoryPath, { recursive: true });
    const images = await readdir(directoryPath);

    for (const image of images) {
      await unlink(path.resolve(directoryPath, image));
    }
    next();
  } catch (err) {
    const error = new HttpError(
      'Failed clearing file directory failed ' + err,
      500
    );
    return next(error);
  }
};
