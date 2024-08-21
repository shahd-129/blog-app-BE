import path from "path";
import fs from "fs";
import Post from "../../../DB/Models/post.js";
import User from "../../../DB/Models/user.js";
import { message } from "../../utils/constant/message.js";
import { AppError } from "../../utils/ErrorHandling.js";
import { cloudRemoveImage, cloudUploadeImage } from "../../utils/cloudinary.js";

export const createPost = async (req, res, next) => {
  const { content } = req.body;

  if (!req.file) {
    return next(new AppError("Image is required", 400));
  }

  if (!req.user.userId) {
    return next(new AppError("User is not authenticated", 401));
  }

  const fullPath = path.resolve(req.file.destination, req.file.filename);
  const uploadImage = await cloudUploadeImage(fullPath);

  const addPost = await Post.create({
    content,
    userId: req.user.userId,
    date: new Date(),
    image: {
      url: uploadImage.secure_url,
      publicId: uploadImage.public_id,
    },
  });

  fs.unlinkSync(fullPath);

  res.status(201).json({
    message: "Post created successfully",
    data: addPost,
    success: true,
  });
};

export const updatePost = async (req, res, next) => {
  const { content } = req.body;
  const existUserId = await User.findById(req.user.userId);
  if (!existUserId) return next(new AppError(message.post.notFound, 404));

  if (!req.file) {
    return next(new AppError("Image is required", 400));
    console.log(req.file);
  }

  const fullPath = path.resolve(req.file.destination, req.file.filename);
  const uploadImage = await cloudUploadeImage(fullPath);

  if (existUserId.image?.publicId) {
    await cloudRemoveImage(existUserId.image.publicId);
  }
  fs.unlinkSync(fullPath);

  existUserId.image = {
    url: uploadImage.secure_url,
    publicId: uploadImage.public_id,
  };

  if (content) existUserId.content = content;

  const updatedPost = await existUserId.save();
  if (!updatedPost) {
    next(new AppError(message.post.failToUpdate, 500));
  }

  res.status(201).json({
    message: message.post.updateSuccessfully,
    data: updatePost,
    success: true,
  });
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log("Found Post:", post);
  
    if (!post) {
      return next(new AppError("Post not found", 404));
    }
    
    if (req.user.userId === post.userId.toString()) {
      console.log("User authorized to delete the post." );
      await Post.findByIdAndDelete(req.params.id);
      await cloudRemoveImage(post.image.publicId);
      // TODO: Delete all comments related to the post
    } else {
      return next(new AppError("User not authorized to delete this post", 403));
    }
  
    res.status(200).json({
      message: "Post deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return next(new AppError("Failed to delete post", 500));
  }
};


export const getAllPost = async (req, res, next) => {
  const getPost = await Post.find();
  res.status(200).json({ message: "success", data: getPost, success: true });
};

export const uploadImage = async (req, res, next) => {
  if (!req.file) {
    return next(new AppError(message.image.required));
  }

  const fullPath = path.resolve(req.file.destination, req.file.filename);
  const uploadImage = await cloudUploadeImage(fullPath);

  const user = await User.findById(req.user.id);
  if (user.pr)
    res.status(200).json({ message: "your profile image upload success" });
};
