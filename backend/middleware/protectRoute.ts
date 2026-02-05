import dotenv from 'dotenv';
dotenv.config();
import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

export const protectRoute = (req: Request, res:Response, next:NextFunction)=>{
  console.log('protect route')
  try {
    const token = req.cookies['linkedIn-Access'];
    if(!token){
      return res.status(401).json({ message: 'Unauthorized' });
    };
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    res.locals.id = decodedToken.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}