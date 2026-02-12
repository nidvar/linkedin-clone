import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { AuthUserType, ConnectionRequestType, ConnectionType } from '../utils/types';
import { getRequest, postRequest } from '../utils/utilFunctions';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

function NetworkPage({userData}: {userData: AuthUserType}) {

  const queryClient = useQueryClient();

  const requests = useQuery({ 
    queryKey: ['requests', userData._id],
    queryFn: async () => {
      try {
        const data = await getRequest('/connections/requests');
        return data.connectionRequests;
      } catch (error) {
        return error;
      }
    },
    enabled: userData !== null,
  });

  const allConnections = useQuery({
    queryKey: ['connections', userData._id], 
    enabled: !!userData,
    queryFn: async () => {
      try {
        const data = await getRequest('/connections/getallconnections');
        return data.connections
      } catch (error) {
        return error;
      }
    },
  });

  console.log(allConnections.data);

  const acceptMutation = useMutation({
    mutationFn: async (arg: string) => {
      const result =  await postRequest('/connections/accept/' + arg, {});
      if(result.message === 'Connection request accepted'){
        queryClient.invalidateQueries({ queryKey: ['requests', userData._id] });
        queryClient.invalidateQueries({ queryKey: ['connections', userData._id] });
      }
      return result;
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async (arg: string) => {
      const result =  await postRequest('/connections/reject/' + arg, {});
      if(result.message === 'Connection request rejected'){
        queryClient.invalidateQueries({ queryKey: ['requests', userData._id] });
        queryClient.invalidateQueries({ queryKey: ['connections', userData._id] });
      }
      return result;
    }
  });

  const deleteConnectionMutation = useMutation({
    mutationFn: async (arg: string) => {
      const result =  await postRequest('/connections/removeconnection/' + arg, {}, 'DELETE');
      if(result.message === 'Connection removed'){
        queryClient.invalidateQueries({ queryKey: ['requests', userData._id] });
        queryClient.invalidateQueries({ queryKey: ['connections', userData._id] });
      }
      return result;
    }
  });

  return (
    <div className='main'>
      <div className='main-container shaded-border'>
        <h1 className='font-bold text-2xl my-3'>My Network</h1>
        <p className='font-semibold text-l mb-3'>Connection Requests</p>
        {
          requests.data && requests.data.length > 0?
          requests.data.map((item: ConnectionRequestType)=>{
            return (
              <div key={item._id} className='flex justify-between p-3 items-center request-box'>

                <div className='flex gap-3'>
                  <div>
                    <img src={item.sender.profilePicture} className='profile-img'/>
                  </div>

                  <div>
                    <h1 className='font-bold'>{item.sender.fullName}</h1>
                    <p className='text-sm text-gray-600'>{item.sender.headline}</p>
                  </div>
                </div>

                <div>
                  <button className='mr-2' onClick={function(){acceptMutation.mutate(item.sender._id)}}>Accept</button>
                  <button className='bg-slate-400' onClick={function(){rejectMutation.mutate(item.sender._id)}}>Decline</button>
                </div>

              </div>
            )
          }): 
          <div className='flex flex-col gap-1 items-center my-10'>
            <UserPlus size={54} color={'gray'} />
            <p className='text-xl my-3'>No connection requests</p>
          </div>
        }
        <p className='font-semibold text-l my-3'>My Connections</p>
        <div className='flex gap-3'>
          {
            allConnections.data && allConnections.data.length > 0?
            allConnections.data.map((item: ConnectionType)=>{
              return (
                <div className='shaded-border connection-card' key={item._id}>
                  <Link to={'/profile/' + item._id} className='hand-hover flex flex-col gap-2'>
                    <div>
                      <img src={item.profilePicture} className='profile-img-large'/>
                    </div>
                    <div>
                      <h1 className='font-bold'>{item.fullName}</h1>
                      <p className='text-sm text-gray-600'>{item.headline}</p>
                    </div>
                  </Link>
                  <button onClick={function(){deleteConnectionMutation.mutate(item._id)}}>DELETE</button>
                </div>
              )
            }):''
          }
        </div>
      </div>
    </div>
  )
}

export default NetworkPage