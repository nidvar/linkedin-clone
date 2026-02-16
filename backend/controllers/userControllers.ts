// Third party packages
import type { Request, Response } from 'express';

// Local imports
import cloudinary from '../lib/cloudinary.js';

// Models
import User from '../models/userModel.js';
import ConnectionRequest from '../models/connectionModel.js';
import mongoose from 'mongoose';

export const updateUserDetails = async (req: Request, res: Response)=>{
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });

    if(!user){
      return res.status(400).json({ message: 'User does not exist' });
    };

    const updateObject = {
      headline: req.body.headline,
      about: req.body.about,
      location: req.body.location,
      skills: req.body.skills,
      experience: req.body.experience,
      education: req.body.education,
      profilePic: req.body.profilePic,
      bannerImg: req.body.bannerImg
    };

    if(req.body.profilePic !== ''){
      const cloudinaryURL = await cloudinary.uploader.upload(req.body.profilePic, { folder: 'linkedin-profile' });
      updateObject.profilePic = cloudinaryURL.secure_url;
    }

    if(req.body.bannerImg !== ''){
      const cloudinaryURL = await cloudinary.uploader.upload(req.body.profilePic, { folder: 'linkedin-banner' });
      updateObject.bannerImg = cloudinaryURL.secure_url;
    }

    await User.findByIdAndUpdate(user._id, { $set: updateObject }, { new: true }).select(
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
    const currentUserId = new mongoose.Types.ObjectId(res.locals.id.toString());
    const currentUser = await User.findById(currentUserId);
    if(!currentUser){
      return res.status(400).json({ message: 'User does not exist' });
    };

    const connections = await ConnectionRequest.find({
      $or: [
        { sender: currentUserId },
        { recipient: currentUserId }
      ],
      status: { $in: ["pending", "accepted", "rejected"] }
    });

    const excludedUserIds = connections.map(conn =>
      conn.sender.toString() === currentUserId.toString()
        ? conn.recipient
        : conn.sender
    );

    excludedUserIds.push(currentUserId);

    const usersNotConnected = await User.find({
      _id: { $nin: excludedUserIds }
    });

    return res.status(200).json({ usersNotConnected });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error for suggested users' });
  }
};

export const getPublicProfile = async (req: Request, res: Response)=>{
  try {
    const username = req.params.username?.toString();
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const user = await User.findOne({ username: username }).select('-password -refreshToken');;
    if(!user){
      return res.status(400).json({ message: 'User does not exist' });
    };

    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error for get public profile' });
  }
};