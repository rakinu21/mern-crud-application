import mongoose from "mongoose";


export const connectDB = async () => {
    
    try {
        const conn = await mongoose.connect(process.env.MONGO);
        console.log(`connected to the mongo DB | ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error to connect DB :${error}`)
    }
}