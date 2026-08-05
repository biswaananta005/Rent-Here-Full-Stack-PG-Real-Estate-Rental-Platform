const Property = require('../models/Property');
const User = require('../models/User');
const Inquiry = require('../models/Inquiry');

// @desc    Get platform metric counters
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getAdminStats = async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const pendingProperties = await Property.countDocuments({ status: 'pending' });
    const approvedProperties = await Property.countDocuments({ status: 'approved' });
    const rejectedProperties = await Property.countDocuments({ status: 'rejected' });
    const boostedProperties = await Property.countDocuments({ isBoosted: true });

    const totalUsers = await User.countDocuments();
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalBuyers = await User.countDocuments({ role: 'buyer' });

    const totalInquiries = await Inquiry.countDocuments();

    res.json({
      properties: {
        total: totalProperties,
        pending: pendingProperties,
        approved: approvedProperties,
        rejected: rejectedProperties,
        boosted: boostedProperties,
      },
      users: {
        total: totalUsers,
        sellers: totalSellers,
        buyers: totalBuyers,
      },
      inquiries: totalInquiries,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get queue of properties pending admin approval
// @route   GET /api/admin/pending-properties
// @access  Private (Admin only)
const getPendingProperties = async (req, res) => {
  try {
    const pendingProperties = await Property.find({ status: 'pending' })
      .populate('sellerId', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json(pendingProperties);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get all properties (all statuses)
// @route   GET /api/admin/all-properties
// @access  Private (Admin only)
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('sellerId', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Approve a pending property listing
// @route   PATCH /api/admin/properties/:id/approve
// @access  Private (Admin only)
const approveProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.status = 'approved';
    property.rejectionReason = '';
    await property.save();

    res.json({ message: 'Property approved successfully and is now live!', property });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Reject a pending property listing with custom reason
// @route   PATCH /api/admin/properties/:id/reject
// @access  Private (Admin only)
const rejectProperty = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    if (!rejectionReason || rejectionReason.trim() === '') {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.status = 'rejected';
    property.rejectionReason = rejectionReason;
    await property.save();

    res.json({ message: 'Property listing rejected', property });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get list of all registered platform users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Delete user account and associated properties
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete Superadmin user account' });
    }

    if (user.role === 'seller') {
      await Property.deleteMany({ sellerId: user._id });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  getAdminStats,
  getPendingProperties,
  getAllProperties,
  approveProperty,
  rejectProperty,
  getAllUsers,
  deleteUser,
};
