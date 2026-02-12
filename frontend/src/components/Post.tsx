import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, Share2, ThumbsUp, Trash2 } from "lucide-react";

import type { AuthUserType, PostType } from '../utils/types';
import { daysAgo, postRequest } from "../utils/utilFunctions";


function Post({post ,userData} : {post: PostType, userData: AuthUserType}) {

  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData< AuthUserType | null>(['authUser']);

  const mutateObj = useMutation({
    mutationFn: async () => {
      postRequest('/post/delete/' + post._id, {}, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', userData?._id ?? ''] });
    }
  });

  const likePostMutation = useMutation({
    mutationFn: async () => {
      await postRequest( '/post/' + post._id + '/like', {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', userData?._id ?? ''] });
    }
  });

  return (
    <div className="post-container shaded-border">

      <div className='flex justify-between items-center'>
        <div className='flex gap-3 items-center'>
          <div>
            <img src={post.author.profilePicture} alt="" className='profile-img'/>
          </div>
          <div className='flex flex-col'>
            <p className="font-semibold">{post.author.fullName}</p>
            <p className="text-sm">{post.author.headline}</p>
            <p className="text-xs text-gray-600">{daysAgo(post.createdAt)}</p>
          </div>
        </div>
        {
          authUser && authUser._id === post.author._id &&
          <div onClick={function(){mutateObj.mutate()}}>
            <Trash2  size={18} color={'red'} className="hand-hover"/>
          </div>
        }
      </div>

      <div>
        <p>{post.content}</p>
        {post.image? <img src={post.image} alt="" />:''}
      </div>

      <div className="flex justify-between text-sm">
        <div className="flex gap-5">
          <div className="flex gap-1 items-center">
            <ThumbsUp size={16} className="hand-hover" onClick={function(){likePostMutation.mutate()}}/>Like({post.likes.length})
          </div>
          <div className="flex gap-1 items-center">
            <MessageCircle  size={16} className="hand-hover"/>Comment({post.comments.length})
          </div>
        </div>
        <Share2 size={16} className="hand-hover"/>
      </div>

    </div>
  )
}

export default Post