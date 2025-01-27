import { User } from "../models/userShema.js";
import bcryptjs from 'bcryptjs'

export const OwnProfile = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(401).json({ message: 'user not found' });

        res.status(200).json({
            message: 'fetched user successfully',
            success:true,
            user: user
        }
            
        )
    } catch (error) {
        
    }
}


export const getAllUser = async (req, res) => {
    try {
        const allUser = await User.find().select('-password');
        if (allUser.length === 0) return res.status(401).json({ message: 'Empty User' });
        res.status(200).json({
            message: 'success to get all user',
            user: allUser
        })
    } catch (error) {
        res.status(500).json({message:`ERROR : ${error.message}`})
    }
}

export const updateProfile = async (req, res) => {
    
    try {
        const userId = req.params.id;
        const { name, email, password } = req.body;
        const user = await User.findById(userId).select('-password');

        if (name)  user.name = name;
        if (email) user.email = email;
        if (password) user.password = bcryptjs.hashSync(password, 10);

        const updatedUserProfile = await user.save();

        res.status(200).json({
            message: 'user updated successfully',
            success: true,
            user: updatedUserProfile
        })

    } catch (error) {
        res.status(500).json({message:`ERROR : ${error.message}`})
    }
}
