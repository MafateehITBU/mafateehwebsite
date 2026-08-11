import sharp from "sharp";

const MAX_DIMENSION = 1920;
const WEBP_QUALITY = 82;
const PNG_COMPRESSION = 9;

export async function optimizeImageBuffer(
  buffer: Buffer,
  mimetype: string
): Promise<{ buffer: Buffer; mimetype: string }> {
  let image = sharp(buffer, { failOn: "none" }).rotate();
  const meta = await image.metadata();

  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    image = image.resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  if (meta.hasAlpha || mimetype.includes("png")) {
    return {
      buffer: await image.png({ compressionLevel: PNG_COMPRESSION }).toBuffer(),
      mimetype: "image/png",
    };
  }

  return {
    buffer: await image.webp({ quality: WEBP_QUALITY }).toBuffer(),
    mimetype: "image/webp",
  };
}
