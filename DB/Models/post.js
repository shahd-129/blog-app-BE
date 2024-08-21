import { mongoose, Schema } from "mongoose";

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    require: true,
  },
 image: {
    type: Object,
    uniqe: true,
    default:{
      secure_url: null,
      public_id:""
    }
  },
 
 userId: {
    type: Schema.Types.ObjectId,
    ref:"User"
  },
  date:{
    type: Date,
    require: true
  }
});

const Post = mongoose.model("Post", postSchema);

export default Post;

