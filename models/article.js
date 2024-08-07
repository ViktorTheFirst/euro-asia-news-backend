const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  itemId: String,
  articleType: String,
  previewImageURL: {
    type: String,
    required: true,
  },
  previewImageAlt: String,
  h1: {
    type: String,
    required: true,
    unique: true,
  },
  date: Date,
  tags: [String],
  h1Paragraphs: [
    {
      role: String,
      text: String,
    },
  ],
  h2: String,
  h2Paragraphs: [
    {
      role: String,
      text: String,
    },
  ],
  h3: String,
  h3Paragraphs: [
    {
      role: String,
      text: String,
    },
  ],

  imageURL: {
    type: String,
    required: true,
  },
  imageAlt: String,
  authorh4: String,
  authorParagraph: {
    role: String,
    text: String,
  },
  authorMedia: [String],
});

articleSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Article', articleSchema);
