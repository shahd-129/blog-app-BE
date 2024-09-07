import { mongoose } from "mongoose";
import Post from "./post.js";
import Comment from "./comment.js";

const userSchema = new mongoose.Schema({
  name: { type: String , require: true },
  email: {
    type: String,
    uniqe: true,
    require: true,
  },
  password: {
    type: String,
    uniqe: true,
  },
  phone: {
    type: String,
    require: true,
    uniqe: true,
  },
  image:{
    type: Object,
    require:true
  },
  isAdmin:{
    type: Boolean,
    default: false
  }
},{
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

userSchema.virtual("posts" , {
  ref: "Post",
  foreignField:"userId",
  localField: "_id"
})



userSchema.pre('findOneAndDelete', async function(next) {
  try {
    // الحصول على المستخدم المُراد حذفه
    const user = this.getQuery();
    
    // حذف جميع المشاركات المرتبطة بالمستخدم
    await Post.deleteMany({ userId: user._id });
    
    // حذف جميع التعليقات المرتبطة بالمستخدم
    await Comment.deleteMany({ userId: user._id });

    next();
  } catch (error) {
    next(error);
  }
});


const User = mongoose.model("User", userSchema);

export default User;

