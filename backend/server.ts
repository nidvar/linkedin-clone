// ENV variables
import dotenv from 'dotenv';
dotenv.config();

// Third party packages
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Local imports
import { connectDB } from './lib/db.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import connectionRoutes from './routes/connectionRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({limit: '5mb'}));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/connections', connectionRoutes);

app.listen(PORT, () => {
  console.log('running on PORT: ', PORT);
})