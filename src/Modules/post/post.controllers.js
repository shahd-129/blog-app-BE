import path from "path";
import fs from "fs";
import Post from "../../../DB/Models/post.js";
import User from "../../../DB/Models/user.js";
import { message } from "../../utils/constant/message.js";
import { AppError } from "../../utils/ErrorHandling.js";
import { cloudRemove, cloudUploade } from "../../utils/cloudinary.js";

export const createPost = async (req, res, next) => {
  const { content } = req.body;

  if (!req.file) {
    return next(new AppError("Image is required", 400));
  }


  if ( !req.user.userId) {
    return next(new AppError("User is not authenticated", 401));
  }

  const fullPath = path.resolve(req.file.destination, req.file.filename);
  const uploadImage = await cloudUploade(fullPath);

  try {
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
  } catch (error) {
    // Handle any errors during the post creation
    return next(new AppError("Failed to create post", 500));
  }
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
  const uploadImage = await cloudUploade(fullPath);

  if (existUserId.image?.publicId) {
    await cloudRemove(existUserId.image.publicId);
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
    // const {postId} = req.params
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError("post not found", 404)); 
  }
    if(req.user.userId === post.userId.toString()){
      await Post.findByIdAndDelete(req.params.id)
      await cloudRemove(post.image.publicId)
      // todo delete all comment
    }

  res.status(200).json({
    message: "Post deleted successfully", 
    success: true,
  });
};

export const getAllPost = async (req, res, next) => {
  //   const { userId } = req.params;
  //   existUserId = await User.findById({userId});
  //   console.log(existUserId);

  //   if (!existUserId) return next(new AppError(message.user.notFound, 404));

  const getPost = await Post.find();
  res.status(200).json({ message: "success", data: getPost, success: true });
};

export const uploadImage = async (req, res, next) => {
  if (!req.file) {
    return next(new AppError(message.image.required));
  }

  const fullPath = path.resolve(req.file.destination, req.file.filename);
  const uploadImage = await cloudUploade(fullPath);

  const user = await User.findById(req.user.id);
  if (user.pr)
    res.status(200).json({ message: "your profile image upload success" });
};
