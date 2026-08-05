const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getPendingProperties,
  getAllProperties,
  approveProperty,
  rejectProperty,
  getAllUsers,
  deleteUser,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protect all admin endpoints
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/pending-properties', getPendingProperties);
router.get('/all-properties', getAllProperties);
router.patch('/properties/:id/approve', approveProperty);
router.patch('/properties/:id/reject', rejectProperty);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
