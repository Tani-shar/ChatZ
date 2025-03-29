import {Router} from 'express';
import {signup} from '../controller/AuthController.js';
import {login} from '../controller/AuthController.js';
const authRoutes = Router();

authRoutes.post('/signup', signup);
authRoutes.post('/login', login); 

export default authRoutes;