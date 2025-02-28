import express from 'express';
import {
  getSites,
  addSite,
  deleteSite,
  editSite,
  getNextExpiration,
} from '../controllers/sites-controller.js';

const router = express.Router();

router.get('/', getSites);

router.post('/', addSite);

router.delete('/:siteId', deleteSite);

router.post('/:siteId', editSite);

router.get('/nextExpiration', getNextExpiration);

export default router;
