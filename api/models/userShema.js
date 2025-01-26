import mongoose from "mongoose";

const userShema = mongoose.Schema({
    name: {
        type: String,
        required:[true, 'name is required']
    },
    email: {
        type: String,
        required: [true, 'email is required'], 
        unique:true
    },
    password: {
        type: String,
        required: [true, 'password is required'], 
        unique:true
    },

},
    {
    timestamps: true
    }
)

export const User = mongoose.model('User', userShema);

