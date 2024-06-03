import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      uniqe: true,
    },
    image: {
      type: String,
      default:
        "https://th.bing.com/th/id/R.fc912ed424c06603dac36a5559f052ea?rik=5QOZzuFnBjjLSw&pid=ImgRaw&r=0",
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);
const Post = mongoose.model("Post", postSchema);
export default Post;
