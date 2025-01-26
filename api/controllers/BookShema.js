
import { Book } from "../models/bookShema.js";
import { User } from "../models/userShema.js";


export const createBook = async (req, res) => {
    try {
        // Extract data from request body
        const { title, content } = req.body;

        // Extract user ID from req.user (assuming authentication middleware is used)
        const userId = req.user ? req.user._id : null;

        // Validate inputs
        if (!title || !content) {
            return res.status(400).json({ message: 'Please provide title and content' });
        }
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Optionally verify if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new book
        const newBook = new Book({
            title,
            content,
            user: userId
        });

        // Save the book
        const savedBook = await newBook.save();

        // Respond with the created book
        res.status(201).json({
            message: 'Book created successfully',
            book: savedBook
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `ERROR: ${error.message}` });
    }
};


// Get all books for the authenticated user
export const books = async (req, res) => {
    try {
        // Fetch only books that belong to the logged-in user
        const books = await Book.find({ user: req.user._id });

        return res.status(200).json({
            count: books.length,
            books: books
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ message: error.message });
    }
}


// Update a book
export const updateBook = async (req, res) => {
    try {
        const { id } = req.params; // Book ID from the URL
        const { title, content } = req.body; // New title and content

        // Validate inputs
        if (!title && !content) {
            return res.status(400).json({ message: 'Please provide at least one field to update (title or content).' });
        }

        // Find the book by ID
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found.' });
        }

        // Check if the authenticated user is the owner of the book
        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this book.' });
        }

        // Update the book fields
        if (title) book.title = title;
        if (content) book.content = content;

        const updatedBook = await book.save(); // Save the changes

        res.status(200).json({
            message: 'Book updated successfully.',
            book: updatedBook
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `ERROR: ${error.message}` });
    }
};


// Delete a book
export const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the book exists and if it belongs to the current user
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You do not have permission to delete this book' });
        }

        // Delete the book
        await Book.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ message: error.message });
    }
};




export const getAllUsersWithBooks = async (req, res) => {
    try {
        // Fetch all users
        const users = await User.find().select('-password'); // Exclude the password field
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        // Fetch books for each user and combine the data
        const usersWithBooks = await Promise.all(
            users.map(async (user) => {
                const books = await Book.find({ user: user._id }).select('title content'); // Fetch books created by this user
                return { ...user.toObject(), books }; // Combine user info with their books
            })
        );

        // Respond with the data
        res.status(200).json({
            message: 'Users and their books retrieved successfully',
            users: usersWithBooks
        });
    } catch (error) {
        res.status(500).json({ message: `ERROR: ${error.message}` });
    }
};
