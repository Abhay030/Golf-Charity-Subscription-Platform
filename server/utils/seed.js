const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const Charity = require('../models/Charity');
const Score = require('../models/Score');

const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Charity.deleteMany();
    await Score.deleteMany();

    console.log('🗑️  Cleared existing data');

    // Create charities
    const charities = await Charity.insertMany([
      {
        name: 'Golf for Good Foundation',
        description: 'Supporting underprivileged youth through golf programs and scholarships. We believe every child deserves a chance to learn discipline and sportsmanship.',
        image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400',
        category: 'Youth Development',
        featured: true,
        website: 'https://example.com/golfforgood',
        events: [{ title: 'Annual Golf Day', date: new Date('2026-06-15'), description: 'Join us for a day of golf and fundraising' }],
      },
      {
        name: 'Green Earth Initiative',
        description: 'Dedicated to environmental conservation and creating sustainable green spaces in urban communities across the globe.',
        image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400',
        category: 'Environment',
        featured: true,
        website: 'https://example.com/greenearth',
      },
      {
        name: 'Hearts of Hope',
        description: 'Providing medical aid and emotional support to communities affected by natural disasters and poverty worldwide.',
        image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400',
        category: 'Healthcare',
        featured: true,
      },
      {
        name: 'Champions Academy',
        description: 'Training the next generation of athletes from disadvantaged backgrounds, providing coaching, equipment, and mentorship.',
        image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=400',
        category: 'Sports',
        featured: false,
      },
      {
        name: 'Literacy Bridge',
        description: 'Building libraries and providing educational resources to rural communities, empowering through knowledge and learning.',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
        category: 'Education',
        featured: true,
      },
      {
        name: 'Ocean Guardians',
        description: 'Protecting marine ecosystems through cleanup campaigns, research, and advocacy for sustainable ocean practices.',
        image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400',
        category: 'Environment',
        featured: false,
      },
    ]);

    console.log('🏛️  Created charities');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@digitalheroes.com',
      password: 'admin123',
      role: 'admin',
      subscriptionStatus: 'active',
      subscriptionPlan: 'yearly',
      subscriptionStart: new Date(),
      subscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      selectedCharity: charities[0]._id,
      charityPercentage: 15,
    });

    // Create subscriber user
    const subscriber = await User.create({
      name: 'John Golfer',
      email: 'john@example.com',
      password: 'password123',
      role: 'subscriber',
      subscriptionStatus: 'active',
      subscriptionPlan: 'monthly',
      subscriptionStart: new Date(),
      subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      selectedCharity: charities[1]._id,
      charityPercentage: 10,
    });

    // Create visitor user
    await User.create({
      name: 'Jane Visitor',
      email: 'jane@example.com',
      password: 'password123',
      role: 'visitor',
    });

    console.log('👥 Created users');

    // Create scores for subscriber
    const scores = [
      { user: subscriber._id, value: 32, date: new Date('2026-03-20') },
      { user: subscriber._id, value: 28, date: new Date('2026-03-15') },
      { user: subscriber._id, value: 35, date: new Date('2026-03-10') },
      { user: subscriber._id, value: 22, date: new Date('2026-03-05') },
      { user: subscriber._id, value: 40, date: new Date('2026-02-28') },
    ];

    await Score.insertMany(scores);

    // Update subscriber's drawNumbers
    await User.findByIdAndUpdate(subscriber._id, {
      drawNumbers: scores.map(s => s.value),
    });

    console.log('🏌️ Created scores');
    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('   Admin:      admin@digitalheroes.com / admin123');
    console.log('   Subscriber: john@example.com / password123');
    console.log('   Visitor:    jane@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error);
    process.exit(1);
  }
};

seedData();
