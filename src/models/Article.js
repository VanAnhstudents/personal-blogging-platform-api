const mongoose = require('mongoose');
const validator = require('validator');

// Define Schema for Article
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxLength: [200, 'Title cannot exceed 200 characters'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  author: {
    type: String,
    default: 'Anonymous',
    trim: true,
  },
  tags: {
    type: [String],
    validate: {
      validator: function(tags) {
        return tags.length <= 5; // Max 5 tags
      },
      message: 'Cannot have more than 5 tags',
    },
  },
  publishedDate: {
    type: Date,
    default: Date.now,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // Auto add createdAt and updatedAt
});

// Crete index for searching and filter faster
articleSchema.index({ title: 'text', content: 'text' });
articleSchema.index({ tags: 1, publishedDate: -1 });

// Create model from schema
const Article = mongoose.model('Article', articleSchema);

module.exports = Article;