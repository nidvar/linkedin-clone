// Third party packages
import type { Request, Response } from 'express';

// Local imports
import cloudinary from '../lib/cloudinary.js';

// Models
import User from '../models/userModel.js';
import ConnectionRequest from '../models/connectionModel.js';
import mongoose from 'mongoose';

export const updateHeaderDetails = async (req: Request, res: Response)=>{
  try {
    const user = await User.findOne({ _id: res.locals.id });
    if(!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }
    if(req.body.updateType === 'header'){
      let updateHeader:any = {};
      updateHeader.headline = req.body.headline;
      updateHeader.location = req.body.location;
      if(req.body.username !== ''){
        const usernameExists = await User.findOne({ username: req.body.username });
        if(usernameExists){
          return res.status(400).json({ message: 'Username already exists' });
        }else{
          updateHeader.username = req.body.username;
        }
      };
      const updatedUser = await User.findByIdAndUpdate(res.locals.id, { $set: updateHeader }, { new: true }).select(
        "-password"
      );
      return res.status(200).json({ message: 'User details updated' });
    };
    return res.status(200).json({ message: 'User details updated' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error for update user details' });
  }
}

export const updateImage = async (req: Request, res: Response)=>{
  try {
    const user = await User.findOne({ _id: res.locals.id });
    if(!user) {
      return res.status(400).json({ message: 'User does not exist' });
    };
    const result = await cloudinary.uploader.upload(req.body.image);
    const cloudinaryImage = result.secure_url;

    if(req.body.type === 'profilePic'){
      const updatedUser = await User.findByIdAndUpdate(res.locals.id, { $set: { profilePicture: cloudinaryImage } }, { new: true }).select(
        "-password"
      );
    }else{
      const updatedUser = await User.findByIdAndUpdate(res.locals.id, { $set: { bannerImg: cloudinaryImage } }, { new: true }).select(
        "-password"
      );
    }

    return res.status(200).json({ message: 'Profile picture updated' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error for update profile picture' });
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