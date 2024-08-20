import { mongoose, Schema, Types } from "mongoose";

const userSchema = new mongoose.Schema({
  title: { type: String , require: true },
  content: {
    type: String,
    require: true,
  },
 image: {
    type: Object,
    uniqe: true,
  },
 
 userId: {
    type: Schema.Types.ObjectId,
    ref:"User"
  },
 
 
});

const User = mongoose.model("user", userSchema);

export default User;

