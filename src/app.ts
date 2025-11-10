import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import userRoutes from './routes/user.route.js';
import sessionRoutes from './routes/session.route.js';
import videoRoutes from './routes/video.route.js';
import { ApiError } from './utils/apiError.js';
import { ApiResponse } from './utils/apiResponse.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/videos', videoRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json(new ApiResponse(200, { status: 'OK' }, 'Server is running'));
});

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, 'Route not found'));
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

export default app;
