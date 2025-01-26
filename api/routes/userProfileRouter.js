import express from 'express';
import { getAllUser, OwnProfile, updateProfile } from '../controllers/userProfile.js';
import { protect } from '../middlewares/authMiddleware.js';

const userProfileRouter = express.Router();

userProfileRouter.get('/profile', getAllUser)
userProfileRouter.get('/userprofile/:id', protect, OwnProfile);
userProfileRouter.put('/updateprofile/:id', protect,  updateProfile)
export default userProfileRouter