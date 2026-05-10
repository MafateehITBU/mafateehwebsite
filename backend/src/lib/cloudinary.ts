import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { cloudinaryConfigured, env } from "../config/env";
import { HttpError } from "./httpError";

export function initCloudinary(): void {
  if (!cloudinaryConfigured()) return;
  const e = env();
  cloudinary.config({
    cloud_name: e.CLOUDINARY_CLOUD_NAME,
    api_key: e.CLOUDINARY_API_KEY,
    api_secret: e.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function uploadBuffer(
  buffer: Buffer,
  folder: string,
  filename?: string
): Promise<{ url: string; publicId: string }> {
  if (!cloudinaryConfigured()) {
    throw new HttpError(503, "Cloudinary is not configured");
  }
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: `mafateeh/${folder}`,
        public_id: filename,
        resource_type: "image",
      },
      (err, result) => {
        if (err || !result) {
          reject(err ?? new Error("Upload failed"));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    Readable.from(buffer).pipe(upload);
  });
}
