import { VideoSchema, type Video } from "../schema/video.schema.js";
import { prisma } from "../lib/client.prisma.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";

export const getVideos = async () => {
  const videos = await prisma.video.findMany();
  return videos;
};

export const getVideo = async (id: string) => {
  try {
    const video = await prisma.video.findUnique({
      where: {
        id,
      },
    });
    return apiResponse(video, 200);
  } catch (error : any) {
    return apiError(error.message || error || "Something went wrong", 404);
  }
};

export const createVideo = async (video: Video) => {
  try {
    const newVideo = await prisma.video.create({
      data: video,
    });
    return apiResponse(newVideo, 201);
  } catch (error : any) {
    return apiError(error.message || error || "Something went wrong", 400);
  }
};

export const updateVideo = async (id: string, video: Video) => {
  try {
    const updatedVideo = await prisma.video.update({
      where: {
        id,
      },
      data: video,
    });
    return apiResponse(updatedVideo, 200);
  } catch (error : any) {
    return apiError(error.message || error || "Something went wrong", 404);
  }
};

export const deleteVideo = async (id: string) => {
  try {
    const deletedVideo = await prisma.video.delete({
      where: {
        id,
      },
    });
    return apiResponse(deletedVideo, 200);
  } catch (error : any) {
    return apiError(error.message || error || "Something went wrong", 404);
  }
};  