// Third party packages
import type { Request, Response } from 'express';

// Local imports


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