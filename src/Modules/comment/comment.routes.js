import { Router } from "express";
import { catchAysncErrorr } from "../../utils/ErrorHandling.js";
import { createComment, deleteComment, updateComment } from "./comment.controllers.js";
import { auth } from "../../Middleware/meddlewar.js";

const commentRouter =  Router()

commentRouter.post("/createComment" , auth() , catchAysncErrorr(createComment))


commentRouter.put("/updateComment/:id" , auth() , catchAysncErrorr(updateComment))
commentRouter.delete("/deleteComment/:id" , auth() , catchAysncErrorr(deleteComment))

export default commentRouter 