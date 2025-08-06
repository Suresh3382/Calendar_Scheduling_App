import express from 'express';
import { Login, RefreshToken, Signup } from '../Controllers/AuthController';
import { CheckRefreshToken } from '../MiddleWares/AuthMiddleware';
const router = express.Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.post('/refresh/:refreshToken', CheckRefreshToken, RefreshToken);

export default router;

