import express from 'express'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';

dotenv.config();


const app = express();


// Middleware for parsing JSON, cookies, and URL-encoded data
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('hello world')
});


const PORT = process.env.PORT || 3000

app.listen(PORT, async() => {
    try {
        await connectDB()
        console.log(`Server running on PORT : ${PORT}`)
    } catch (error) {
        console.log(error)
    }
})