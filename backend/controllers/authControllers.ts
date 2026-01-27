import type { Request, Response } from 'express';

export const signUp = (req: Request, res: Response) => {
    try {
        console.log(req.body);
        return res.status(200).json({ message: 'Signed Up' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const login = (req: Request, res: Response) => {
    try {
        console.log(req.body);
        return res.status(200).json({ message: 'logged in' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const logout = (req: Request, res: Response) => {
    try {
        console.log(req.body);
        return res.status(200).json({ message: 'logged out' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};