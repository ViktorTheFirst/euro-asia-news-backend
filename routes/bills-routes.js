const express = require('express');
const billsController = require('../controllers/bills-controller');
const router = express.Router();
const checkCookieAuth = require('../middlware/check-cookie-auth');

router.get('/:billType', billsController.getBillsByType);

router.use(checkCookieAuth);

router.post('/addBill', billsController.addBill);

router.post('/:billId', billsController.editBill);

router.delete('/:billId', billsController.deleteBill);

module.exports = router;
