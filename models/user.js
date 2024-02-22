const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  householdId: String,
  profileImage: String,
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
