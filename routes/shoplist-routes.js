const express = require('express');
const router = express.Router();
const shopListController = require('../controllers/shoplist-controler');
const checkCookieAuth = require('../middlware/check-cookie-auth');

router.get('/shopList', shopListController.getShopListData);

//router.use(checkCookieAuth);

router.post('/shopList', shopListController.saveShopList);

router.delete('/shopList', shopListController.deleteShopList);

module.exports = router;
