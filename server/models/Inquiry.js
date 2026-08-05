const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'contacted'], default: 'unread' },
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
