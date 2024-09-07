import { Router } from "express";
import { catchAysncErrorr } from "../../utils/ErrorHandling.js";
import { auth } from "../../Middleware/meddlewar.js";
import {
  addReact,
  createPost,
  deletePost,
  getAllPost,
  updatePost,
} from "./post.controllers.js";
import { fileUpload } from "../../utils/Multer.js";

const postRouter = Router();

postRouter.post(
  "/addPost",
  auth(),
  fileUpload({ folder: "post" }).single("image"),
  catchAysncErrorr(createPost)
);
postRouter.put(
  "/update/:id",
  auth(),
  fileUpload({ folder: "post" }).single("image"),
  catchAysncErrorr(updatePost)
);
postRouter.delete("/delete/:id", auth(), catchAysncErrorr(deletePost));
postRouter.get("/getAllPost", auth(), catchAysncErrorr(getAllPost));
postRouter.put("/like/:id", auth(), catchAysncErrorr(addReact));

// postRouter.post(
//   "/uploadImage",
//   fileUpload({folder: "post"}).single("image"),
//   catchAysncErrorr(uploadImage)
// );

export default postRouter;
