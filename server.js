// server.js
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

// Connect to MongoDB (replace 'your_database_url' with your actual MongoDB connection string)
mongoose.connect(
  "mongodb+srv://vinitmittal14:<password>@bookrental.g6zdww1.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define a schema for rented books
const rentedBookSchema = new mongoose.Schema({
  bookTitle: String,
  firstName: String,
  lastName: String,
  email: String,
  address: String,
  rentalDate: { type: Date, default: Date.now },
});

// Create a model based on the schema
const RentedBook = mongoose.model("RentedBook", rentedBookSchema);

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to handle renting a book
app.post("/rent", async (req, res) => {
  try {
    const { bookTitle, firstName, lastName, email, address } = req.body;

    // Validate the data (you can add more validation as needed)

    // Create a new rented book instance
    const rentedBook = new RentedBook({
      bookTitle,
      firstName,
      lastName,
      email,
      address,
    });

    // Save the rented book to the database
    await rentedBook.save();

    res.status(201).json({ message: "Book rented successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
