// Third party
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { type JwtPayload } from 'jsonwebtoken';

// Models
import User from '../models/userModel.js';

// Functions
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
// import { sendWelcomeEmail } from '../utils/handleEmails.js';

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
      !validation(req.body.lastName)
    ){
      return res.status(400).json({ message: 'User details incomplete' });
    };

    function capitalizeFirstLetter(str: string) {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    const firstNameLowerCase = req.body.firstName.toLowerCase();
    const lastNameLowerCase = req.body.lastName.toLowerCase();

    const firstName = capitalizeFirstLetter(firstNameLowerCase);
    const lastName = capitalizeFirstLetter(lastNameLowerCase);

    const full_name = `${firstName} ${lastName}`;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const profilePic = 'https://robohash.org/' + req.body.firstName + '.png';

    const existingEmail = await User.findOne({ email: req.body.email });

    if(existingEmail){
      return res.status(400).json({ message: 'Email already exists' });
    };

    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      fullName: full_name,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      profilePicture: profilePic,
    });

    generateAccessToken(user._id, res);
    user.refreshToken = generateRefreshToken(user._id, res);
    await user.save();

    return res.status(200).json({ success: true });

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
    res.clearCookie('linkedInRefresh');
    res.clearCookie('linkedInAccess');

    const user = await User.findOne({ _id: req.body.userId });
    if(!user){
      return res.status(400).json({ message: 'User does not exist' });
    };

    user.refreshToken = '';
    await user.save();

    // await User.deleteMany({ password: '12345678' });

    return res.status(200).json({ message: 'logged out' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  console.log('get me')
  try {
    const user = await User.findById(res.locals.id).select('-password -refreshToken');
    if(!user){
      return res.status(400).json({ message: 'User does not exist' });
    };
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error getting current user' });
  }
};

export const refreshAccessToken = async (req: Request, res: Response)=>{
  try {
    const refreshToken = req.cookies.linkedInRefresh;
    if(!refreshToken){
      return res.status(400).json({ message: 'Refresh token not found' });
    };

    const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as JwtPayload;
    if(!decodedRefreshToken){
      return res.status(400).json({ message: 'Invalid refresh token' });
    };

    const user = await User.findById(decodedRefreshToken.id);
    if(!user){
      return res.status(400).json({ message: 'User does not exist' });
    };

    generateAccessToken(user._id, res);

    return res.status(200).json({ message: 'Access token refreshed' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error refreshing access token' });
  }
};