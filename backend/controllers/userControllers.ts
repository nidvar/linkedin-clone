// Third party packages
import type { Request, Response } from 'express';

// Local imports
import User from '../models/userModel.js';

export const updateUserDetails = async (req: Request, res: Response)=>{
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });

    if(!user){
      return res.status(400).json({ message: 'User does not exist' });
    };

    const updateObject = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      headline: req.body.headline,
      about: req.body.about,
      location: req.body.location,
      skills: req.body.skills,
      experience: req.body.experience,
      education: req.body.education,
      fullName: `${req.body.firstName} ${req.body.lastName}`,
    };

    const updatedUser = await User.findByIdAndUpdate(user._id, { $set: updateObject }, { new: true }).select(
      "-password"
    );

    return res.status(200).json({ message: 'User details updated' });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error for update user details' });
  }
};

export const suggestedUsers = async (req: Request, res: Response)=>{
  try {

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error for suggested users' });
  }
};

export const getPublicProfile = async (req: Request, res: Response)=>{
  try {

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error for get public profile' });
  }
};