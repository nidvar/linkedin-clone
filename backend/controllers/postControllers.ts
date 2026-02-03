import type { Request, Response } from 'express';
import Post from '../models/postModel.js';
import Notification from '../models/notificationModel.js';
import cloudinary from '../lib/cloudinary.js';
import User from '../models/userModel.js';

export const getFeedPosts = async (req: Request, res: Response)=>{
  try {
    const posts = await Post.find({
      author: { $in: res.locals.user.connections }
    })
    .populate('author', 'name username profilePicture headline')
    .populate('comments.user', 'name profilePicture')
    .sort({ createdAt: -1 }).limit(10);

    return res.status(200).json({ posts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error getting feed posts' });
  }
};

export const createPost = async (req: Request, res: Response)=>{
  try {
    let newPost;
    let cloudinaryImg;
    if(req.body.image){
      cloudinaryImg = await cloudinary.uploader.upload(req.body.image, { folder: 'linkedin-posts' });
    };
    newPost = await Post.create({
      content: req.body.content,
      author: res.locals.id,
      image: cloudinaryImg ? cloudinaryImg.secure_url : ''
    });
    await newPost.save();
    return res.status(200).json({ message: 'Post created' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error creating post' });
  }
};

export const deletePost = async (req: Request, res: Response)=>{
  try {
    const post = await Post.findById(req.params.id);
    if(!post){
      return res.status(400).json({ message: 'Post does not exist' });
    };
    const user = await User.findById(res.locals.id);
    if(!user){
      return res.status(400).json({ message: 'User does not exist' });
    };
    if(post.author.toString() !== user._id.toString()){
      return res.status(400).json({ message: 'You are not the author of this post' });
    };
    if(post.image){
      // todo later
    }
    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error deleting post' });
  }
};

export const getPostById = async (req: Request, res: Response)=>{
  try {
    const post = await Post.findById(req.params.id)
    .populate('author', 'name username profilePicture headline')
    .populate('comments.user', 'name profilePicture');
    if(!post){
      return res.status(400).json({ message: 'Post does not exist' });
    };
    return res.status(200).json({ post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error getting post by id' });
  }
};

export const createComment = async (req: Request, res: Response)=>{
  try {
    const post = await Post.findByIdAndUpdate(
        req.params.id,
        {$push: { comments: {content: req.body.content, user: res.locals.id}}},
        { new: true}
    )
    .populate(
      'author',
      'name email username headline profilePicture'
    );
    if(post && post.author.toString() !== res.locals.id.toString()){
      await Notification.create({
        recipient: post.author,
        type: 'comment',
        relatedUser: res.locals.id,
        relatedPost: req.params.id as string,
      });
    }
    return res.status(200).json({ message: 'Comment created' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error creating comment' });
  }
};