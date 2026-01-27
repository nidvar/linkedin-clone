import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import pool from './lib/db.js';

dotenv.config();

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

app.listen(PORT, ()=>{
    console.log('running on PORT: ', PORT);
})