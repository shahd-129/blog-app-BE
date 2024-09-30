import { mongoose, Schema } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      require: true,
    },
    image: {
      type: Object,
      default: {
        secure_url: null,
        public_id: "",
      },
      required: false
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
      require: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    commentCount: {
      type: Number,
      default: 0,
    },
    userName: {
      type:String,
      ref: "User",
      require: true
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "postId",
  localField: "_id",
});
const Post = mongoose.model("Post", postSchema);

export default Post;
