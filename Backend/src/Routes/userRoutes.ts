import express from 'express';
import { Login, RefreshToken, Signup } from '../Controllers/AuthController';
import { CheckAuth, CheckRefreshToken } from '../MiddleWares/AuthMiddleware';
import { AddEvent, getEvents } from '../Controllers/EventController';
import { getLoggedUser, getUser } from '../Controllers/UserController';
const router = express.Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.post('/refresh/:refreshToken', CheckRefreshToken, RefreshToken);
router.post('/addEvent', CheckAuth, AddEvent);
router.get('/getUser/:email', CheckAuth, getUser);
router.get('/getEvents/:id', CheckAuth, getEvents);
router.get('/getLoggedUser', CheckAuth, getLoggedUser);

export default router;

