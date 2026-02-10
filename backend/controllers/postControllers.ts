// Third party packages
import type { Request, Response } from 'express';

// Local imports
import cloudinary from '../lib/cloudinary.js';

// models
import Post from '../models/postModel.js';
import Notification from '../models/notificationModel.js';
import User from '../models/userModel.js';

export const getFeedPosts = async (req: Request, res: Response)=>{
  try {
    const user = await User.findById(res.locals.id);
    if(!user){
      return res.status(400).json({ message: 'User does not exist' });
    };
    const posts = await Post.find({
      author: { $in: [...user.connections, res.locals.id] }
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
      content: req.body.post,
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

export const likePost = async (req: Request, res: Response)=>{
  try {
    const postId = req.params.id as string;
    const post = await Post.findById(postId);
    if(!post){
      return res.status(400).json({ message: 'Post does not exist' });
    };
    if(post.likes.includes(res.locals.id)){
      post.likes = post.likes.filter((item)=>{
        if(item.toString() != res.locals.id.toString()){
          return true
        }
      });
    }else{
      post.likes.push(res.locals.id);
      if(post && post.author.toString() !== res.locals.id.toString()){
        await Notification.create({
          recipient: post.author,
          type: 'like',
          relatedUser: res.locals.id,
          relatedPost: postId as string,
        })
      };
    };

    await post.save();

    return res.status(200).json({ message: 'update like' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error liking post' });
  }
};