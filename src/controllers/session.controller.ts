import {type NextFunction, type Response} from 'express';
import { prisma } from "../lib/client.prisma.js";
import { createSessionSchema, updateSessionSchema } from '../schema/session.schema.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import {type AuthRequest } from '../middleware/auth.middleware.js';
import type { Prisma } from '@prisma/client';

export const createSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const validatedData = createSessionSchema.parse(req.body);

    const session = await prisma.session.create({
      data: {
        title: validatedData.title,
        description: validatedData.description ?? null,
        createdById: req.user!.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        videos: true,
      },
    });

    res.status(201).json(new ApiResponse(201, session, 'Session created successfully'));
  } catch (error: any) {
    next(error.issues ? new ApiError(400, error.issues[0].message) : error.message ?? error);
  }
};

export const getAllSessions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        videos: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(new ApiResponse(200, sessions));
  } catch (error) {
    next(error);
  }
};

export const getSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const session = await prisma.session.findUnique({
      where: { id: id as string },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        videos: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!session) {
      throw new ApiError(404, 'Session not found');
    }

    res.status(200).json(new ApiResponse(200, session));
  } catch (error) {
    next(error);
  }
};

export const updateSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = updateSessionSchema.parse(req.body);

    const existingSession = await prisma.session.findUnique({
      where: { id : id as string },
    });

    if (!existingSession) {
      throw new ApiError(404, 'Session not found');
    }

    if (existingSession.createdById !== req.user!.id && req.user!.role !== 'ADMIN') {
      throw new ApiError(403, 'You do not have permission to update this session');
    }

    const session = await prisma.session.update({
      where: { id : id as string },
      data: validatedData as Prisma.SessionUpdateInput,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        videos: true,
      },
    });

    res.status(200).json(new ApiResponse(200, session, 'Session updated successfully'));
  } catch (error: any) {
    next(error.issues ? new ApiError(400, error.issues[0].message) : error);
  }
};

export const deleteSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existingSession = await prisma.session.findUnique({
      where: { id : id as string },
    });

    if (!existingSession) {
      throw new ApiError(404, 'Session not found');
    }

    if (existingSession.createdById !== req.user!.id && req.user!.role !== 'ADMIN') {
      throw new ApiError(403, 'You do not have permission to delete this session');
    }

    await prisma.session.delete({
      where: { id : id as string },
    });

    res.status(200).json(new ApiResponse(200, null, 'Session deleted successfully'));
  } catch (error) {
    next(error);
  }
};

