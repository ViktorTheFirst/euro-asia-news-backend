const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const billSchema = new Schema({
  billType: { type: String, required: true },
  year: { type: String, required: true },
  householdId: { type: String, required: true },
  months: Array,
  confirmationNumber: String,
  payedAmount: String,
});

module.exports = mongoose.model('Bill', billSchema);
