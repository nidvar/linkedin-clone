// ENV variables
import dotenv from 'dotenv';
dotenv.config();

// Third party packages
import express from 'express';
import cookieParser from 'cookie-parser';

// Local imports
import pool from './lib/db.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/api/health", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  console.log('rows ==== ', result.rows[0]);
  return res.json({ dbTime: result.rows[0] });
});

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

app.listen(PORT, ()=>{
    console.log('running on PORT: ', PORT);
})