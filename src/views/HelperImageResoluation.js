import toast from "react-hot-toast";

// export const validateMediaFile = ({
//     file,
//     onSuccess,
//     imageConfig = {},
//     videoConfig = {},
// }) => {
//     if (!file) return;
//     const isImage = file.type.startsWith("image/");
//     const isVidoe = file.type.startsWith("video/");

//     const {
//         maxSize = 1 * 1024 * 1024, //1Mb
//         width = 1920,
//         height = 600,
//         tolerance = 5,
//     } = imageConfig;

//     const {
//         maxSize: maxVideoSize = 2 * 1024 * 1024, // 2MB
//     } = videoConfig;
//     const previewURL = URL.createObjectURL(file);
//     // Video Validation
//     if (isVidoe) {
//         if (file.size > maxVideoSize) {
//             toast.error("Video size should be less than 2 MB.");
//             return;
//         }
//         onSuccess({ file, previewURL, type: "video" });
//         return;
//     }
//     //   Image Validation
//     if (isImage) {
//         if (file.size > maxSize) {
//             toast.error("Image Size Should be less than 1 MB.");
//             return;
//         }
//         const img = new Image();
//        const widthValid = img.naturalWidth <= width;
//   const heightValid = img.naturalHeight <= height;

//     if (!widthValid || !heightValid) {
//     toast.error(
//       `Invalid image resolution. Max allowed: ${width}×${height}px`
//     );
//     return;
//   }
//     onSuccess({
//     file,
//     previewURL,
//     type: "image",
//   });
//         // img.onload = () => {
//         //     const widthValid = Math.abs(img.naturalWidth - width) <= tolerance;
//         //     const heightValid = Math.abs(img.naturalHeight - height) <= tolerance;
//         //     if (!widthValid || !heightValid) {
//         //         toast.error(`Invalid image resolution. Required: ${width}×${height}px`);
//         //         return;
//         //     }
//         //     onSuccess({
//         //         file, previewURL, type: "image"
//         //     })
//         // };
//         img.onerror = () => { toast.error("Invalid Image file.") }
//         img.src = previewURL;
//         return
//     }
//     toast.error("Only image or video files are allowed.");
// };


export const validateMediaFile = ({
  file,
  onSuccess,
  imageConfig = {},
  videoConfig = {},
}) => {
  if (!file) return;

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");

  // ✅ IMAGE CONFIG (2 MB, WIDTH ONLY)
  const {
    maxSize = 2 * 1024 * 1024, // 2MB
    width = 1920,              // Max width only
  } = imageConfig;

  // ✅ VIDEO CONFIG (2 MB)
  const {
    maxSize: maxVideoSize = 2 * 1024 * 1024, // 2MB
  } = videoConfig;

  const previewURL = URL.createObjectURL(file);

  /* ---------------- VIDEO ---------------- */
  if (isVideo) {
    if (file.size > maxVideoSize) {
      toast.error("Video size should be less than 2 MB.");
      return;
    }

    onSuccess({
      file,
      previewURL,
      type: "video",
    });
    return;
  }

  /* ---------------- IMAGE ---------------- */
  if (isImage) {
    if (file.size > maxSize) {
      toast.error("Image size should be less than 2 MB.");
      return;
    }

    const img = new Image();

    img.onload = () => {
      // ✅ Only width validation (height allowed freely)
      if (img.naturalWidth > width) {
        toast.error(`Max image width allowed is ${width}px`);
        return;
      }

      onSuccess({
        file,
        previewURL,
        type: "image",
      });
    };

    img.onerror = () => {
      toast.error("Invalid image file.");
    };

    img.src = previewURL;
    return;
  }

  toast.error("Only image or video files are allowed.");
};


// export const highervalidateMediaFile = ({
//   file,
//   onSuccess,
//   imageConfig = {},
//   videoConfig = {},
// }) => {
//   if (!file) return;

//   const isImage = file.type.startsWith("image/");
//   const isVideo = file.type.startsWith("video/");

//   // ✅ IMAGE CONFIG (2 MB, WIDTH ONLY)
//   const {
//     maxSize = 2 * 1024 * 1024, // 2MB
//   width = 2560,              // Max width only
//   } = imageConfig;

//   // ✅ VIDEO CONFIG (2 MB)
//   const {
//     maxSize: maxVideoSize = 5 * 1024 * 1024, // 2MB
//   } = videoConfig;

//   const previewURL = URL.createObjectURL(file);

//   /* ---------------- VIDEO ---------------- */
//   if (isVideo) {
//     if (file.size > maxVideoSize) {
//       toast.error("Video size should be less than 2 MB.");
//       return;
//     }

//     onSuccess({
//       file,
//       previewURL,
//       type: "video",
//     });
//     return;
//   }

//   /* ---------------- IMAGE ---------------- */
//   if (isImage) {
//     if (file.size > maxSize) {
//       toast.error("Image size should be less than 2 MB.");
//       return;
//     }

//     const img = new Image();

//     img.onload = () => {
//       // ✅ Only width validation (height allowed freely)
//       if (img.naturalWidth > width) {
//         toast.error(`Max image width allowed is ${width}px`);
//         return;
//       }

//       onSuccess({
//         file,
//         previewURL,
//         type: "image",
//       });
//     };

//     img.onerror = () => {
//       toast.error("Invalid image file.");
//     };

//     img.src = previewURL;
//     return;
//   }

//   toast.error("Only image or video files are allowed.");
// };



export const highervalidateMediaFile = ({
  file,
  onSuccess,
  imageConfig = {},
  videoConfig = {},
}) => {
  if (!file) return;

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");

  /* ---------------- IMAGE CONFIG ---------------- */
  const {
    maxSize = 2 * 1024 * 1024, // 2 MB
    width = 2000,              // Allow higher image resolution
  } = imageConfig;

  /* ---------------- VIDEO CONFIG ---------------- */
  const {
    maxSize: maxVideoSize = 8 * 1024 * 1024, // 5 MB (good quality videos)
  } = videoConfig;

  const previewURL = URL.createObjectURL(file);

  /* ---------------- VIDEO VALIDATION ---------------- */
  if (isVideo) {
    if (file.size > maxVideoSize) {
      toast.error("Video size should be less than 8 MB.");
      return;
    }

    onSuccess({
      file,
      previewURL,
      type: "video",
    });
    return;
  }

  /* ---------------- IMAGE VALIDATION ---------------- */
  if (isImage) {
    if (file.size > maxSize) {
      toast.error("Image size should be less than 2 MB.");
      return;
    }

    const img = new Image();

    img.onload = () => {
      // Only width validation (height is flexible)
      if (img.naturalWidth > width) {
        toast.error(`Max image width allowed is ${width}px`);
        return;
      }

      onSuccess({
        file,
        previewURL,
        type: "image",
      });
    };

    img.onerror = () => {
      toast.error("Invalid image file.");
    };

    img.src = previewURL;
    return;
  }

  toast.error("Only image or video files are allowed.");
};
