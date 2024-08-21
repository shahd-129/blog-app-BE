import fs from "fs";
import path from "path";
import User from "../../../DB/Models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../../utils/ErrorHandling.js";
import { message } from "../../utils/constant/message.js";
import { cloudRemoveImage, cloudUploadeImage } from "../../utils/cloudinary.js";

export const signup = async (req, res, next) => {
  const { email, password, phone, name } = req.body;

  const emailExist = await User.findOne({ email });
  if (emailExist) {
    throw new AppError("email already exists", 400);
  }

  // if (!req.file) {
  //   return next(new AppError("Image is required", 400));
  //   // console.log(req.file);
  // }

  // const fullPath = path.resolve(req.file.destination, req.file.filename);
  // const uploadImage = await cloudUploade(fullPath);

  const hashPass = bcrypt.hashSync(password, 10);

  const newUser = await User.create({
    email,
    password: hashPass,
    phone,
    name,
  //   image: {
  //     url: uploadImage.secure_url,
  //     publicId: uploadImage.public_id,
  //   },
  });

  // fs.unlinkSync(fullPath);

  res.status(201).json({
    message: "User created successfully",
    data: newUser,
    success: true,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.json({ message: "Email not found, please signup" });
  const isPasswordValid = bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.json({ message: "Invalid password" });
  }

  jwt.sign(
    { userId: user._id, name: user.userName },
    "secret_token",
    (error, token) => {
      res.json({ message: "Login Successfully", token, success: true });
    }
  );
};

export const updateUser = async (req, res, next) => {
  const { name, email, password, phone } = req.body;
  const { userId } = req.params;


  const existUserId = await User.findById(userId);
  if (!existUserId) return next(new AppError("User ID not found", 404));


  if (email) {
    const existEmail = await User.findOne({ email });
    if (existEmail && existEmail._id.toString() !== userId) {
      return next(new AppError(message.user.alreadyExist, 409));
    }
  }


  if (name) existUserId.name = name;
  if (email) existUserId.email = email;
  if (password) existUserId.password = bcrypt.hashSync(password, 10);
  if (phone) existUserId.phone = phone;

 
  if (req.file) {
    const fullPath = path.resolve(req.file.destination, req.file.filename);
    const uploadImage = await cloudUploade(fullPath);

    // Remove the old image from Cloudinary if it exists
    if (existUserId.image?.publicId) {
      await cloudRemove(existUserId.image.publicId);
    }

    existUserId.image = {
      url: uploadImage.secure_url,
      publicId: uploadImage.public_id,
    };

    // Delete the local image file after uploading to Cloudinary
    fs.unlinkSync(fullPath);
  }


  const updatedUser = await existUserId.save();
  if (!updatedUser) return next(new AppError(message.user.failToUpdate, 500));

  res.status(201).json({
    message: message.user.updateSuccessfully,
    data: updatedUser,
    success: true,
  });
};

export const deleteUser = async (req, res, next) => {
  const { userId } = req.body;

  await User.deleteOne(userId);

  res
    .status(200)
    .json({ message: message.user.deleteSuccessfully, success: true });
};

export const uploadImage = async (req, res, next) => {
  if (!req.file) {
    return next(new AppError(message.image.required));
  }

  const fullPath = path.resolve(req.file.destination, req.file.filename);
  const uploadImage = await cloudUploade(fullPath);

  const userExist = await User.findById(req.params.userId);
  if (userExist.image && userExist.image.publicId) {
    await cloudRemove(userExist.image.publicId);
  }

  userExist.image = {
    url: uploadImage.secure_url,
    publicId: uploadImage.public_id,
  };

  await userExist.save();

  res.status(200).json({
    message: "your profile image upload success",
    profilePhoto: {
      url: uploadImage.secure_url,
      publicId: uploadImage.public_id,
    },
  });

  fs.unlinkSync(fullPath);
};

export const deleteImage = async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) return next(new AppError(message.user.notFound, 404));
  // get All post from db **todo
  // delete all posts image from cloudinary **todo

  await cloudRemove(user.image.publicId);

  await User.findByIdAndDelete(req.params.userId);

  res.status(200).json({ message: message.user.deleteSuccessfully });
};

export const getUserById = async (req, res, next) => {
  const { userId } = req.params;
  const existUserId = await User.findById(userId);
  if (!existUserId) return next(new AppError(message.user.notFound, 404));

  res.status(200).json({ success: true, data: existUserId });
};

export const validateToken = (req, res) => {
  res.json({ valid: true });
};
