import {Router} from 'express';
import {signup} from '../controller/AuthController.js';
import {login} from '../controller/AuthController.js';
// import { verifyToken } from '../middleware/AuthMiddleware.js';
// import { GET_USER_INFO } from '../../client/src/utils/constant.js';
const authRoutes = Router();

authRoutes.post('/signup', signup);
authRoutes.post('/login', login); 
// authRoutes.get('/user-info',verifyToken, getUserInfo)
export default authRoutes;