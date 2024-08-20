import { Router } from "express";
import { deleteImage, deleteUser, getUserById, login, signup, updateUser, uploadImage } from "./user.controllers.js";
import { catchAysncErrorr } from "../../utils/ErrorHandling.js";
import { auth } from "../../Middleware/meddlewar.js";
import { fileUpload } from "../../utils/Multer.js";

const userRouter = Router();

userRouter.post("/signup", fileUpload({folder: "user"}).single("image"), catchAysncErrorr(signup));
userRouter.post("/uploadImage/:userId", fileUpload({folder: "user"}).single("image"),catchAysncErrorr(uploadImage));
userRouter.post("/login", catchAysncErrorr(login));
userRouter.put("/update/:userId", auth(),fileUpload({folder: "user"}).single("image") ,catchAysncErrorr(updateUser));
userRouter.delete("/delete/:userId", auth(), catchAysncErrorr(deleteUser));
// userRouter.delete("/deleteImage/:postId", auth(), catchAysncErrorr(deleteImage));
userRouter.get("/getuser/:userId", auth(), catchAysncErrorr(getUserById));

export default userRouter;
