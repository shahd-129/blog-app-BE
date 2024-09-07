
import multer, { diskStorage } from "multer";



export const cloudUpload = () => {
  const storage = diskStorage({
   
  });

 const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      
      return cb(null, true);
    }
    return cb(new Error("invalid file format"), false);
  };
  return multer({ storage, fileFilter });
};

