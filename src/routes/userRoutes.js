import express from 'express';
import {
    getProfile,
    updateProfile,
    deleteProfilePicture
} from '../controllers/profileController.js';
import {
    verifyToken
} from '../middleware/auth.js';
import {
    upload
} from '../middleware/upload.js';

const router = express.Router();

router.get('/profile', verifyToken, getProfile);
router.put('/profile/:id', verifyToken, upload.single('profile_picture'), updateProfile);
router.delete('/profile/:id/picture', verifyToken, deleteProfilePicture);

export default router;