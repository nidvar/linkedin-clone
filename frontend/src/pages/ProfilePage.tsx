import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { getRequest } from '../utils/utilFunctions';

function ProfilePage() {

  const { username } = useParams();

  const profileData = useQuery({ 
    queryKey: ['profile', username], 
    queryFn: async () => {
      const profileData = await getRequest('/user/profile/' + username);
      const user = profileData.user;
      return user;
    }
  });

  console.log(profileData.data);

  return (
    <div className="main">
      <h1>Profile Page</h1>
    </div>
  )
}

export default ProfilePage