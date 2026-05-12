const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Product = require("./models/Product");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Create users (passwords will be hashed by the pre-save hook)
    const admin = await User.create({
      name: "Admin",
      email: "admin@shop.com",
      password: "admin123",
      role: "admin",
    });

    const customer = await User.create({
      name: "Customer",
      email: "user@shop.com",
      password: "user123",
      role: "customer",
    });

    console.log("Users seeded:");
    console.log(`  Admin  → ${admin.email} / admin123`);
    console.log(`  Customer → ${customer.email} / user123`);

    console.log("\nSeeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

seedData();
