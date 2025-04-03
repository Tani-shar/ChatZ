import {Router} from 'express';
import {getUserInfo, logout, signup, updateProfile} from '../controller/AuthController.js';
import {login} from '../controller/AuthController.js';
import { verifyToken } from '../middleware/AuthMiddleware.js';
import multer from 'multer';

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

const authRoutes = Router();

authRoutes.post('/signup', signup);
authRoutes.post('/login', login); 
authRoutes.get('/user-info',verifyToken, getUserInfo); // Middleware to verify token

authRoutes.post('/update-profile', verifyToken,upload.single("profileImage"),updateProfile)
authRoutes.post('/logout', logout);

export default authRoutes;