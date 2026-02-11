import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getRequest } from "../utils/utilFunctions";
import Sidebar from '../components/Sidebar';
import type { AuthUserType, PostType } from "../utils/types";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import RecommendedUsers from "../components/RecommendedUsers";

const HomePage = () => {

  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData< AuthUserType | null>(['authUser']);

  const recommendedUsers = useQuery({
    queryKey: ['recommendedUsers'], 
    queryFn: async () => {
      try {
        const data = await getRequest('/user/suggestedusers');
        const randomizedUsers = data.usersNotConnected.sort(() => Math.random() - 0.5).slice(0, 3);
        return randomizedUsers
      } catch (error) {
        return error;
      }
    },
    refetchOnWindowFocus: false
  });

  const postsData = useQuery({
    queryKey: ['posts'], 
    queryFn: async () => {
      try {
        const data = await getRequest('/post/feed');
        return data.posts;
      } catch (error) {
        return error;
      }
    },
    refetchOnWindowFocus: false
  });

  return (
    <div className="homepage">
      <Sidebar user={authUser? authUser : null} />
      <div className="post-section">
        <PostCreation profile={authUser? authUser.profilePicture : ''} />
        {
          postsData.data && postsData.data.length > 0?
            <>
              {postsData.data.map((item: PostType)=>{
                return (
                  <Post post={item} key={item._id}/>
                )
              })}
            </>:''
        }
      </div>
      <RecommendedUsers recommendedUsers={recommendedUsers.data}/>
    </div>
  )
}

export default HomePage