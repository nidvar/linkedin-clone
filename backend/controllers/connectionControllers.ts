// Third party
import type { Request, Response } from 'express';

// Models
import ConnectionRequest from '../models/notificationModel.js';

export const getConnectionRequests = async (req: Request, res: Response) => {
  try {
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error getting connection requests' });
  }
};

export const acceptConnectionRequest = async (req: Request, res: Response) => {
  try {
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error accepting connection request' });
  }
};

export const rejectConnectionRequest = async (req: Request, res: Response) => {
  try {
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error rejecting connection request' });
  }
};

export const sendConnectionRequest = async (req: Request, res: Response) => {
  try {
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error sending connection request' });
  }
};

export const getAllConnections = async (req: Request, res: Response) => {
  try {
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error getting connections' });
  }
};

export const removeConnection = async (req: Request, res: Response) => {
  try {
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error removing connection' });
  }
};