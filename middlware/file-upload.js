import multer from 'multer';
import { v4 } from 'uuid';

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
};

const fileUpload = multer({
  limits: 1000000, // 1mb kb
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      console.log('req.params.articleId in MULTER', req.params.articleId);
      cb(null, `uploads/news-images/${req.params.articleId}`);
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];

      cb(null, v4() + '.' + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type');
    cb(error, isValid);
  },
});

export default fileUpload;
