import { User } from "../models/userShema.js";
import bcryptjs from 'bcryptjs';
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
    
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'all input is required' });
        // check if user is already exist;
        const userAlreadyExist = await User.findOne({ email });
        if (userAlreadyExist) return res.status(400).json({ message: 'user already exist' });

        //hashing password 
        const hashPassword = bcryptjs.hashSync(password, 10);

        const user = new User({ name: name, email: email, password: hashPassword });

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




export const login = async (req, res) => {
    
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'all input is required' });

        //check if user is not exist;
        const isUserValid = await User.findOne({ email });
        if (!isUserValid) return res.status(401).json({ message: 'user not found' });

        //check the password hashing and compare the user password;
        const isPassword = bcryptjs.compareSync(password, isUserValid.password);
        if (!isPassword) return res.status(401).json({ message: 'invalid credentials' });

        const{password: hashPassword, ...rest} = isUserValid._doc

        const token = generateToken(isUserValid._id);

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 1 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: 'login successfully',
            success: true,
            user: rest,
            token: token
         },
        )

    } catch (error) {
         res.status(500).json({message: `ERROR: ${error.message}`})
    }
}

export const logout = async (req, res) => {
    
    try {
        res.cookie("token", '', {
            httpOnly: true,
            expires: new Date(0)
        })
        res.status(200).json({message:'logout successfully'})
    } catch (error) {
        res.status(500).json({message: `ERROR: ${error.message}`})
    }
}



