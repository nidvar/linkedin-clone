// Third party
import type { Request, Response } from 'express';

// Models
import Notification from '../models/notificationModel.js';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find({ recipient: res.locals.id });
    return res.status(200).json({ notifications });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: res.locals.id
    });
    return res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if(!notification){
      return res.status(400).json({ message: 'Notification does not exist' });
    };
    notification.read = true;
    await notification.save();
    return res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};