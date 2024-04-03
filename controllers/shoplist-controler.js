const HttpError = require('../models/http-error');
const ShopList = require('../models/shoplist');

const getShopListData = async (req, res, next) => {
  const { householdId } = req.body;
  let shopListData;
  console.log('SHOPLIST DATA FETCHED');

  try {
    shopListData = await ShopList.findOne({
      householdId,
    });
  } catch (err) {
    const error = new HttpError('Fetching shopList data failed', 500);
    return next(error);
  }

  console.log('shopListData', shopListData);
  if (!shopListData) {
    res.status(200).json({ shopListData: {} });
  } else {
    res.status(200).json({ shopListData: shopListData.toObject() });
  }
};

const saveShopList = async (req, res, next) => {
  console.log('SHOPLIST saved');

  const { shopList, householdId } = req.body;
  let list;
  const existingList = await ShopList.findOne({ householdId });

  if (!existingList) {
    list = new ShopList({
      shopList,
      householdId,
      isChanged: false,
    });
  } else {
    list = await ShopList.findOneAndReplace(
      { householdId },
      {
        shopList,
        householdId,
        isChanged: false,
      },
      { new: true }
    );
  }

  try {
    await list.save();
  } catch (err) {
    const error = new HttpError('Creating/updating shop list failed', 500);
    return next(error);
  }
  res.status(201).json({
    list,
  });
};

const deleteShopList = async (req, res, next) => {
  console.log('SHOPLIST deleted');
  const { householdId } = req.body;

  let deletedList;
  try {
    deletedList = await ShopList.findOneAndDelete({ householdId });
  } catch (err) {
    const error = new HttpError('Deleting shop list failed', 500);
    return next(error);
  }
  res.status(200).json({
    deletedList,
  });
};

exports.getShopListData = getShopListData;
exports.saveShopList = saveShopList;
exports.deleteShopList = deleteShopList;
