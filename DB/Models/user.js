import { mongoose } from "mongoose";

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
});

const User = mongoose.model("User", userSchema);

export default User;

