const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Post = require('./models/Post');
const Message = require('./models/Message');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Post.deleteMany({});
  await Message.deleteMany({});

  // Create users
  const users = await User.insertMany([
    {
      username: 'alice',
      email: 'alice@example.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      fullName: 'Alice Johnson',
      bio: '📸 Photography lover | ☕ Coffee addict',
      profilePicture: '',
    },
    {
      username: 'bob',
      email: 'bob@example.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
      fullName: 'Bob Smith',
      bio: '🌍 Traveler | 🎵 Music & Tech',
      profilePicture: '',
    },
    {
      username: 'charlie',
      email: 'charlie@example.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
      fullName: 'Charlie Davis',
      bio: '🎨 Artist | 🌱 Plant parent',
      profilePicture: '',
    },
  ]);

  // Set up follows
  await User.findByIdAndUpdate(users[0]._id, { following: [users[1]._id], followers: [users[2]._id] });
  await User.findByIdAndUpdate(users[1]._id, { followers: [users[0]._id], following: [users[2]._id] });
  await User.findByIdAndUpdate(users[2]._id, { following: [users[0]._id], followers: [users[1]._id] });

  // Create posts with placeholder images
  const sampleImages = [
    'https://picsum.photos/seed/post1/600/600',
    'https://picsum.photos/seed/post2/600/600',
    'https://picsum.photos/seed/post3/600/600',
    'https://picsum.photos/seed/post4/600/600',
    'https://picsum.photos/seed/post5/600/600',
    'https://picsum.photos/seed/post6/600/600',
  ];

  await Post.insertMany([
    {
      user: users[0]._id,
      image: sampleImages[0],
      caption: 'Beautiful morning! ☀️ #photography #nature',
      likes: [users[1]._id],
      comments: [{ user: users[1]._id, text: 'Stunning shot! 😍' }],
    },
    {
      user: users[0]._id,
      image: sampleImages[1],
      caption: 'Coffee time ☕ Nothing better to start the day',
      likes: [users[2]._id],
      comments: [],
    },
    {
      user: users[1]._id,
      image: sampleImages[2],
      caption: 'Exploring new cities 🌍 #travel #adventure',
      likes: [users[0]._id, users[2]._id],
      comments: [{ user: users[0]._id, text: 'Where is this?!' }],
    },
    {
      user: users[1]._id,
      image: sampleImages[3],
      caption: 'Weekend vibes 🎵',
      likes: [],
      comments: [],
    },
    {
      user: users[2]._id,
      image: sampleImages[4],
      caption: 'My latest artwork 🎨 #art #creative',
      likes: [users[0]._id, users[1]._id],
      comments: [{ user: users[1]._id, text: 'Love the colors!' }],
    },
    {
      user: users[2]._id,
      image: sampleImages[5],
      caption: 'Plant family growing 🌱',
      likes: [users[0]._id],
      comments: [],
    },
  ]);

  // Create sample messages
  await Message.insertMany([
    { sender: users[0]._id, receiver: users[1]._id, message: 'Hey Bob! Loved your travel post!' },
    { sender: users[1]._id, receiver: users[0]._id, message: 'Thanks Alice! It was an amazing trip.' },
    { sender: users[0]._id, receiver: users[1]._id, message: "We should travel together sometime 😊" },
  ]);

  console.log('✅ Seed data created!');
  console.log('\n📝 Test Credentials (all use password: "password"):');
  console.log('  alice@example.com');
  console.log('  bob@example.com');
  console.log('  charlie@example.com');

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
