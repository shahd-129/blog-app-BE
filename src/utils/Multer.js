import fs from "fs";
import path from "path";
import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";



export const fileUpload = ({ folder}) => {
  const storage = diskStorage({
    destination: (req, file, cb) => {
      const fullPath = path.resolve(`uploads/${folder}`);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      cb(null, `uploads/${folder}`);
    },
    filename: (req, file, cb) => {
      cb(null, nanoid() + file.originalname);
    },
  });

 const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      // console.log(file.mimetype);
      
      return cb(null, true);
    }
    return cb(new Error("invalid file format"), false);
  };
  return multer({ storage, fileFilter });
};

