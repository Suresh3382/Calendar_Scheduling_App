import express from 'express';
import { Login, RefreshToken, Signup } from '../Controllers/AuthController';
import { CheckAuth, CheckRefreshToken } from '../MiddleWares/AuthMiddleware';
import { AddEvent, deleteEvent, getEvents, searchEvents } from '../Controllers/EventController';
import { getLoggedUser, getUser } from '../Controllers/UserController';
const router = express.Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.post('/refresh/:refreshToken', CheckRefreshToken, RefreshToken);
router.post('/addEvent', CheckAuth, AddEvent);
router.get('/getUser/:email', CheckAuth, getUser);
router.post('/getEvents', CheckAuth, getEvents);
router.post('/getSearchTermEvents', CheckAuth, searchEvents);
router.get('/getLoggedUser', CheckAuth, getLoggedUser);
router.post('/deleteEvent/:id', CheckAuth, deleteEvent);

export default router;

