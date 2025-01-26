import express from 'express';
import { books, createBook, deleteBook, getAllUsersWithBooks, updateBook } from '../controllers/BookShema.js';
import { protect } from '../middlewares/authMiddleware.js';

const BookRouter = express.Router();

BookRouter.post('/create', protect, createBook);
BookRouter.get('/books/:id', protect , books)
BookRouter.get('/users', getAllUsersWithBooks)
BookRouter.put('/updatebook/:id', protect, updateBook)
BookRouter.delete('/delete/:id',protect ,deleteBook)

export default BookRouter