import type { Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';

export const generateAccessToken = function(id:Object, res:Response) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT secrets not defined in environment variables");
  }
  const token = jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
  res.cookie('linkedInAccess', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'strict',
    maxAge: 30 * 60 * 1000,
  });
};

export const generateRefreshToken = function(id:Object, res:Response) {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT secrets not defined in environment variables");
  }
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '3h' });
  res.cookie('linkedInRefresh', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'strict',
    maxAge: 3 * 60 * 60 * 1000,
  });

  return refreshToken;
};