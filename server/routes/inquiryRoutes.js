const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getSellerInquiries,
  getBuyerInquiries,
  updateInquiryStatus,
} = require('../controllers/inquiryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('buyer'), createInquiry);
router.get('/seller', protect, authorize('seller'), getSellerInquiries);
router.get('/buyer', protect, authorize('buyer'), getBuyerInquiries);
router.patch('/:id/status', protect, authorize('seller'), updateInquiryStatus);

module.exports = router;
