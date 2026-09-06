import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Document } from '../models/Document';
import seedData from './seed-data.json';

dotenv.config();

export const runSeed = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('ERROR: MONGODB_URI environment variable is missing.');
    process.exit(1);
  }

  console.log('====================================================');
  console.log('🌱 TeamVault Database Seed & Migration Initializing');
  console.log('====================================================');
  console.log(`Connecting to MongoDB...`);

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    // Clear existing collections
    console.log('Clearing existing collections (Users, Documents)...');
    await User.deleteMany({});
    await Document.deleteMany({});

    // Seed Users
    console.log('\n--- Seeding Demo Users ---');
    const seededUsers = [];
    for (const u of seedData.users) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      const user = new User({
        _id: new mongoose.Types.ObjectId(u._id),
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: u.role,
        isAdmin: u.isAdmin,
      });
      await user.save();
      seededUsers.push({
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role,
        isAdmin: u.isAdmin,
        _id: u._id,
      });
      console.log(`✓ User created: [${u.name}] ${u.email} (Role: ${u.role}, ID: ${u._id})`);
    }

    // Seed Documents
    console.log('\n--- Seeding Demo Documents ---');
    const seededDocuments = [];
    for (const d of seedData.documents) {
      const doc = new Document({
        _id: new mongoose.Types.ObjectId(d._id),
        title: d.title,
        content: d.content,
        ownerId: new mongoose.Types.ObjectId(d.ownerId),
      });
      await doc.save();
      seededDocuments.push({
        title: d.title,
        ownerId: d.ownerId,
        _id: d._id,
      });
      console.log(`✓ Document created: "${d.title}" (Owner: ${d.ownerId}, Doc ID: ${d._id})`);
    }

    console.log('\n====================================================');
    console.log('🎉 SEED COMPLETED SUCCESSFULLY!');
    console.log('====================================================');
    console.log('\nDeterministic Demo Accounts:');
    console.table(
      seededUsers.map((u) => ({
        Name: u.name,
        Email: u.email,
        Password: u.password,
        Role: u.role,
        isAdmin: u.isAdmin,
        ID: u._id,
      }))
    );

    console.log('\nDeterministic Demo Documents:');
    console.table(
      seededDocuments.map((d) => ({
        Title: d.title,
        OwnerID: d.ownerId,
        DocID: d._id,
      }))
    );

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (error) {
    console.error('Failed to seed database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  runSeed().then(() => {
    process.exit(0);
  });
}
