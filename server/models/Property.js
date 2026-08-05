const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  propertyType: { type: String, enum: ['PG - Boys', '1BHK', '2BHK'], required: true },
  price: { type: Number, required: true },
  deposit: { type: Number, required: true },
  location: {
    city: { type: String, required: true },
    locality: { type: String, required: true },
    address: { type: String, required: true },
  },
  images: [{ type: String, required: true }],
  amenities: [{ type: String }],
  rules: [{ type: String }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionReason: { type: String, default: '' },
  isBoosted: { type: Boolean, default: false },
  boostExpiresAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
