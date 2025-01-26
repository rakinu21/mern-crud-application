import { User } from "../models/userShema.js";
import bcryptjs from 'bcryptjs';


export const register = async (req, res) => {
    
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'all input is required' });
        // check if user is already exist;
        const userAlreadyExist = await User.findOne({ email });
        if (userAlreadyExist) return res.status(400).json({ message: 'user already exist' });

        //hashing password 
        const hashPassword = bcryptjs.hashSync(password, 10);

        const user = await User({ name: name, email: email, password: hashPassword });

        user.save();

        res.status(200).json({
            message: 'user register is successfully',
            success: true,
            user: user
        })

    } catch (error) {
        res.status(500).json({message: `ERROR: ${error.message}`})
    }
}



