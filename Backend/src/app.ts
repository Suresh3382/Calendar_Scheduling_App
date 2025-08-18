import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ConnectDB } from './Config/DB';
import UserRoutes from './Routes/userRoutes';
import { v2 as cloudinary } from 'cloudinary';
import { startReminderCron } from './Utils/scheduleReminders';
dotenv.config();

const app = express();
const PORT = process.env.PORT

app.use(bodyParser.json());

const corsOptions = {
    credentials: true,
    origin: '*'
};

startReminderCron();

app.use(cors(corsOptions));
app.use('/api/user/', UserRoutes)

app.listen(PORT, () => {
    ConnectDB();
    console.log("Server is Running on Port", PORT);
})
