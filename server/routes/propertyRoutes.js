const express = require('express');
const router = express.Router();
const {
  getApprovedProperties,
  getSellerProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  boostProperty,
  deleteProperty,
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public Marketplace Feed & Details
router.get('/', getApprovedProperties);
router.get('/seller', protect, authorize('seller'), getSellerProperties);
router.get('/:id', getPropertyById);

// Seller Actions
router.post('/', protect, authorize('seller'), createProperty);
router.put('/:id', protect, authorize('seller'), updateProperty);
router.post('/:id/boost', protect, authorize('seller'), boostProperty);

// Delete
router.delete('/:id', protect, deleteProperty);

module.exports = router;
