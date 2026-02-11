import { Link } from 'react-router-dom';

import type { SuggestedUsersType } from '../utils/types';
import { UserPlus } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { postRequest } from '../utils/utilFunctions';

function RecommendedUsers({ recommendedUsers }: {recommendedUsers: SuggestedUsersType[]}) {

  const mutateObj = useMutation({
    mutationFn: async (arg: string) => {
      await postRequest('/connections/sendRequest/' + arg, {});
    },
    onSuccess: ()=>{
      console.log('success')
    },
    onError: (error)=>{
      console.log(error);
    }
  });

  console.log(recommendedUsers);

  return (
    <div className='recommended-container shaded-border'>
      <h1 className='font-semibold text-lg'>People you may know</h1>
      {
        recommendedUsers && recommendedUsers.length > 0?
        <>
          {
            recommendedUsers.map((user) => {
              return (
                <div className='flex justify-between items-center' key={user._id}>
                  <Link to='/' className='flex gap-2 items-center'>
                    <img src={user.profilePicture} alt="" className='profile-img'/>
                    <div className='flex flex-col '>
                      <p className="font-semibold text-sm">{user.fullName}</p>
                      <p className="text-xs text-gray-600">{user.headline}</p>
                    </div>
                  </Link>
                  <div>
                    <button className='connect-button flex gap-2 items-center' onClick={function(){mutateObj.mutate(user._id)}} ><UserPlus size={14} />Connect</button>
                  </div>
                </div>
              )
            })
          }
        </>:''
      }
    </div>
  )
}

export default RecommendedUsers