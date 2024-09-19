import path from "path";
import fs from "fs";
import Post from "../../../DB/Models/post.js";
import User from "../../../DB/Models/user.js";
import { message } from "../../utils/constant/message.js";
import { AppError } from "../../utils/ErrorHandling.js";
import { cloudRemoveImage, cloudUploadeImage } from "../../utils/cloudinary.js";

export const createPost = async (req, res, next) => {
  const { content} = req.body;

  if (!req.file) {
    return next(new AppError("Image is required", 400));
  }

  const userId = req.user.userId;
  const user = await User.findById(req.user.userId);
  if (!user) return next(new AppError(message.user.notFound, 404));


  const fullPath = path.resolve(req.file.destination, req.file.filename);
  const uploadImage = await cloudUploadeImage(fullPath);

  const addPost = await Post.create({
    content,
    userName: user.name,
    userId,
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
  const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new AppError("Post not found", 404));
    }

  const user = await User.findById(req.user.userId);
  if (!user) return next(new AppError( "user not found", 404));


    if ( req.user.userId === post.userId.toString()) {
      await Post.findByIdAndUpdate(req.params.id , post);
      await cloudUploadeImage(post.image.publicId);
    }

  if (!req.file) {
    return next(new AppError("Image is required", 400));
  }

  const fullPath = path.resolve(req.file.destination, req.file.filename);
  const uploadImage = await cloudUploadeImage(fullPath);

  if (post.image?.publicId) {
    await cloudRemoveImage(post.image.publicId);
  }
  fs.unlinkSync(fullPath);

  post.image = {
    url: uploadImage.secure_url,
    publicId: uploadImage.public_id,
  };

  if (content) post.content = content;

  const updatedPost = await post.save();
  if (!updatedPost) {
    next(new AppError(message.post.failToUpdate, 500));
  }

  res.status(201).json({
    message: "post updated successfully",
    data: updatedPost,
    success: true,
  });
};


export const deletePost = async (req, res, next) => {
try{
  const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError("Post not found", 404));
    }
    if (req.user.userId === post.userId.toString()) {
      await cloudRemoveImage(post.image.publicId);
      await Post.findByIdAndDelete(req.params.id)


      const comments = await Comment.deleteMany({ postId: post._id });
      if (comments.deletedCount > 0) {
        return res.json({ message: "Post and associated comments deleted successfully", success: true });
      }
      return res.status(200).json({
        message: "Post deleted successfully",
        success: true,
      });

    } else {
      return next(new AppError("User not authorized to delete this post", 403));
    }
  } catch (error) {
    return next(new AppError("An error occurred while deleting the post", 500));
  }
};



export const getAllPost = async (req, res, next) => {
  const getPost = await Post.find().populate("comments");
  res.status(200).json({ message: "success", data: getPost, success: true });
};


export const addReact = async (req , res , next ) =>{
  let post = await Post.findById(req.params.id)
  if(!post) return next(new AppError("post not found"))

    const postedReact = post.likes.find((user) => user.toString() === req.user.userId)
   
    
    if(postedReact) {
      post = await Post.findByIdAndUpdate(req.params.id , {$pull: {likes: req.user.userId} , new: true})
    }else{
      post = await Post.findByIdAndUpdate(req.params.id , {$push: {likes: req.user.userId} , new: true})
    }

    res.status(200).json({message:"React Added Success" , success: true , data: post})
}

// export const uploadImage = async (req, res, next) => {
//   if (!req.file) {
//     return next(new AppError(message.image.required));
//   }

//   const fullPath = path.resolve(req.file.destination, req.file.filename);
//   const uploadImage = await cloudUploadeImage(fullPath);

//   const user = await User.findById(req.user.id);
//   if (user.pr)
//     res.status(200).json({ message: "your profile image upload success" });
// };
