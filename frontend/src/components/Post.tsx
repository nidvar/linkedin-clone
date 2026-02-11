import { MessageCircle, Send, Share2, ThumbsUp, Trash2 } from "lucide-react";

import type { PostType } from '../utils/types';
import { daysAgo } from "../utils/utilFunctions";

function Post({post} : {post: PostType}) {
  return (
    <div className="post-container shaded-border">

      <div className='flex justify-between items-center'>
        <div className='flex gap-2 items-center'>
          <div>
            <img src={post.author.profilePicture} alt="" className='profile-img'/>
          </div>
          <div className='flex flex-col'>
            <p className="font-semibold">{post.author.fullName}</p>
            <p className="text-sm">{post.author.headline}</p>
            <p className="text-xs text-gray-600">{daysAgo(post.createdAt)}</p>
          </div>
        </div>
        <Trash2  size={20} color={'red'} className="hand-hover"/>
      </div>

      <div>
        <p>{post.content}</p>
        {post.image? <img src={post.image} alt="" />:''}
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <ThumbsUp size={20} className="hand-hover"/>
          <MessageCircle  size={20} className="hand-hover"/>
        </div>
        <Share2  size={20} className="hand-hover"/>
      </div>

    </div>
  )
}

export default Post