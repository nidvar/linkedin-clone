import { Link } from 'react-router-dom';

import type { AuthUserType, sentRequestType, SuggestedUsersType } from '../utils/types';
import { TimerIcon, UserPlus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postRequest } from '../utils/utilFunctions';

function RecommendedUsers({ recommendedUsers, userData, sentRequests }: {recommendedUsers: SuggestedUsersType[], userData: AuthUserType, sentRequests: sentRequestType[]}) {

  const queryClient = useQueryClient();
  
  const mutateObj = useMutation({
    mutationFn: async (arg: string) => {
      await postRequest('/connections/sendRequest/' + arg, {});
    },
    onSuccess: ()=>{
      console.log('success');
      queryClient.invalidateQueries({ queryKey: ['recommendedUsers', userData._id] });
      queryClient.invalidateQueries({ queryKey: ['sentRequests', userData._id] });
      queryClient.refetchQueries({ queryKey: ['sentRequests', userData._id] });
    },
    onError: (error)=>{
      console.log(error);
    }
  });

  return (
    <div className='recommended-container shaded-border'>
      <h3 className='section-title'>People you may know</h3>
      {
        recommendedUsers && recommendedUsers.length > 0?
        <>
          {
            recommendedUsers.map((user) => {
              return (
                <div className='flex justify-between items-center' key={user._id}>
                  <Link to={'/profile/' + user.username} className='flex gap-2 items-center'>
                    <img src={user.profilePicture} alt="" className='profile-img circle img-fit'/>
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
      {
        sentRequests && sentRequests.length > 0?
        <>
          {
            sentRequests.map((user, index) => {
              if(index > 3) return;
              return (
                <div className='flex justify-between items-center' key={user._id}>
                  <Link to={'/profile/' + user.recipient.username} className='flex gap-2 items-center'>
                    <img src={user.recipient.profilePicture} alt="" className='profile-img circle img-fit'/>
                    <div className='flex flex-col '>
                      <p className="font-semibold text-sm">{user.recipient.fullName}</p>
                      <p className="text-xs text-gray-600">{user.recipient.headline}</p>
                    </div>
                  </Link>
                  <div className='pending-button flex gap-2 items-center'><TimerIcon size={14} />Pending</div>
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