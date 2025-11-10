import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Cloudinary credentials not found");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const uploadOnCloudinary = async (
  filePath: string
): Promise<UploadApiResponse> => {
  try {
    if (!filePath) throw new Error("File path is required");
    const stats = fs.statSync(filePath);
    console.log("File cloudinary upload stats:", stats);
    if (stats.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds 20MB limit");
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "tutor-videos",
      resource_type: "video",
      allowed_formats: ["mp4", "webm", "mov"],
      max_file_size: MAX_FILE_SIZE,
    });

    console.log("Uploading file:", filePath);
    console.log("Upload successful:", result);
    fs.unlinkSync(filePath);

    return result;
  } catch (error: any) {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

export { uploadOnCloudinary };

export default cloudinary;
