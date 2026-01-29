// ENV variables
import dotenv from 'dotenv';
dotenv.config();

// Third party packages
import express from 'express';
import cookieParser from 'cookie-parser';

// Local imports
import { connectDB } from './lib/db.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

app.listen(PORT, ()=>{
    console.log('running on PORT: ', PORT);
})