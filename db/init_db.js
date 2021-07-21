// code to build and initialize DB goes here
const client = require("./client");

const createInitialUsers = require("./createInitialUsers");
const createInitialProducts = require("./createInitialProducts");
const createInitialReviews = require("./createInitialReviews");
const {
  createInitialOrders,
  createInitialLineItems,
} = require("./createInitialOrders");
const {
  createInitialCategoryProducts,
  createInitialCategories,
} = require("./createInitialCategories.js");

async function buildTables() {
  client.connect();

  console.log("Building/Creating Tables...");
  try {
    console.log("Dropping All Tables...");

    await client.query(/*sql*/ `
      DROP TABLE IF EXISTS line_items;
      DROP TABLE IF EXISTS category_products;
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS categories;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS users;
    `);

    console.log("Finished dropping tables!");

    await client.query(/*sql*/ `
      CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        "isAdmin" BOOLEAN DEFAULT false
      );
      CREATE TABLE products(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL,
        quantity INTEGER,
        "imageName" VARCHAR(255) NOT NULL
      );
      CREATE TABLE categories(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
      );
      CREATE TABLE orders(
        id SERIAL PRIMARY KEY,
        "isActive" BOOLEAN DEFAULT true,
        "purchasedDate" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "userId" INTEGER REFERENCES users(id)
      );
      CREATE TABLE reviews(
        id SERIAL PRIMARY KEY,
        comment VARCHAR(255),
        rating INTEGER CHECK(rating >= 1 AND rating <=5),
        "userId" INTEGER REFERENCES users(id),
        "productId" INTEGER REFERENCES products(id)
      );
      CREATE TABLE category_products(
        id SERIAL PRIMARY KEY,
        "productId" INTEGER REFERENCES products(id),
        "categoryId" INTEGER REFERENCES categories(id),
        UNIQUE("productId", "categoryId")
      );
      CREATE TABLE line_items(
        id SERIAL PRIMARY KEY,
        "productId" INTEGER REFERENCES products(id),
        "orderId" INTEGER REFERENCES orders(id),
        price DECIMAL NOT NULL,
        quantity INTEGER NOT NULL,
        UNIQUE("productId", "orderId")
      );
    `);
  } catch (error) {
    console.error("Error while building/creating tables!");
    throw error;
  }
}

async function populateInitialData() {
  try {
    // create useful starting data
    await createInitialUsers();
    await createInitialCategories();
    await createInitialOrders();
    await createInitialProducts();
    await createInitialReviews();
    await createInitialLineItems();
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
