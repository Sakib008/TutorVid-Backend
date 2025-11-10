import multer from "multer";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./tutor-videos");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
      console.log("File Read Filename: ", file);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 20,
  },
});

export default upload;
