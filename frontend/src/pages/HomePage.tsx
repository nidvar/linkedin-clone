import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { getRequest } from "../utils/utilFunctions";
import Sidebar from '../components/Sidebar';
import type { AuthUserType, PostType } from "../utils/types";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import RecommendedUsers from "../components/RecommendedUsers";

const HomePage = () => {

  const [posts, setPosts] = useState<PostType[]>([]);

  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData< AuthUserType | null>(['authUser']);

  const recommendedUsers = useQuery({
    queryKey: ['recommendedUsers'], 
    queryFn: async () => {
      try {
        const suggstedUsers = await getRequest('/user/suggestedusers');
        return suggstedUsers;
      } catch (error) {
        return error;
      }
    },
  });

  const postsData = useQuery({
    queryKey: ['posts'], 
    queryFn: async () => {
      try {
        const data = await getRequest('/post/feed');
        console.log(data.posts);
        setPosts(data.posts);
        return data.posts;
      } catch (error) {
        return error;
      }
    },
  });

  return (
    <div className="homepage">
      <Sidebar user={authUser? authUser : null} />
      <div className="post-section">
        <PostCreation profile={authUser? authUser.profilePicture : ''} />
        {
          posts.length > 0?
          <>
            {posts.map((item)=>{
              return (
                <Post post={item} key={item._id}/>
              )
            })}
          </>:''
        }
      </div>
      <RecommendedUsers />
    </div>
  )
}

export default HomePage