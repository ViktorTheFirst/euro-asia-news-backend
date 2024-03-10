const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const shopListSchema = new Schema({
  shopList: {
    type: [
      {
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        isDone: { type: Boolean, required: true },
      },
    ],
    required: true,
  },
  isChanged: { type: Boolean, required: true },
  householdId: { type: String, required: true },
});

shopListSchema.plugin(uniqueValidator);

module.exports = mongoose.model('ShopList', shopListSchema);
