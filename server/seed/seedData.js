const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');

const seedDB = async () => {
  try {
    // Always sync seed data to ensure fresh, updated locations and realistic properties
    console.log('Seeding initial production-grade demo data for Rent Here...');

    // Clear existing collections
    await User.deleteMany({});
    await Property.deleteMany({});
    await Inquiry.deleteMany({});

    // Password Hashing
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const sellerPassword = await bcrypt.hash('seller123', salt);
    const buyerPassword = await bcrypt.hash('buyer123', salt);

    // Create Users (3 Roles)
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

    const seller3 = await User.create({
      name: 'Subhashree Mohanty',
      email: 'subhashree@renthere.com',
      password: sellerPassword,
      phone: '+91 9437012345',
      role: 'seller',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
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

    const buyer3 = await User.create({
      name: 'Amitabh Dash',
      email: 'amitabh@renthere.com',
      password: buyerPassword,
      phone: '+91 9861011223',
      role: 'buyer',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    });

    // Seed Genuine Verified Properties across Bengaluru, Pune, Delhi NCR, Mumbai, Hyderabad, Chennai, Bhubaneswar
    const propertiesData = [
      {
        sellerId: seller1._id,
        title: 'Stanza Living Style Luxury Boys PG - Koramangala',
        description: 'Premium fully-furnished PG accommodation designed for working IT professionals and college students. Includes 24/7 high-speed optical fiber Wi-Fi, 3 freshly cooked nutritional North & South Indian meals daily, automated laundry service, biometric security, and daily housekeeping.',
        propertyType: 'PG - Boys',
        price: 8500,
        deposit: 17000,
        location: {
          city: 'Bengaluru',
          locality: 'Koramangala 4th Block',
          address: 'Plot #42, 80 Feet Road, Near Forum Mall, Koramangala 4th Block, Bengaluru, Karnataka 560034',
        },
        images: [
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: ['Wi-Fi', 'Power Backup', 'Food Included', 'AC', 'Housekeeping', 'Washing Machine', 'Biometric Entry', 'CCTV Security'],
        rules: ['Gate closes at 11:30 PM', 'No Smoking inside rooms', 'Visitors allowed in common reception till 8 PM'],
        status: 'approved',
        isBoosted: true,
        boostExpiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      },
      {
        sellerId: seller1._id,
        title: 'Modern 1BHK Furnished Apartment near ITPL & Manyata',
        description: 'Sunlit and airy 1BHK flat located in prime Indiranagar. Comes with fully equipped modular kitchen, inverter power backup, dedicated covered car parking, geyser, and spacious built-in wooden wardrobes.',
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
        rules: ['Families & Working Bachelors welcome', 'Maintain society silence hours after 10 PM'],
        status: 'approved',
        isBoosted: false,
      },
      {
        sellerId: seller2._id,
        title: 'Cyber Towers Executive Boys PG & Co-Living Space',
        description: 'High-tech co-living PG located 5 minutes walk from Cyber Towers Hitech City. Features high speed Wi-Fi, Playstation gaming zone, 3-time buffet meals, laundry machines, and attached private balcony bath.',
        propertyType: 'PG - Boys',
        price: 9200,
        deposit: 18400,
        location: {
          city: 'Hyderabad',
          locality: 'Hitech City',
          address: 'Lane #3, Near Cyber Towers, Madhapur, Hitech City, Hyderabad, Telangana 500081',
        },
        images: [
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: ['Wi-Fi', 'Food Included', 'AC', 'Housekeeping', 'Power Backup', 'RO Water', 'Biometric Entry'],
        rules: ['Strictly Boys PG accommodation', 'No illegal substances permitted on premises'],
        status: 'approved',
        isBoosted: true,
        boostExpiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      },
      {
        sellerId: seller2._id,
        title: 'Financial District 2BHK Luxury Gated Residency',
        description: 'Spacious 1250 sq.ft 2BHK high-rise apartment in Gachibowli. Premium modular fittings, wooden flooring, infinity swimming pool access, gymnasium, clubhouse, and 24x7 gated security.',
        propertyType: '2BHK',
        price: 28000,
        deposit: 70000,
        location: {
          city: 'Hyderabad',
          locality: 'Gachibowli',
          address: 'Tower C-604, My Home Bhooja Extension, Gachibowli, Hyderabad, Telangana 500032',
        },
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: ['Furnished', 'Swimming Pool', 'Gym', 'Club House', 'Power Backup', 'Covered Parking', 'Security 24x7'],
        rules: ['Society NOC required prior to shifting', 'Pets allowed with landlord consent'],
        status: 'approved',
        isBoosted: true,
        boostExpiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
      {
        sellerId: seller3._id,
        title: 'Patia Infocity Scholar Boys PG & Study Zone',
        description: 'Quiet, peaceful study environment engineered for KIIT students and Infocity software engineers. Features individual ergonomic study desk, high-speed fiber broadband, 3 hot meals daily, RO water purifier, and attached bath.',
        propertyType: 'PG - Boys',
        price: 6800,
        deposit: 12000,
        location: {
          city: 'Bhubaneswar',
          locality: 'Patia Infocity',
          address: 'Plot #118, Near KIIT Campus 3 & Infocity Avenue, Patia, Bhubaneswar, Odisha 751024',
        },
        images: [
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: ['Wi-Fi', 'Food Included', 'Power Backup', 'Housekeeping', 'RO Water', 'Doctor on Call'],
        rules: ['Strict study hours silence maintained in corridors', 'Curfew time 10:30 PM'],
        status: 'approved',
        isBoosted: true,
        boostExpiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      },
      {
        sellerId: seller3._id,
        title: 'Saheed Nagar Premium 1BHK Studio Apartment',
        description: 'Prime central Bhubaneswar location opposite BMC Bhawani Mall. Fully furnished with Smart TV, split AC, double bed with orthopaedic mattress, modular kitchenette, and 24-hr municipal water supply.',
        propertyType: '1BHK',
        price: 12500,
        deposit: 25000,
        location: {
          city: 'Bhubaneswar',
          locality: 'Saheed Nagar',
          address: 'Janpath Road, Opposite BMC Bhawani Mall, Saheed Nagar, Bhubaneswar, Odisha 751007',
        },
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: ['Wi-Fi', 'Furnished', 'AC', 'Elevator', 'Power Backup', 'Smart TV', 'Covered Parking'],
        rules: ['Working professionals & IT employees preferred', 'Maintain cleanliness'],
        status: 'approved',
        isBoosted: false,
      },
      {
        sellerId: seller2._id,
        title: 'Velachery OMR IT Corridor 1BHK Furnished Suite',
        description: 'Convenient 1BHK apartment situated along 100 Feet Bypass Road, Velachery. Direct connectivity to OMR tech hubs (Tidel Park, RMZ Millenia). Equipped with washing machine, geyser, split AC, and covered bike parking.',
        propertyType: '1BHK',
        price: 15500,
        deposit: 35000,
        location: {
          city: 'Chennai',
          locality: 'Velachery',
          address: '100 Feet Bypass Road, Near Grand Square Mall, Velachery, Chennai, Tamil Nadu 600042',
        },
        images: [
          'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: ['Wi-Fi', 'Furnished', 'AC', 'Geyser', 'Washing Machine', 'Power Backup', 'Security 24x7'],
        rules: ['Bachelors & IT staff welcome', 'No alteration of interior fittings'],
        status: 'approved',
        isBoosted: true,
        boostExpiresAt: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      },
      {
        sellerId: seller2._id,
        title: 'Elite 2BHK Gated Residency with Pool & Gym - Viman Nagar',
        description: 'Spacious 1100 sq.ft 2BHK flat in Clover Park View, Viman Nagar. Premium modular fittings, dedicated home office corner, landscaped garden, swimming pool, clubhouse, and biometric elevator keys.',
        propertyType: '2BHK',
        price: 26000,
        deposit: 75000,
        location: {
          city: 'Pune',
          locality: 'Viman Nagar',
          address: 'Tower B-402, Clover Park View, Viman Nagar, Pune, Maharashtra 411014',
        },
        images: [
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: ['Furnished', 'Swimming Pool', 'Gym', 'Club House', 'Power Backup', 'Security 24x7', 'Covered Parking'],
        rules: ['Maintain society quiet hours between 10 PM - 6 AM'],
        status: 'approved',
        isBoosted: false,
      },
      {
        sellerId: seller1._id,
        title: 'Golf Course Road Luxury 1BHK Penthouse - Gurugram',
        description: 'High-end 1BHK penthouse in Sector 43, Golf Course Road. Walking distance to Sector 42-43 Rapid Metro station. Features panoramic city views, split ACs, king bed with orthopaedic mattress, and automatic washing machine.',
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
        ],
        amenities: ['Wi-Fi', 'Furnished', 'AC', 'Elevator', 'Power Backup', 'Smart TV', 'Covered Parking'],
        rules: ['Non-smokers preferred', 'Security deposit non-negotiable'],
        status: 'approved',
        isBoosted: false,
      },
      {
        sellerId: seller2._id,
        title: 'Lokhandwala Sea-Breeze 2BHK Apartment - Andheri West',
        description: 'Prime Mumbai location in Lokhandwala Complex. Fully renovated interiors with marble flooring, double balcony, modular kitchen with chimney, and 24-hr municipal water supply.',
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
        ],
        amenities: ['Furnished', 'Elevator', 'Security 24x7', 'Power Backup', 'Piped Gas', 'CCTV Security'],
        rules: ['Society NOC mandatory prior to agreement'],
        status: 'approved',
        isBoosted: false,
      },

      // PENDING PROPERTIES IN ADMIN QUEUE
      {
        sellerId: seller3._id,
        title: 'Chandrasekharpur Co-Living Boys PG with Terrace Lounge',
        description: 'Newly constructed co-living space for software developers in TCS Kalinga Park area. High speed fiber internet, rooftop relaxation zone, daily housekeeping, and hot meals.',
        propertyType: 'PG - Boys',
        price: 7500,
        deposit: 15000,
        location: {
          city: 'Bhubaneswar',
          locality: 'Chandrasekharpur',
          address: 'District Center, Near Care Hospital, Chandrasekharpur, Bhubaneswar, Odisha 751016',
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
        title: 'OMR Perungudi 2BHK Flat near RMZ Millenia',
        description: 'Spacious 2BHK flat near OMR main road. Ideal for IT employees working in Perungudi / Taramani tech parks.',
        propertyType: '2BHK',
        price: 24000,
        deposit: 60000,
        location: {
          city: 'Chennai',
          locality: 'Perungudi',
          address: 'Phase 2, OMR Main Road, Perungudi, Chennai, Tamil Nadu 600096',
        },
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: ['Furnished', 'Power Backup', 'Security 24x7', 'Covered Parking'],
        rules: ['Agreement for minimum 11 months'],
        status: 'pending',
        isBoosted: false,
      },

      // REJECTED PROPERTY EXAMPLE
      {
        sellerId: seller2._id,
        title: 'Unverified Studio Flat in Old Market',
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
      message: 'Hi Vikram, I am moving to Bengaluru next week for an IT job in Koramangala. Is a single occupancy sharing room available in this PG?',
      status: 'unread',
    });

    await Inquiry.create({
      propertyId: createdProperties[4]._id, // Patia PG Bhubaneswar
      buyerId: buyer3._id,
      sellerId: seller3._id,
      message: 'Hello Subhashree, I am a KIIT B.Tech student looking for a quiet study PG in Patia Infocity. Can I visit the property this Saturday afternoon?',
      status: 'contacted',
    });

    console.log('Production-grade database seed completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDB;
