import { SessionSchema, type Session } from "../schema/session.schema.js";
import { prisma } from "../lib/client.prisma.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";

export const getSessions = async () => {
  const sessions = await prisma.session.findMany();
  return sessions;
};

export const getSession = async (id: string) => {
  try {
    const session = await prisma.session.findUnique({
      where: {
        id,
      },
    });
    return apiResponse(session, 200);
  } catch (error : any) {
    return apiError(error.message || error || "Something went wrong", 404);
  }
};

export const createSession = async (session: Session) => {
    try {
        const newSession = await prisma.session.create({
            data: session,
        });
        return apiResponse(newSession, 201);
    
    } catch (error : any) {
        return apiError(error.message || error || "Something went wrong", 400);
    }

};

export const updateSession = async (id: string, session: Session) => {
  try {
    const updatedSession = await prisma.session.update({
      where: {
        id,
      },
      data: session,
    });
    return apiResponse(updatedSession, 200);
  } catch (error : any) {
    return apiError(error.message || error || "Something went wrong", 404);
  }
};

export const deleteSession = async (id: string) => {
  try {
    const deletedSession = await prisma.session.delete({
      where: {
        id,
      },
    });
    return apiResponse(deletedSession, 200);
  } catch (error : any) {
    return apiError(error.message || error || "Something went wrong", 404);
  }
};
