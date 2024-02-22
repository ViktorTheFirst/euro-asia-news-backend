const HttpError = require('../models/http-error');
const Bill = require('../models/bill');

const getBillsByType = async (req, res, next) => {
  const billType = req.params.billType;
  const incomingHouseholdId = req.body.householdId;
  let billsBySelectedType;
  console.log('BILLS FETCHED - billType', billType);
  console.log('BILLS FETCHED - incomingHouseholdId', incomingHouseholdId);

  try {
    billsBySelectedType = await Bill.find({
      billType,
      householdId: incomingHouseholdId,
    });
  } catch (err) {
    const error = new HttpError('Fetching bills failed', 500);
    return next(error);
  }

  console.log('AMOUNT OF BILLS ', billsBySelectedType.length);

  if (!billsBySelectedType) {
    const error = new HttpError(`There are no ${billType} type bills`, 404);
    return next(error);
  }
  res.status(200).json(billsBySelectedType);
};

const addBill = async (req, res, next) => {
  console.log('BILL ADDED');
  const {
    billType,
    confirmationNumber,
    payedAmount,
    year,
    months,
    householdId,
  } = req.body;

  const createdBill = new Bill({
    billType,
    year,
    months,
    confirmationNumber,
    payedAmount,
    householdId,
  });
  try {
    await createdBill.save();
  } catch (err) {
    const error = new HttpError('Creating bill failed', 500);
    return next(error);
  }
  res.status(201).json({
    billType,
    confirmationNumber,
    payedAmount,
    year,
    months,
    householdId,
  });
};

const editBill = async (req, res, next) => {
  console.log('BILL EDITED');
  const id = req.params.billId;

  const {
    billType,
    confirmationNumber,
    payedAmount,
    year,
    months,
    householdId,
  } = req.body;

  try {
    await Bill.updateOne(
      { _id: id, householdId },
      { billType, confirmationNumber, payedAmount, year, months }
    );
  } catch (err) {
    const error = new HttpError('Editing bill failed', 500);
    return next(error);
  }

  res.status(200).json({
    id,
    billType,
    confirmationNumber,
    payedAmount,
    year,
    months,
    householdId,
  });
};

const deleteBill = async (req, res, next) => {
  console.log('BILL DELETED');
  const id = req.params.billId;
  let deletedBill;
  try {
    deletedBill = await Bill.findByIdAndDelete({ _id: id });
  } catch (err) {
    const error = new HttpError('Deleting bill failed', 500);
    return next(error);
  }

  res.status(200).json(deletedBill);
};

exports.getBillsByType = getBillsByType;
exports.addBill = addBill;
exports.editBill = editBill;
exports.deleteBill = deleteBill;
