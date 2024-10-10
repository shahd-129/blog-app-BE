import path from "path";
import fs from "fs";
import Post from "../../../DB/Models/post.js";
import User from "../../../DB/Models/user.js";
import { message } from "../../utils/constant/message.js";
import { AppError } from "../../utils/ErrorHandling.js";
import { cloudRemoveImage, cloudUploadeImage } from "../../utils/cloudinary.js";

export const createPost = async (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return next(new AppError("Content is required", 400));
  }

  const userId = req.user.userId;
  const user = await User.findById(userId);
  if (!user) return next(new AppError(message.user.notFound, 404));

  let imageData = null;

  if (req.file) {
    const fullPath = path.resolve(req.file.destination, req.file.filename);
    const uploadImage = await cloudUploadeImage(fullPath);

    imageData = {
      url: uploadImage.secure_url,
      publicId: uploadImage.public_id,
    };
    fs.unlinkSync(fullPath);
  }

  const addPost = await Post.create({
    content,
    userName: user.name,
    userId,
    date: new Date(),
    image: imageData,
  });

  res.status(201).json({
    message: "Post created successfully",
    data: addPost,
    success: true,
  });
};

export const updatePost = async (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return next(new AppError("Content is required", 400));
  }

  const userId = req.user.userId;
  const postId = req.params.id;
  const user = await User.findById(userId);
  if (!user) return next(new AppError("User not found", 404));

  const post = await Post.findById(postId);
  if (!post) return next(new AppError("Post not found", 404));

  if (post.userId.toString() !== userId) {
    return next(
      new AppError("You are not authorized to update this post", 403)
    );
  }

  let imageData = post.image;
  if (req.file) {
    const fullPath = path.resolve(req.file.destination, req.file.filename);
    const uploadImage = await cloudUploadeImage(fullPath);

    imageData = {
      url: uploadImage.secure_url,
      publicId: uploadImage.public_id,
    };

    fs.unlinkSync(fullPath);
  }

  post.content = content;
  post.image = imageData;
  post.date = new Date();
  const updatedPost = await post.save();
  res.status(200).json({
    message: "Post updated successfully",
    data: updatedPost,
    success: true,
  });
};

export const deletePost = async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    if (req.user.userId === post.userId.toString()) {

      if (post.image?.publicId) {
        await cloudRemoveImage(post.image.publicId);
      }

      await Post.findByIdAndDelete(req.params.id );


      const comments = await Comment.deleteMany({ postId: post._id });
    
      if (comments.deletedCount > 0) {
        return res.json({
          message: "Post and comments deleted successfully",
          success: true,
        });
      }
      
      return res.status(200).json({
        message: "Post deleted successfully",
        success: true,
      });
    } else {
      return next(new AppError("User not authorized to delete this post", 403));
    }
};


export const getAllPost = async (req, res, next) => {
  const getPost = await Post.find().populate("comments");
  res.status(200).json({ message: "success", data: getPost, success: true });
};

export const addReact = async (req, res, next) => {
  let post = await Post.findById(req.params.id);
  if (!post) return next(new AppError("post not found"));

  const postedReact = post.likes.find(
    (user) => user.toString() === req.user.userId
  );

  if (postedReact) {
    post = await Post.findByIdAndUpdate(req.params.id, {
      $pull: { likes: req.user.userId },
      new: true,
    });
  } else {
    post = await Post.findByIdAndUpdate(req.params.id, {
      $push: { likes: req.user.userId },
      new: true,
    });
  }

  res
    .status(200)
    .json({ message: "React Added Success", success: true, data: post });
};


