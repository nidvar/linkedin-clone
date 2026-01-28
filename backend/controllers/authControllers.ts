import type { Request, Response } from 'express';
import pool from '../lib/db.js';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import { sendWelcomeEmail } from '../utils/handleEmails.js';

const validation = function(value:string) {
  if(value === undefined || value === null || value === ''){
    return false;
  }else{
    return true;
  }
}

export const signUp = async (req: Request, res: Response) => {
  try {
    if(
      !validation(req.body.email) ||
      !validation(req.body.password) ||
      !validation(req.body.firstName) ||
      !validation(req.body.lastName) ||
      !validation(req.body.username)
    ){
      return res.status(400).json({ message: 'User details incomplete' });
    };

    const full_name = `${req.body.firstName} ${req.body.lastName}`;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const profilePic = 'https://robohash.org/' + req.body.firstName + '.png';

    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND username = $2',
      [req.body.email, req.body.username]
    );

    if(user.rows[0]){
      return res.status(400).json({ message: 'Username or email taken' });
    };

    await pool.query(
      'INSERT INTO users (email, password_hash, full_name, profile_image_url) VALUES ($1, $2, $3, $4)',
      [req.body.email, hashedPassword, full_name, profilePic]
    );

    const profileURL = process.env.CLIENT_URL + '/profile/' + req.body.username;

    try {
      await sendWelcomeEmail(req.body.email, full_name, profileURL);
    } catch (error) {
      console.log(error);
    }

    return res.status(200).json({ message: 'Signed Up' });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [req.body.email]
    );
    if(!user.rows[0]){
      return res.status(400).json({ message: 'User does not exist' });
    };
    const compareHashedPassword = await bcrypt.compare(req.body.password, user.rows[0].password_hash);
    if(compareHashedPassword === false){
      return res.status(400).json({ message: 'Incorrect Password' });
    };
    generateAccessToken(user.rows[0].id, res);
    const refreshToken = generateRefreshToken(user.rows[0].id, res);
    await pool.query(
      'UPDATE users SET refresh_token = $1 WHERE id = $2', 
      [refreshToken, user.rows[0].id]
    );
    return res.status(200).json({ message: 'logged in' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('linkedIn-Refresh');
    res.clearCookie('linkedIn-Access');
    await pool.query(
      'UPDATE users SET refresh_token = $1 WHERE email =$2',
      [null, req.body.email]
    );
    return res.status(200).json({ message: 'logged out' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [res.locals.id]
    );
    return res.status(200).json(user.rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};