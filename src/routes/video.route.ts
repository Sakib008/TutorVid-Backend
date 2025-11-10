import { Router } from 'express';
import { createVideo, getVideos, getVideo, updateVideo, deleteVideo } from '../controllers/video.controller.js';
import { authMiddleware, adminOnly } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = Router();

router.post('/', authMiddleware, adminOnly,upload.single('video'), createVideo);
router.get('/', authMiddleware, getVideos);
router.get('/:id', authMiddleware, getVideo);
router.delete('/:id', authMiddleware, adminOnly, deleteVideo);

export default router;
