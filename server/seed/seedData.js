const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');

const seedDB = async () => {
  try {
    // Check if admin user already exists to prevent duplicate seeding loops
    const existingAdmin = await User.findOne({ email: 'admin@renthere.com' });
    if (existingAdmin) {
      console.log('Database already seeded. Skipping seed execution.');
      return;
    }

    console.log('Seeding initial production-grade demo data for Rent Here...');

    // Clear existing collections if any
    await User.deleteMany({});
    await Property.deleteMany({});
    await Inquiry.deleteMany({});

    // Password Hashing
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const sellerPassword = await bcrypt.hash('seller123', salt);
    const buyerPassword = await bcrypt.hash('buyer123', salt);

    // Create Users
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@renthere.com',
      password: adminPassword,
      phone: '+91 9876543210',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    });

    const seller1 = await User.create({
      name: 'Vikram Sharma',
      email: 'seller@renthere.com',
      password: sellerPassword,
      phone: '+91 9812345678',
      role: 'seller',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    });

    const seller2 = await User.create({
      name: 'Anand Verma',
      email: 'anand@renthere.com',
      password: sellerPassword,
      phone: '+91 9765432109',
      role: 'seller',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    });

    const buyer1 = await User.create({
      name: 'Rahul Kumar',
      email: 'buyer@renthere.com',
      password: buyerPassword,
      phone: '+91 9123456789',
      role: 'buyer',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
    });

    const buyer2 = await User.create({
      name: 'Rohit Singh',
      email: 'rohit@renthere.com',
      password: buyerPassword,
      phone: '+91 9988776655',
      role: 'buyer',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    });

    // Seed Properties
    const propertiesData = [
      {
        sellerId: seller1._id,
        title: 'Stanza Living Style Luxury Boys PG - Koramangala',
        description: 'Premium fully-furnished PG accommodation specifically designed for college students and working professionals. Features 24/7 high-speed fiber internet, 3-time freshly prepared North & South Indian meals, daily housekeeping, and gaming lounge access.',
        propertyType: 'PG - Boys',
        price: 8500,
        deposit: 17000,
        location: {
          city: 'Bengaluru',
          locality: 'Koramangala 4th Block',
          address: 'Plot #42, 80 Feet Road, Near Forum Mall, Koramangala, Bengaluru, Karnataka 560034',
        },
        images: [
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: ['Wi-Fi', 'Power Backup', 'Food Included', 'AC', 'Housekeeping', 'Washing Machine', 'Biometric Entry', 'CCTV Security'],
        rules: ['Gate closes at 11:30 PM', 'No Smoking inside rooms', 'Visitors allowed till 8 PM'],
        status: 'approved',
        isBoosted: true,
        boostExpiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      },
      {
        sellerId: seller1._id,
        title: 'Modern 1BHK Furnished Apartment with Balcony',
        description: 'Sunlit and airy 1BHK flat located in prime Indiranagar. Comes with a fully modular kitchen, high-efficiency inverter backup, covered car parking, and modern wooden wardrobes.',
        propertyType: '1BHK',
        price: 18500,
        deposit: 50000,
        location: {
          city: 'Bengaluru',
          locality: 'Indiranagar',
          address: '12th Main Road, 100 Feet Road Crossing, Indiranagar, Bengaluru, Karnataka 560038',
        },
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: ['Wi-Fi', 'Furnished', 'Power Backup', 'Geyser', 'Covered Parking', 'Elevator', 'Security 24x7'],
        rules: ['Families & Bachelors welcome', 'No loud music after 10 PM'],
        status: 'approved',
        isBoosted: false,
      },
      {
        sellerId: seller2._id,
        title: 'Elite 2BHK Gated Residency with Swimming Pool & Gym',
        description: 'Spacious 1100 sq.ft 2BHK luxury flat in Viman Nagar. Premium modular fittings, dedicated workspace corner, landscaped garden, swimming pool, club house access, and biometric elevator locks.',
        propertyType: '2BHK',
        price: 26000,
        deposit: 75000,
        location: {
          city: 'Pune',
          locality: 'Viman Nagar',
          address: 'Tower B-402, Clover Park View, Viman Nagar, Pune, Maharashtra 411014',
        },
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: ['Furnished', 'Swimming Pool', 'Gym', 'Club House', 'Power Backup', 'Security 24x7', 'CCTV Security', 'Covered Parking'],
        rules: ['Pets allowed with prior notification', 'Maintain society silence hours'],
        status: 'approved',
        isBoosted: true,
        boostExpiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      },
      {
        sellerId: seller2._id,
        title: 'Kota Scholar Boys PG & Study Zone (Near Allen Samyan)',
        description: 'Quiet, peaceful study environment engineered for JEE & NEET aspirants. Sound-proof individual study desks, ergonomic chairs, RO water purifier, 4-time hot nutritional meals, and attached bath.',
        propertyType: 'PG - Boys',
        price: 7200,
        deposit: 12000,
        location: {
          city: 'Kota',
          locality: 'Rajeev Gandhi Nagar',
          address: 'Road #2, Near Allen Samyak Landmark, Rajeev Gandhi Nagar, Kota, Rajasthan 324005',
        },
        images: [
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: ['Wi-Fi', 'Food Included', 'AC', 'Housekeeping', 'Power Backup', 'RO Water', 'Doctor on Call'],
        rules: ['Strict study hours silence', 'No late night curfew extensions'],
        status: 'approved',
        isBoosted: false,
      },
      {
        sellerId: seller1._id,
        title: 'Executive 1BHK Flat with Golf Course View',
        description: 'High-end 1BHK luxury residence in DLF Phase 5. Walking distance to Rapid Metro and Horizon Center. Includes split AC, Smart TV, double bed with orthopaedic mattress, and automatic washing machine.',
        propertyType: '1BHK',
        price: 22000,
        deposit: 44000,
        location: {
          city: 'Delhi NCR',
          locality: 'Gurugram Sec 43',
          address: 'A-Block, Golf Course Road, Sector 43, Gurugram, Haryana 122002',
        },
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: ['Wi-Fi', 'Furnished', 'AC', 'Elevator', 'Power Backup', 'Smart TV', 'Covered Parking'],
        rules: ['Bachelor friendly', 'Non-smokers preferred'],
        status: 'approved',
        isBoosted: true,
        boostExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        sellerId: seller2._id,
        title: 'Sea-Breeze 2BHK Apartment in Lokhandwala',
        description: 'Prime Andheri West location close to metro station and Lokhandwala market. Fully renovated interiors with Italian marble flooring, double balcony, modular kitchen with chimney, and 24-hr municipal water supply.',
        propertyType: '2BHK',
        price: 42000,
        deposit: 120000,
        location: {
          city: 'Mumbai',
          locality: 'Andheri West',
          address: 'Building #9, Lokhandwala Complex, Andheri West, Mumbai, Maharashtra 400053',
        },
        images: [
          'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: ['Furnished', 'Elevator', 'Security 24x7', 'Power Backup', 'Piped Gas', 'CCTV Security'],
        rules: ['Society NOC required for tenants'],
        status: 'approved',
        isBoosted: false,
      },
      // PENDING PROPERTIES FOR ADMIN APPROVAL QUEUE
      {
        sellerId: seller1._id,
        title: 'Co-Living Boys PG with Gaming Console & Terrace Garden',
        description: 'Newly constructed co-living space for modern tech professionals in Hitech City. High speed Wi-Fi, Playstation gaming zone, laundry facilities, and fresh buffet meals.',
        propertyType: 'PG - Boys',
        price: 9500,
        deposit: 19000,
        location: {
          city: 'Hyderabad',
          locality: 'Hitech City',
          address: 'Street #4, Madhapur, Near Cyber Towers, Hyderabad, Telangana 500081',
        },
        images: [
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: ['Wi-Fi', 'Food Included', 'AC', 'Housekeeping', 'Power Backup'],
        rules: ['Strictly Boys PG', 'No illegal substances'],
        status: 'pending',
        isBoosted: false,
      },
      {
        sellerId: seller2._id,
        title: 'Panoramic View 2BHK Penthouse with Private Terrace',
        description: 'Stunning penthouse available for rent in Hinjewadi Phase 1. Designed for executives working in IT Park. Smart home automation and solar water heating.',
        propertyType: '2BHK',
        price: 31000,
        deposit: 90000,
        location: {
          city: 'Pune',
          locality: 'Hinjewadi',
          address: 'Penthouse 1201, Blue Ridge Towers, Hinjewadi Phase 1, Pune, Maharashtra 411057',
        },
        images: [
          'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: ['Furnished', 'Gym', 'Swimming Pool', 'Club House', 'Power Backup'],
        rules: ['Security deposit non-negotiable'],
        status: 'pending',
        isBoosted: false,
      },
      // REJECTED PROPERTY EXAMPLE
      {
        sellerId: seller2._id,
        title: 'Unverified Studio Flat in Old Town',
        description: 'Low cost studio room for immediate shifting.',
        propertyType: '1BHK',
        price: 5000,
        deposit: 10000,
        location: {
          city: 'Delhi NCR',
          locality: 'Old Delhi',
          address: 'Lane 4, Chandni Chowk Area, Delhi 110006',
        },
        images: [
          'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: ['Geyser'],
        rules: ['No loud noise'],
        status: 'rejected',
        rejectionReason: 'Listing rejected by Admin: Property photos lack sufficient lighting and property ownership documents failed verification.',
        isBoosted: false,
      },
    ];

    const createdProperties = await Property.insertMany(propertiesData);

    // Seed Sample Inquiries
    await Inquiry.create({
      propertyId: createdProperties[0]._id, // Stanza PG
      buyerId: buyer1._id,
      sellerId: seller1._id,
      message: 'Hi Vikram, I am moving to Bengaluru next week for an IT internship in Koramangala. Is a single occupancy sharing room available in this PG?',
      status: 'unread',
    });

    await Inquiry.create({
      propertyId: createdProperties[1]._id, // Indiranagar 1BHK
      buyerId: buyer2._id,
      sellerId: seller1._id,
      message: 'Hello! I would like to schedule a site visit for this 1BHK flat on Saturday afternoon. Please let me know if key access is ready.',
      status: 'contacted',
    });

    console.log('Production-grade database seed completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDB;
