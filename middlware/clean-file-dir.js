import { mkdir, readdir, unlink } from 'fs/promises';
import path from 'path';
import HttpError from '../models/http-error.js';

// creates a folder for the images in uploads/news-images if this is first upload
// deletes previous image on each new upload
const clearDirectory = async (req, res, next) => {
  const directoryPath = path.join(
    process.cwd(),
    'uploads',
    'news-images',
    req.params.articleId
  );
  try {
    await mkdir(directoryPath, { recursive: true });
    console.log(`DIRECTORY ${directoryPath} CREATED FOR IMAGES`);
    /* const images = await readdir(directoryPath);

    for (const image of images) {
      await unlink(path.resolve(directoryPath, image));
    } */
    next();
  } catch (err) {
    const error = new HttpError(
      'Failed clearing file directory failed ' + err,
      500
    );
    return next(error);
  }
};

export default clearDirectory;
