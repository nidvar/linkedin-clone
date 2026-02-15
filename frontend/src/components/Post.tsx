import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, Share2, ThumbsUp, Trash2 } from "lucide-react";
import { useState, type SubmitEvent } from 'react';

import type { AuthUserType, PostType } from '../utils/types';
import { daysAgo, postRequest } from "../utils/utilFunctions";


function Post({post ,userData} : {post: PostType, userData: AuthUserType}) {

  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');

  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData< AuthUserType | null>(['authUser']);

  const deletePostMutation = useMutation({
    mutationFn: async () => {
      await postRequest('/post/delete/' + post._id, {}, 'DELETE');
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

  const addComment = function(){
    if(showComments){
      setShowComments(false);
    }else{
      setShowComments(true);
    }
  }

  const sendCommentMutation = useMutation({
    mutationFn: async () => {
      await postRequest( '/post/' + post._id + '/createcomment', {content: comment});
      setComment('');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', userData?._id ?? ''] });
    }
  })

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if(comment.trim() === '') return;
    sendCommentMutation.mutate();
  };

  const deleteComment = async function(commentId: string, postId: string){
    const result = await postRequest('/post/deletecomment/' + post._id, { commentId, postId }, 'DELETE');
    if(result.message === 'Comment deleted'){
      queryClient.invalidateQueries({ queryKey: ['posts', userData?._id ?? ''] });
    };
  }

  return (
    <div className="post-container shaded-border">
      <div className='flex justify-between items-center'>
        <div className='flex gap-3 items-center'>
          <div>
            <img src={post.author.profilePicture} alt="" className='profile-img'/>
          </div>
          <div className='flex flex-col'>
            <p className="font-semibold">{post.author.fullName}</p>
            <p className="text-xs">{post.author.headline}</p>
            <p className="text-xs text-gray-600">{daysAgo(post.createdAt)}</p>
          </div>
        </div>
        {
          authUser && authUser._id === post.author._id &&
          <div onClick={function(){deletePostMutation.mutate()}}>
            <Trash2  size={18} color={'red'} className="hand-hover"/>
          </div>
        }
      </div>

      <div>
        <p>{post.content}</p>
        {post.image? <img src={post.image} alt="" />:''}
      </div>

      <div className="flex justify-between text-sm">
        <div className="hand-hover flex gap-1 items-center" onClick={function(){!likePostMutation.isPending?likePostMutation.mutate(): null}} >
          <ThumbsUp size={16} /> Like ({post.likes.length})
        </div>
        <div className="flex gap-1 items-center hand-hover" onClick={function(){addComment()}}>
          <MessageCircle size={16} />Comment ({post.comments.length})
        </div>
        <div className="flex gap-1 items-center hand-hover">
          <Share2 size={16} />Share
        </div>
      </div>
      {
        showComments?
        <>
          <form className="comment-form flex flex-col gap-3" onSubmit={handleSubmit}>
            <input value={comment} onChange={function(e){setComment(e.target.value)}} placeholder="Leave a comment"/>
            <button className="justify-end" type='submit'>Comment</button>
          </form>
          {
            post.comments.map((comment) => {
              return (
                <div className="comment-container flex items-center justify-between" key={comment._id}>
                  <div className="flex gap-2">
                    <div className="self-start">
                      <img src={comment.user.profilePicture} alt="" className='profile-img-medium'/>
                    </div>
                    <div className='single-comment-box'>
                      <div className="flex justify-between text-xs">
                        <p>
                          <span className="font-semibold">{comment.user.fullName}</span> - <span className="text-gray-500">{daysAgo(comment.createdAt)}</span>
                        </p>
                      </div>
                      <p className="text my-1">{comment.content}</p>
                    </div>
                  </div>
                  <div className="self-start hand-hover" onClick={function(){}}>
                    {
                      authUser && authUser._id === comment.user._id &&
                      <div onClick={function(){deleteComment(comment._id, post._id)}}>
                        <Trash2 size={15} color='red'/>
                      </div>
                    }
                  </div>
                </div>
              )
            })
          }
        </>:null
      }
    </div>
  )
}

export default Post