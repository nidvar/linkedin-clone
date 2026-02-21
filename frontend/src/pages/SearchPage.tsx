import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

import type { AuthUserType } from '../utils/types';
import { getRequest } from '../utils/utilFunctions';

function SearchPage({ userData }: { userData: AuthUserType }) {

  const queryClient = useQueryClient();

  const recommendedUsers = useQuery({
    queryKey: ['recommendedUsers', userData?._id],
    enabled: !!userData,
    queryFn: async () => {
      const data = await getRequest('/user/suggestedusers');
      console.log(data);
      return data
    },
  });

  console.log(recommendedUsers.data);

  return (
    <div className='main'>
      <div className='main-container shaded-border'>
        <h1 className='page-title'>Search</h1>
      </div>
    </div>
  )
}

export default SearchPage