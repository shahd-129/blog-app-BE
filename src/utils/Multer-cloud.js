import fs from "fs";
import path from "path";
import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";

export const coudUpload = () => {
  const storage = diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      // console.log(file.mimetype);

      return cb(null, true);
    }
    return cb(new Error("invalid file format"), false);
  };
  return multer({ storage, fileFilter });
};
