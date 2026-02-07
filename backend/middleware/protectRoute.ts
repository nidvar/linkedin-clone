import dotenv from 'dotenv';
dotenv.config();
import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

export const protectRoute = (req: Request, res:Response, next:NextFunction)=>{
  try {
    const token = req.cookies.linkedInAccess;
    if(!token){
      return res.status(401).json({ message: 'Invalid token' });
    };
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    res.locals.id = decodedToken.id;
    next();
  } catch (error: any) {
    console.log('JWT error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      return res.status(401).json({ message: 'Middleware error' });
    }
  }
}