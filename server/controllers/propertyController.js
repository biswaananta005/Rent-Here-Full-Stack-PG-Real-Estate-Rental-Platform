const Property = require('../models/Property');

// @desc    Get all APPROVED properties for public search feed
// @route   GET /api/properties
// @access  Public
const getApprovedProperties = async (req, res) => {
  try {
    const { city, propertyType, minPrice, maxPrice, amenities, search, isBoostedOnly } = req.query;

    let query = { status: 'approved' };

    if (city && city.trim() !== '') {
      query['location.city'] = { $regex: city.trim(), $options: 'i' };
    }

    if (propertyType && propertyType.trim() !== '' && propertyType !== 'All') {
      query.propertyType = propertyType.trim();
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (isBoostedOnly === 'true') {
      query.isBoosted = true;
    }

    if (amenities) {
      const amenitiesList = Array.isArray(amenities)
        ? amenities
        : amenities.split(',').map((a) => a.trim());
      if (amenitiesList.length > 0) {
        query.amenities = { $all: amenitiesList };
      }
    }

    if (search && search.trim() !== '') {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { 'location.locality': searchRegex },
        { 'location.address': searchRegex },
        { 'location.city': searchRegex },
      ];
    }

    const properties = await Property.find(query)
      .populate('sellerId', 'name email phone avatar')
      .sort({ isBoosted: -1, createdAt: -1 });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get seller's own property listings (all statuses: pending, approved, rejected)
// @route   GET /api/properties/seller
// @access  Private (Seller only)
const getSellerProperties = async (req, res) => {
  try {
    const properties = await Property.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get single property details by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('sellerId', 'name email phone avatar');
    if (!property) {
      return res.status(404).json({ message: 'Property listing not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Create new property listing (defaults to status: 'pending')
// @route   POST /api/properties
// @access  Private (Seller only)
const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      propertyType,
      price,
      deposit,
      location,
      images,
      amenities,
      rules,
    } = req.body;

    if (!title || !description || !propertyType || !price || !deposit || !location || !images || images.length === 0) {
      return res.status(400).json({ message: 'Please provide all mandatory property details and at least 1 image' });
    }

    const newProperty = await Property.create({
      sellerId: req.user._id,
      title,
      description,
      propertyType,
      price: Number(price),
      deposit: Number(deposit),
      location,
      images,
      amenities: amenities || [],
      rules: rules || [],
      status: 'pending', // Default to pending for admin approval pipeline
    });

    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Update seller's property listing
// @route   PUT /api/properties/:id
// @access  Private (Seller only)
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this listing' });
    }

    const updatedData = { ...req.body };
    updatedData.status = 'pending'; // Reset to pending for admin re-evaluation

    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Activate Ad Boost (7-day or 30-day plan)
// @route   POST /api/properties/:id/boost
// @access  Private (Seller only)
const boostProperty = async (req, res) => {
  try {
    const { boostDays } = req.body;
    const days = parseInt(boostDays) || 7;

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to boost this listing' });
    }

    const boostExpiresAt = new Date();
    boostExpiresAt.setDate(boostExpiresAt.getDate() + days);

    property.isBoosted = true;
    property.boostExpiresAt = boostExpiresAt;

    await property.save();

    res.json({
      message: `Boost activated successfully for ${days} days!`,
      property,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Delete a property listing
// @route   DELETE /api/properties/:id
// @access  Private (Seller owner or Admin)
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  getApprovedProperties,
  getSellerProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  boostProperty,
  deleteProperty,
};
