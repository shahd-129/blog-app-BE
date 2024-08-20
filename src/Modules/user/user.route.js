import { Router } from "express";
import {
  deleteImage,
  deleteUser,
  getUserById,
  login,
  signup,
  updateUser,
  uploadImage,
} from "./user.controllers.js";
import { catchAysncErrorr } from "../../utils/ErrorHandling.js";
import { auth } from "../../Middleware/meddlewar.js";
import { fileUpload } from "../../utils/Multer.js";
import { cloudUploade } from "../../utils/Multer-cloud.js";

const userRouter = Router();

userRouter.post(
  "/signup",
  cloudUploade().single("image"),
  catchAysncErrorr(signup)
);
userRouter.post(
  "/uploadImage/:userId",
  cloudUploade().single("image"),
  catchAysncErrorr(uploadImage)
);
userRouter.post("/login", catchAysncErrorr(login));
userRouter.put(
  "/update/:userId",
  auth(),
  cloudUploade().single("image"),
  catchAysncErrorr(updateUser)
);
userRouter.delete("/delete/:userId", auth(), catchAysncErrorr(deleteUser));
// userRouter.delete("/deleteImage/:postId", auth(), catchAysncErrorr(deleteImage));
userRouter.get("/getuser/:userId", auth(), catchAysncErrorr(getUserById));

export default userRouter;
