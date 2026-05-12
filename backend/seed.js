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
    await Product.deleteMany({});
    console.log("Cleared existing users and products");

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

    // Seed sample products
    const products = await Product.insertMany([
      {
        name: "Wireless Bluetooth Earbuds",
        price: 1499,
        description:
          "High-quality wireless earbuds with noise cancellation, 24-hour battery life, and IPX5 water resistance. Perfect for workouts and daily commute.",
      },
      {
        name: "USB-C Fast Charger 65W",
        price: 899,
        description:
          "Compact 65W GaN charger with USB-C port. Charges laptops, phones, and tablets at full speed. Universal compatibility.",
      },
      {
        name: "Smartphone Stand Holder",
        price: 349,
        description:
          "Adjustable aluminum phone stand with anti-slip base. Compatible with all phones and small tablets. Great for video calls and desk setup.",
      },
      {
        name: '27" 4K IPS Monitor',
        price: 18999,
        description:
          "Ultra-sharp 4K UHD display with 99% sRGB color accuracy, HDR10 support, and adjustable stand. Ideal for creative professionals.",
      },
      {
        name: "Mechanical Keyboard RGB",
        price: 3499,
        description:
          "Full-size mechanical keyboard with Cherry MX Blue switches, per-key RGB lighting, and detachable USB-C cable.",
      },
      {
        name: "10000mAh Power Bank",
        price: 1299,
        description:
          "Slim portable power bank with dual USB output and USB-C input. Fast charges most smartphones twice over.",
      },
    ]);

    console.log(`\nProducts seeded: ${products.length} items`);

    console.log("\nSeeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

seedData();
