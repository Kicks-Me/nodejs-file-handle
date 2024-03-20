import * as multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mimeTypes = {
    "image/png":"png",
    "image/jpeg":"jpg",
    "image/jpg":"jpg",
    "image/gif":"gif",
    "video/mp4":"mp4",
    "audio/mpeg":"mp3",
    "audio/wav":"wav",
    "application/pdf":"pdf",
    "application/vnd.ms-excel":"xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":"xlsx"
};

const accessFilePath = (fileType, reqpath) => {
  let dest = "";
  let pathType = "uploads/Others";

  if(reqpath === "/location")
  {
    pathType = "uploads/locations";
  }
  else if(reqpath === "/employee")
  {
    pathType = "uploads/employees";
  }
  else if(reqpath === "/product")
  {
    pathType = "uploads/products";
  }


  dest =
    mimeTypes[fileType] === "mp4"
      ? path.join(__dirname, "..", pathType, "video")
      : mimeTypes[fileType] === "pdf"
      ? path.join(__dirname, "..", pathType, "documents", "pdf")
      : mimeTypes[fileType] === "xls" || mimeTypes[fileType] === "xlsx"
      ? path.join(__dirname, "..", pathType, "documents", "excel")
      : mimeTypes[fileType] === "mp3" || mimeTypes[fileType] === "wav"
      ? path.join(__dirname, "..", pathType, "audio")
      : mimeTypes[fileType] === "gif"
      ? path.join(__dirname, "..", pathType, "gif")
      : path.join(__dirname, "..", pathType, "image");

  return dest;
};

const multerConfig = {
  storage: multer.diskStorage({
    destination: (req, file, callback) => {

      let dest = "";
      const fileType = file.mimetype;

      dest = accessFilePath(fileType, req?.path);

      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }

      callback(null, dest);
    },

    filename: (req, file, callback) => {
      const ext = mimeTypes[file.mimetype];
      callback(null, `${uuidv4()}.${ext}`);
    },
  }),

  fileFilter: (req, file, callback) => {
    const ext = mimeTypes[file.mimetype];

    ext === "png" ||
    ext === "jpg" ||
    ext === "gif" ||
    ext === "wav" ||
    ext === "mp3" ||
    ext === "wav" ||
    ext === "mp4" ||
    ext === "pdf" ||
    ext === "xls" ||
    ext === "xlsx"
      ? callback(null, true)
      : callback(null, false);
  },
};

export const upload = multer.default(multerConfig);

// Middleware to handle multiple files with different keys
export const handleMultipleFiles = (req, res, next) => {
  const newImages = {};

  // Process files attached to 'Profile' key
  if (req.file) {
    newImages.Profile = req.file.filename;
  }

  // Process files attached to 'Images' key
  if (req.files && req.files.length > 0) {
    newImages.Images = req.files.map((file) => file.filename);
  }

  req.newImages = newImages;
  next();
};