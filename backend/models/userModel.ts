import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    refreshToken: {
      type: String,
      default: "",
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
    },
    username: { 
      type: String, 
      unique: true,
      default: function() {
        return `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      }
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    profilePicture: {
      type: String,
      default: "",
    },
    bannerImg: {
      type: String,
      default: null,
    },
    headline: {
      type: String,
      default: "Linkedin User",
    },
    location: {
      type: String,
      default: "Earth",
    },
    about: {
      type: String,
      default: "",
    },
    skills: [String],
    experience: [
      {
        title: String,
        company: String,
        startYear: Number,
        endYear: Number,
        description: String,
      },
    ],
    education: [
      {
        school: String,
        field: String,
        startYear: Number,
        endYear: Number,
      },
    ],
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;