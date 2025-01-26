import mongoose from "mongoose";

const bookShema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required:true
    },
    content: {
        type: String,
        required:true
    }
},
    {
        timestamps: true
    }
    
)

export const Book = mongoose.model('Book', bookShema)