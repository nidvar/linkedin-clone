import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../utils/utilFunctions";
import Sidebar from '../components/layout/Sidebar';

const HomePage = () => {
  const query = useQuery({ 
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
  console.log(query.data);
  return (
    <>
      <div className="homepage">
        <Sidebar />
      </div>
    </>
  )
}

export default HomePage