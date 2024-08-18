import multer from 'multer';
import { v4 } from 'uuid';

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
};

const fileUpload = multer({
  limits: 500000, // 500 kb
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/images/${req.params.userId}`);
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
