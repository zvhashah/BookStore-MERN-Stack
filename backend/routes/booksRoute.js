import express from "express";
import { Book } from "../models/bookModel.js";
import mongoose from "mongoose";

const router = express.Router();

// Route for saving a new book
router.post("/", async (request, response) => {
  console.log("I was called to create a book");
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response.status(400).send({
        message: "Send all required fields: title, author, publishYear",
      });
    }
    const newBook = {
      title: request.body.title,
      author: request.body.author,
      publishYear: request.body.publishYear,
    };

    const doc = await Book.create(newBook);

    return response.status(201).send(doc);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Route for Get All Books from Database
router.get("/", async (request, response) => {
  console.log("I was called to fetch all books");
  try {
    const books = await Book.find({});

    return response.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Route for Getting One Book from Database by ID
router.get("/:id", async (request, response) => {
  console.log("I was called to fetch only one book with an id");
  try {
    const { id } = request.params;

    if (!mongoose.isValidObjectId(id)) {
      return response.status(400).json({ message: "Invalid Id" });
    }

    const book = await Book.findById(id);

    return response.status(200).send(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Route for Updating a Book
router.put("/:id", async (request, response) => {
  console.log("I was called to update a book by id");
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response.status(400).send({
        message: "Send all required fields: title, author and publishYear",
      });
    }

    const { id } = request.params;

    if (!mongoose.isValidObjectId(id)) {
      return response.status(400).json({ message: "Invalid Id provided" });
    }

    const result = await Book.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: "Book not found" });
    }

    return response.status(200).send({ message: "Book updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Route for Deleteing a Book
router.delete("/:id", async (request, response) => {
  console.log("I was called to delete a book by id");
  try {
    const { id } = request.params;

    const result = await Book.findByIdAndDelete(id);

    if (!result) {
      return response.status(400).json({ message: "Book not found" });
    }
    return response.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
