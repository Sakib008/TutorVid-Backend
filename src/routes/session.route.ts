import { Router } from 'express';
import { createSession, getAllSessions, getSession, updateSession, deleteSession } from '../controllers/session.controller.js';
import { authMiddleware, adminOnly } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, adminOnly, createSession);
router.get('/', authMiddleware, getAllSessions);
router.get('/:id', authMiddleware, getSession);
router.put('/:id', authMiddleware, adminOnly, updateSession);
router.delete('/:id', authMiddleware, adminOnly, deleteSession);

export default router;
