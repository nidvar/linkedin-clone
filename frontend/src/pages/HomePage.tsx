import { useQuery } from "@tanstack/react-query";

import { getRequest } from "../utils/utilFunctions";
import type { PostType } from "../utils/types";

import Sidebar from '../components/Sidebar';
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import RecommendedUsers from "../components/RecommendedUsers";

const HomePage = () => {
  const userData = useQuery({ 
    queryKey: ['authUser'], 
    queryFn: async () => {
      const authUser = await getRequest('/auth/me');
      const user = authUser.user;
      return user;
    }
  });

  const sentRequests = useQuery({
    queryKey: ['sentRequests', userData.data?._id],
    enabled: !!userData,
    queryFn: async () => {
      const data = await getRequest('/connections/sentrequests');
      return data.sentRequests;
    },
  });

  const recommendedUsers = useQuery({
    queryKey: ['recommendedUsers', userData.data?._id],
    enabled: !!userData.data,
    queryFn: async () => {
      const data = await getRequest('/user/suggestedusers');
      const randomizedUsers = data.usersNotConnected.sort(() => Math.random() - 0.5).slice(0, 3);
      return randomizedUsers
    },
  });

  const postsData = useQuery({
    queryKey: ['posts', userData.data?._id ?? ''], 
    enabled: !!userData.data,
    queryFn: async () => {
      const data = await getRequest('/post/feed');
      return data.posts;
    },
  });

  return (
    <div className="main">
      <Sidebar user={userData.data? userData.data : null} />
      <div className="post-section">
        <PostCreation profile={userData.data? userData.data.profilePicture : ''} />
        {
          postsData.data && postsData.data.length > 0?
            <>
              {postsData.data.map((item: PostType)=>{
                return (
                  <Post post={item} key={item._id} userData={userData.data}/>
                )
              })}
            </>:''
        }
      </div>
      {
        recommendedUsers.isPending?
        <>{null}</>:
        <RecommendedUsers recommendedUsers={recommendedUsers.data || []} userData={userData.data} sentRequests={sentRequests.data || []}  />
      }
    </div>
  )
}

export default HomePage