// express server
require("dotenv").config();
const express = require("express");
const server = express();

const morgan = require("morgan");
server.use(morgan("dev"));

const bodyParser = require("body-parser");
server.use(bodyParser.json());

// static files
const path = require("path");

server.use("/images", express.static(path.join(__dirname, "images")));

server.use(express.static(path.join(__dirname, "build")));


// API
server.use("/api", require("./routes"));

server.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// error handler
server.use((err, req, res, next) => {
  res.status(500);
  res.send(err);
  console.error(err);
});

// DB connection
const client = require("./db/client");

// connect to the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`Server is running on ${PORT}!`);

  try {
    await client.connect();
    console.log("Database is open for business!");
  } catch (error) {
    console.error("Database is closed for repairs!\n", error);
  }
});
