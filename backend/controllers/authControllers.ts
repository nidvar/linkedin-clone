// Third party
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

// Models
import User from '../models/userModel.js';

// Functions
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

    const [existingEmail, existingUsername] = await Promise.all([
      User.findOne({ email: req.body.email }),
      User.findOne({ username: req.body.username }),
    ]);

    if(existingEmail){
      return res.status(400).json({ message: 'Email already exists' });
    };

    if(existingUsername){
      return res.status(400).json({ message: 'Username already exists' });
    };

    await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      fullName: full_name,
      username: req.body.username.toLowerCase(),
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      profilePicture: profilePic,
    });

    return res.status(200).json({ message: 'Signed Up' });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {

    const user = await User.findOne({ email: req.body.email.toLowerCase() });

    if(!user){
      return res.status(400).json({ message: 'User does not exist' });
    };

    const compareHashedPassword = await bcrypt.compare(req.body.password, user.password);

    if(compareHashedPassword === false){
      return res.status(400).json({ message: 'Incorrect Password' });
    };

    generateAccessToken(user._id, res);

    user.refreshToken = generateRefreshToken(user._id, res);

    await user.save();

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

    const user = await User.findOne({ email: req.body.email.toLowerCase() });

    if(!user){
      return res.status(400).json({ message: 'User does not exist' });
    };

    user.refreshToken = '';

    await user.save();

    return res.status(200).json({ message: 'logged out' });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};