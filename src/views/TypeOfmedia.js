export const getMediaType = (fileOrUrl) => {
  if (!fileOrUrl) return null;

  // Case 1: File object (new upload)
  if (fileOrUrl instanceof File) {
    return fileOrUrl.type.startsWith("video") ? "video" : "image";
  }

  // Case 2: URL string (existing banner)
  if (typeof fileOrUrl === "string") {
    const ext = fileOrUrl.split(".").pop().toLowerCase();
    const videoExts = ["mp4", "webm", "ogg", "mov"];
    return videoExts.includes(ext) ? "video" : "image";
  }

  return "image";
};


export const isVideo = (preview, file) => {
  // New upload
  if (preview?.startsWith("blob:") && file?.type?.startsWith("video")) {
    return true;
  }

  // Existing video URL
  if (typeof preview === "string") {
    const videoExts = ["mp4", "webm", "ogg", "mov"];
    const ext = preview.split(".").pop().toLowerCase();
    if (videoExts.includes(ext)) return true;

    // Cloudinary video URLs (important)
    if (preview.includes("/video/")) return true;
  }

  return false;
};
