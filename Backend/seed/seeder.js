/**
 * Database Seeder
 *
 * Usage:
 *           # Seed all collections (drops existing data first)
 *   node seed/seeder.js --clear  # Only clear all seeded collections
 *
 * Reads .env from the Backend root for MONGO_URI.
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../config/.env") });

const mongoose = require("mongoose");

// Models
const User = require("../model/user");
const Category = require("../model/Category");
const Book = require("../model/Book");
const Order = require("../model/Order");
const Cart = require("../model/Cart");
const Wishlist = require("../model/Wishlist");
const ExchangeRequest = require("../model/ExchangeRequest");

// Seed data
const usersData = require("./users.json");
const categoriesData = require("./categories.json");
const booksData = require("./books.json");
const ordersData = require("./orders.json");
const cartsData = require("./carts.json");
const wishlistsData = require("./wishlists.json");
const exchangeRequestsData = require("./exchangeRequests.json");

const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  process.env.DB_URL ||
  "mongodb://localhost:27017/rebook";

const clearAll = async () => {
  console.log("Clearing existing data...");
  await Category.deleteMany({});
  await User.deleteMany({});
  await Book.deleteMany({});
  await Order.deleteMany({});
  await Cart.deleteMany({});
  await Wishlist.deleteMany({});
  await ExchangeRequest.deleteMany({});
  console.log("All collections cleared.");
};

const seedAll = async () => {
  // 1. Categories
  await Category.insertMany(categoriesData);
  console.log(`  Categories: ${categoriesData.length} inserted`);

  // 2. Users — passwords get hashed by the pre-save hook,
  //    so we create them one by one.
  for (const userData of usersData) {
    await User.create(userData);
  }
  console.log(`  Users:      ${usersData.length} inserted`);

  // 3. Books
  await Book.insertMany(booksData);
  console.log(`  Books:      ${booksData.length} inserted`);

  // 4. Orders
  await Order.insertMany(ordersData);
  console.log(`  Orders:     ${ordersData.length} inserted`);

  // 5. Carts
  await Cart.insertMany(cartsData);
  console.log(`  Carts:      ${cartsData.length} inserted`);

  // 6. Wishlists
  await Wishlist.insertMany(wishlistsData);
  console.log(`  Wishlists:  ${wishlistsData.length} inserted`);

  // 7. Exchange Requests
  await ExchangeRequest.insertMany(exchangeRequestsData);
  console.log(`  Exchanges:  ${exchangeRequestsData.length} inserted`);
};

const run = async () => {
  try {
    const isClear = process.argv.includes("--clear");
    const isSeed = process.argv.includes("--seed");

    if (!isClear && !isSeed) {
      console.log("No action specified. Use:");
      console.log("  node seed/seeder.js --seed   # To clear and seed data");
      console.log("  node seed/seeder.js --clear  # To only clear data");
      process.exit(0);
    }

    console.log(`Connecting to ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log("Connected.\n");

    if (isClear || isSeed) {
      await clearAll();
    }

    if (isSeed) {
      console.log("\nSeeding data...");
      await seedAll();
      console.log("\nDone. Database seeded successfully.");
    } else if (isClear) {
      console.log("\nDone (clear only).");
    }
  } catch (err) {
    console.error("Seeder error:", err);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(0);
  }
};

if (require.main === module) {
  run();
}
