import { useState, type SubmitEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import { TimerIcon, UserPlus } from 'lucide-react';

import type { sentRequestType, SuggestedUsersType } from '../utils/types';
import { fetchUser, getRequest, postRequest } from '../utils/utilFunctions';


function SearchPage() {

  const queryClient = useQueryClient();
  const [searchquery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SuggestedUsersType[]>([]);

  const userData = useQuery({ 
    queryKey: ['authUser'], 
    queryFn: fetchUser
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
    queryKey: ['recommendedUsers', 'search', userData.data?._id],
    enabled: !!userData.data,
    queryFn: async () => {
      const data = await getRequest('/user/suggestedusers');
      return data.usersNotConnected
    },
  });

  const handleSubmit = async (e: SubmitEvent)=>{
    e.preventDefault();
    setSearchQuery('');
    const data = await getRequest('/user/finduser/' + searchquery);
    setSearchResults(data.users);
    return data;
  }

  const mutateObj = useMutation({
    mutationFn: async (arg: string) => {
      await postRequest('/connections/sendRequest/' + arg, {});
    },
    onSuccess: ()=>{
      console.log('success');
      queryClient.invalidateQueries({ queryKey: ['recommendedUsers', 'search', userData.data?._id] });
      queryClient.invalidateQueries({ queryKey: ['sentRequests', userData.data?._id] });
      queryClient.refetchQueries({ queryKey: ['sentRequests', userData.data?._id] });
    },
    onError: (error)=>{
      console.log(error);
    }
  });

  if (recommendedUsers.isLoading) return <p>Loading recommendations...</p>;
  if (recommendedUsers.isError) return <p>Error loading recommendations</p>;

  return (
    <div className='main flex flex-col gap-5 search-page'>
      <div className='shaded-border p-5'>
        <h1 className='page-title'>Search Page</h1>
        <div className='flex flex-col gap-3'>
          <h3>Search users</h3>
          <form onSubmit={handleSubmit} className='flex gap-2'>
            <input value={searchquery} onChange={function(e){setSearchQuery(e.target.value)}}/>
            <button type='submit'>SEARCH</button>
          </form>
          <div className='mb-2'>
            {
              searchResults.map((item: SuggestedUsersType) => {
                return (
                  <div key={item._id} className='flex justify-between items-center'>
                    <div className='flex gap-3 my-2'>
                      <Link to={'/profile/' + item.username}>
                        <img src={item.profilePicture} className='profile-img circle img-fit' />
                      </Link>
                      <Link to={'/profile/' + item.username}>
                        <h1 className='font-bold'>{item.fullName}</h1>
                        <p className='text-sm text-gray-600'>{item.headline}</p>
                      </Link>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
        <h3 className='section-title'>People you may know</h3>
        {
          recommendedUsers.data && recommendedUsers.data.length > 0?
          <>
            {
              recommendedUsers.data.map((user: SuggestedUsersType) => {
                return (
                  <div className='flex justify-between items-center my-4' key={user._id}>
                    <Link to={'/profile/' + user.username} className='flex gap-2 items-center'>
                      <img src={user.profilePicture || 'avatar.png'} alt={user.fullName} className='profile-img circle img-fit'/>
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
          sentRequests.data && sentRequests.data.length > 0?
          <>
            {
              sentRequests.data.map((user: sentRequestType, index: number) => {
                if(index > 3) return;
                return (
                  <div className='flex justify-between items-center my-4' key={user._id}>
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
    </div>
  )
}

export default SearchPage