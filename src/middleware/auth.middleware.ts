import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';

const JWT_SECRET = process.env.JWT_SECRET ;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log('No token provided in request headers');
      throw new ApiError(401, 'Authentication required');
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error while authenticating token', error);
    next(new ApiError(401, 'Invalid or expired token'));
  }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    console.log('Access denied: Admins only');
    return next(new ApiError(403, 'Admin access required'));
  }
  next();
};

