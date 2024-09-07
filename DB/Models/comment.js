import { mongoose, Schema } from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
  text:{
    type: String,
    require: true
  },
  userName: {
    type: String,
    require: true,
    ref: "User"
  },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
