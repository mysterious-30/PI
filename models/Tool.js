const mongoose = require('mongoose');

const ToolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Text Utilities',
      'Image Editing',
      'SEO Tools',
      'Converters',
      'Calculators',
      'Coding Tools',
      'Web Tools',
      'Other'
    ]
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'default-tool-icon.png'
  },
  tags: [{
    type: String,
    trim: true
  }],
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsed: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  inputFields: [{
    name: String,
    type: {
      type: String,
      enum: ['text', 'number', 'file', 'textarea', 'url', 'email']
    },
    required: Boolean,
    placeholder: String,
    validation: String
  }],
  outputFields: [{
    name: String,
    type: String,
    description: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
ToolSchema.index({ name: 1 });
ToolSchema.index({ category: 1 });
ToolSchema.index({ tags: 1 });

// Pre-save middleware to update timestamps
ToolSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to increment usage count
ToolSchema.methods.incrementUsage = async function() {
  this.usageCount += 1;
  this.lastUsed = new Date();
  await this.save();
};

const Tool = mongoose.model('Tool', ToolSchema);

module.exports = Tool; 