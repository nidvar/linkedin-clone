import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRequest } from "../utils/utilFunctions";
import Sidebar from '../components/Sidebar';
import type { AuthUser } from "../utils/types";
import PostCreation from "../components/PostCreation";

const HomePage = () => {

  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData< AuthUser | null>(['authUser']);

  const recommendedUsers = useQuery({
    queryKey: ['recommendedUsers'], 
    queryFn: async () => {
      try {
        const suggstedUsers = await getRequest('/user/suggestedusers');
        console.log(suggstedUsers);
        return suggstedUsers;
      } catch (error) {
        return error;
      }
    },
  });

  const posts = useQuery({
    queryKey: ['posts'], 
    queryFn: async () => {
      try {
        const posts = await getRequest('/post/feed');
        console.log(posts);
        return posts;
      } catch (error) {
        return error;
      }
    },
  });

  return (
    <>
      <div className="homepage flex gap-8">
        <Sidebar user={authUser? authUser.user : null}/>
        <PostCreation profile={authUser? authUser.user.profilePicture : ''}/>
      </div>
    </>
  )
}

export default HomePage