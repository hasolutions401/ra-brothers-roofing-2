/**
 * Shrinks a photo on the visitor's device before upload: phone photos are
 * often 3–12 MB, which is slow on mobile data and over the host's limits.
 * The result is a JPEG no wider or taller than `maxDimension`, upright
 * (EXIF rotation applied) and without camera metadata such as location.
 *
 * Rejects when the browser cannot read the file (for example HEIC outside
 * Safari), so the form can ask for a different photo.
 */
export async function resizePhoto(file: File, maxDimension: number): Promise<File> {
  const image = await decode(file);
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image.source, 0, 0, width, height);
  image.release();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
  if (!blob) throw new Error("Could not encode the photo.");

  const name = `${file.name.replace(/\.[^.]+$/, "") || "photo"}.jpg`;
  return new File([blob], name, { type: "image/jpeg", lastModified: file.lastModified });
}

type Decoded = { source: CanvasImageSource; width: number; height: number; release: () => void };

async function decode(file: File): Promise<Decoded> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { source: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close() };
    } catch {
      // Fall through to <img>, which some browsers decode more formats with.
    }
  }

  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, release: () => URL.revokeObjectURL(url) };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
}
