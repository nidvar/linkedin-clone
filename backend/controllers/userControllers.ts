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

    let updateHeader = {
      headline: req.body.headline,
      location: req.body.location,
      username: req.body.username
    };

    if(req.body.username != user.username){
      const usernameCheck = await User.findOne({ username: req.body.username });
      if(usernameCheck){
        return res.status(400).json({ message: 'Username already exists' });
      }
    }

    await User.findByIdAndUpdate(res.locals.id, { $set: updateHeader }, { new: true }).select(
      "-password"
    );
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
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `user_${res.locals.id}_${req.body.type}`,
      overwrite: true,
    });
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

export const updateDetails = async (req: Request, res: Response)=>{
  try {
    console.log(req.body);
    const user = await User.findOne({ _id: res.locals.id });
    if(!user){
      return res.status(400).json({ message: 'User does not exist' });
    };
    const updatedUser = await User.findByIdAndUpdate(res.locals.id, { $set: req.body }, { new: true }).select(
      "-password"
    );
    if(updatedUser){
      return res.status(200).json({ message: 'User details updated' });
    }else{
      return res.status(400).json({ message: 'User details not updated' });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error for update details' });
  }
}

export const getSelectedUsers = async (req: Request, res: Response)=>{
  try {
    console.log(req.body);
    const users = await User.find({ _id: { $in: req.body } });
    return res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error for selected Users' });
  }
}

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