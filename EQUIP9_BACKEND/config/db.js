const mongoose = require("mongoose");

const mongoUrl =
  "mongodb+srv://equip9_user:y7WQ79RpUNV0g1KN@equip9.savw3ih.mongodb.net/?retryWrites=true&w=majority&appName=equip9";

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const db = mongoose.connection;

module.exports = db;
