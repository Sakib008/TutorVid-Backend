import { type NextFunction, type Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/client.prisma.js";
import {
  createVideoSchema,
  updateVideoSchema,
} from "../schema/video.schema.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import cloudinary, { uploadOnCloudinary } from "../utils/cloudinary.config.js";
import { type AuthRequest } from "../middleware/auth.middleware.js";


export const createVideo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createVideoSchema.parse(req.body);

    const session = await prisma.session.findUnique({
      where: { id: validatedData.sessionId },
    });

    if (!session) {
      throw new ApiError(404, "Session not found");
    }
      const videoFile = req.file as Express.Multer.File;
      const filePath = videoFile.path;
    if (!videoFile && !filePath) {
       new ApiError(400, "Video file is required");
    }
    const result = await uploadOnCloudinary(filePath); 
    const videoUrl = (result.secure_url ?? result.url) as string;
    const public_id = result.public_id as string;

    const video = await prisma.video.create({
      data: {
        title: validatedData.title,
        description: validatedData.description ?? null,
        url: videoUrl,
        publicId: public_id,
        duration: validatedData.duration ?? null,
        session: { connect: { id: validatedData.sessionId } },
      },
      include: {
        session: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    res
      .status(201)
      .json(new ApiResponse(201, video, "Video created successfully"));
  } catch (error: any) {
    next(error.issues ? new ApiError(400, error.issues[0].message) : error);
  }
};

export const getVideos = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const rawSessionId = req.query.sessionId;
    console.log("Request getVideos query:", req);
    const sessionId =
      typeof rawSessionId === "string"
        ? rawSessionId
        : Array.isArray(rawSessionId)
        ? rawSessionId[0]
        : undefined;

    const where: Prisma.VideoWhereInput = sessionId ? { sessionId } : {};

    const videos = await prisma.video.findMany({
      where,
      include: {
        session: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.status(200).json(new ApiResponse(200, videos));
  } catch (error) {
    next(error);
  }
};

export const getVideo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "Video id is required");

    const video = await prisma.video.findUnique({
      where: { id: id as string },
      include: {
        session: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    res.status(200).json(new ApiResponse(200, video));
  } catch (error) {
    next(error);
  }
};

export const updateVideo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "Video id is required");
    const validatedData = updateVideoSchema.parse(req.body);

    const existingVideo = await prisma.video.findUnique({
      where: { id: id as string },
    });

    if (!existingVideo) {
      throw new ApiError(404, "Video not found");
    }

    // Build a Prisma-compatible update object only with provided fields
    const data: Prisma.VideoUpdateInput = {};
    if (validatedData.title !== undefined) data.title = validatedData.title;
    if (validatedData.description !== undefined)
      data.description = validatedData.description ?? null;
    if (validatedData.url !== undefined) data.url = validatedData.url;
    if (validatedData.duration !== undefined)
      data.duration = validatedData.duration;

    const video = await prisma.video.update({
      where: { id: id as string },
      data,
      include: {
        session: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    res
      .status(200)
      .json(new ApiResponse(200, video, "Video updated successfully"));
  } catch (error: any) {
    next(error.issues ? new ApiError(400, error.issues[0].message) : error);
  }
};

export const deleteVideo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) throw new ApiError(400, "Video id is required");

    const existingVideo = await prisma.video.findUnique({
      where: { id: id as string },
    });

    if (!existingVideo) {
      throw new ApiError(404, "Video not found");
    }
    if (existingVideo.publicId) {
      await cloudinary.uploader.destroy(existingVideo.publicId, {
        resource_type: "video",
      });
    }
    await prisma.video.delete({
      where: { id: id as string },
    });

    res
      .status(200)
      .json(new ApiResponse(200, null, "Video deleted successfully"));
  } catch (error) {
    next(error);
  }
};
