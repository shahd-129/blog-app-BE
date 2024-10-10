import Comment from "../../../DB/Models/comment.js";
import Post from "../../../DB/Models/post.js";
import User from "../../../DB/Models/user.js";
import { message } from "../../utils/constant/message.js";
import { AppError } from "../../utils/ErrorHandling.js";

export const createComment = async (req, res, next) => {
  const { postId, text } = req.body;
  const userId = req.user.userId;
  const user = await User.findById(req.user.userId);
  if (!user) return next(new AppError(message.user.notFound, 404));
  await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
  const addComment = await Comment.create({
    postId,
    userId,
    text,
    userName: user.name,
  });

  res.status(201).json({
    message: "comment created success",
    data: addComment,
    success: true,
  });
};

export const updateComment = async (req, res, next) => {
  const findComment = await Comment.findById(req.params.id);
  if (!findComment) return next(new AppError("comment not found", 404));

  if (req.user.userId !== findComment.userId.toString()) {
    res.status(403).json({ message: "only create this comment can update" });
  }
  const update = await Comment.findByIdAndUpdate(
    req.params.id,
    { $set: { text: req.body.text } },
    { new: true }
  );
  res
    .status(200)
    .json({ message: "comment update success", success: true, data: update });
};


export const deleteComment = async (req, res) => {
  const commentId = req.params.id;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }
  
    const postId = comment.postId; 
    
    await Comment.findByIdAndDelete(commentId);

    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: -1 } });

    return res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
  }
};
