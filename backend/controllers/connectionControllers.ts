// Third party
import type { Request, Response } from 'express';
import mongoose from 'mongoose';

// Models
import ConnectionRequest from '../models/connectionModel.js';
import Notification from '../models/notificationModel.js';
import User from '../models/userModel.js';


// get information
export const getConnectionRequests = async (req: Request, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(res.locals.id);
    const connectionRequests = await ConnectionRequest.find({ recipient: userId, status: 'pending' }).populate('sender', 'fullName profilePicture headline connections');
    if(!connectionRequests) return res.status(400).json({ message: 'No connection requests found' });
    return res.status(200).json({ connectionRequests });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error getting connection requests' });
  }
};

export const getSentRequests = async (req: Request, res: Response)=>{
  try {
    const userId = new mongoose.Types.ObjectId(res.locals.id);
    const sentRequests = await ConnectionRequest.find({ sender: userId, status: 'pending' }).populate('recipient', 'fullName profilePicture headline connections');
    if(!sentRequests) return res.status(400).json({ message: 'No connection requests found' });
    return res.status(200).json({ sentRequests });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error getting connection requests' });
  }
};

export const getSentConnectionRequests = async (req: Request, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(res.locals.id);
    const connectionRequests = await ConnectionRequest.find({ sender: userId, status: 'pending' });
    if(!connectionRequests) return res.status(400).json({ message: 'No connection requests found' });
    return res.status(200).json({ connectionRequests });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error getting connection requests' });
  }
};

export const getAllConnections = async (req: Request, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(res.locals.id);
    const user = await User.findById(userId).populate('connections', 'fullName profilePicture headline connections');
    if(!user){
      return res.status(400).json({ message: 'User does not exist' });
    }
    const connections = user.connections;
    return res.status(200).json({ connections });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error getting connections' });
  }
};

// perform action
export const acceptConnectionRequest = async (req: Request, res: Response) => {
  try {
    const currentUser = new mongoose.Types.ObjectId(res.locals.id);
    const senderId = new mongoose.Types.ObjectId(req.params.id?.toString());

    const [user, sender] = await Promise.all([
      User.findById(currentUser),
      User.findById(senderId),
    ]);

    if(!user || !sender) return res.status(400).json({ message: 'Error finding user / sender' });

    const connectionRequest = await ConnectionRequest.findOne({recipient: currentUser, sender: senderId});
    if(!connectionRequest) return res.status(400).json({ message: 'No connection request found' });
    connectionRequest.status = 'accepted';

    await connectionRequest.save();

    user.connections.push(senderId);
    await user.save();
    sender.connections.push(currentUser);
    await sender.save();

    await Notification.create({
      recipient: senderId,
      type: 'connectionAccepted',
      relatedUser: currentUser,
    });

    return res.status(200).json({ message: 'Connection request accepted' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error accepting connection request' });
  }
};

export const rejectConnectionRequest = async (req: Request, res: Response) => {
  try {
    const recipient = new mongoose.Types.ObjectId(res.locals.id);
    const sender = new mongoose.Types.ObjectId(req.params.id?.toString());

    const connectionRequest = await ConnectionRequest.findOne({recipient: recipient, sender: sender});
    if(!connectionRequest) return res.status(400).json({ message: 'No connection request found' });
    connectionRequest.status = 'rejected';
    await connectionRequest.save();

    return res.status(200).json({ message: 'Connection request rejected' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error rejecting connection request' });
  }
};

export const sendConnectionRequest = async (req: Request, res: Response) => {
  try {

    const sender = new mongoose.Types.ObjectId(res.locals.id);
    const recipient = new mongoose.Types.ObjectId(req.params.id?.toString());

    if(sender === recipient) return res.status(400).json({ message: 'You cannot send a connection request to yourself' });

    const existsingRequest = await ConnectionRequest.findOne({recipient: recipient, sender: sender});
    if(existsingRequest) return res.status(400).json({ message: 'Connection request already sent' });

    const connectionRequest = new ConnectionRequest({ 
      sender: res.locals.id,
      recipient: req.params.id
    });
    connectionRequest.save();

    return res.status(200).json({ message: 'Connection request sent' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error sending connection request' });
  }
};

export const removeConnection = async (req: Request, res: Response) => {
  try {
    const otherUserId = new mongoose.Types.ObjectId(req.params.id?.toString());
    const userId = new mongoose.Types.ObjectId(res.locals.id);

    const otherUser = await User.findById(otherUserId);
    const user = await User.findById(userId);

    if(!user || !otherUser){
      return res.status(400).json({ message: 'User / sender does not exist' });
    };

    user.connections = user.connections.filter((id) => id.toString() !== otherUserId.toString());
    otherUser.connections = otherUser.connections.filter((id) => id.toString() !== userId.toString());

    await user.save();
    await otherUser.save();

    return res.status(200).json({ message: 'Connection removed' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error removing connection' });
  }
};