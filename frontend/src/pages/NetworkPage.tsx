import { useQuery, useQueryClient } from '@tanstack/react-query';

import type { AuthUserType, ConnectionRequestType, ConnectionType } from '../utils/types';
import { getRequest, postRequest } from '../utils/utilFunctions';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

function NetworkPage() {

  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData<AuthUserType | null>(['authUser']);

  const requests = useQuery({ 
    queryKey: ['requests'], 
    queryFn: async () => {
      try {
        const data = await getRequest('/connections/requests');
        return data.connectionRequests;
      } catch (error) {
        return error;
      }
    },
    enabled: authUser !== null,
  });

  const allConnections = useQuery({
    queryKey: ['connections'], 
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

  const acceptConnection = async (id: string) => {
    const result = await postRequest('/connections/accept/' + id, {});
    console.log(result);
  };

  const deleteConnection = async (id: string) => {
    const result = await postRequest('/connections/removeConnection/' + id, {}, 'DELETE');
    console.log(result);
  };

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
                  <button className='mr-2' onClick={function(){acceptConnection(item.sender._id)}}>Accept</button>
                  <button className='bg-slate-400'>Decline</button>
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
                  <button onClick={function(){deleteConnection(item._id)}}>DELETE</button>
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