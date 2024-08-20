import { Router } from "express";
import { catchAysncErrorr } from "../../utils/ErrorHandling.js";
import { auth } from "../../Middleware/meddlewar.js";
import {
  createPost,
  deletePost,
  getAllPost,
  updatePost,
  uploadImage,
} from "./post.controllers.js";
import { fileUpload } from "../../utils/Multer.js";

const postRouter = Router();

postRouter.post(
  "/addPost",
  auth(),
  fileUpload({folder: "post"}).single("image"),
  catchAysncErrorr(createPost)
);
postRouter.put(
  "/update/:userId",
  auth(),
  fileUpload({folder: "post"}).single("image"),
  catchAysncErrorr(updatePost)
);
postRouter.delete("/delete/:id",auth() ,catchAysncErrorr(deletePost));
postRouter.get("/getAllPost", auth(), catchAysncErrorr(getAllPost));

// postRouter.post(
//   "/uploadImage",
//   fileUpload({folder: "post"}).single("image"),
//   catchAysncErrorr(uploadImage)
// );

export default postRouter;
