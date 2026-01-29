// Third party packages
import type { Request, Response } from 'express';

// Local imports
import pool from '../lib/db.js';

export const suggestedUsers = async (req: Request, res: Response)=>{
  try {
    const unConnectedUsers = await pool.query(
      `SELECT *
        FROM users u
        WHERE u.id != $1  -- exclude current user
          AND NOT EXISTS (
            SELECT 1
            FROM connections c
            WHERE (c.requester_id = $1 AND c.addressee_id = u.id)
              OR (c.addressee_id = $1 AND c.requester_id = u.id)
          )
        ORDER BY RANDOM()
        LIMIT 3;`,
      [res.locals.id]
    );
    console.log(unConnectedUsers.rows);
    return res.status(200).json(unConnectedUsers.rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error for suggested users' });
  }
};

export const getPublicProfile = async (req: Request, res: Response)=>{
  try {
    const publicProfile = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [req.params.username]
    );
    if(!publicProfile.rows[0]){
      return res.status(404).json({ message: 'User not found' });
    };
    return res.status(200).json(publicProfile.rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error for get public profile' });
  }
};