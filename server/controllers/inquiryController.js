const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

// @desc    Buyer sends inquiry to property landlord
// @route   POST /api/inquiries
// @access  Private (Buyer only)
const createInquiry = async (req, res) => {
  try {
    const { propertyId, message } = req.body;

    if (!propertyId || !message) {
      return res.status(400).json({ message: 'Property ID and message are required' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const inquiry = await Inquiry.create({
      propertyId,
      buyerId: req.user._id,
      sellerId: property.sellerId,
      message,
      status: 'unread',
    });

    const populatedInquiry = await Inquiry.findById(inquiry._id)
      .populate('propertyId', 'title location price images propertyType')
      .populate('sellerId', 'name email phone')
      .populate('buyerId', 'name email phone');

    res.status(201).json(populatedInquiry);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Seller views inquiries for their property listings
// @route   GET /api/inquiries/seller
// @access  Private (Seller only)
const getSellerInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ sellerId: req.user._id })
      .populate('propertyId', 'title location price images propertyType')
      .populate('buyerId', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Buyer views sent inquiries
// @route   GET /api/inquiries/buyer
// @access  Private (Buyer only)
const getBuyerInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ buyerId: req.user._id })
      .populate('propertyId', 'title location price images propertyType')
      .populate('sellerId', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Seller updates inquiry status ('unread', 'read', 'contacted')
// @route   PATCH /api/inquiries/:id/status
// @access  Private (Seller only)
const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['unread', 'read', 'contacted'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    if (inquiry.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this inquiry' });
    }

    inquiry.status = status;
    await inquiry.save();

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  createInquiry,
  getSellerInquiries,
  getBuyerInquiries,
  updateInquiryStatus,
};
