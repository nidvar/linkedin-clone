import { useQuery, useQueryClient } from '@tanstack/react-query';

import type { ConnectionRequestType, ConnectionType } from '../utils/types';
import { getRequest, postRequest } from '../utils/utilFunctions';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

function NetworkPage() {
  const queryClient = useQueryClient();
  const requests = queryClient.getQueryData<ConnectionRequestType[] | null>(['requests']);

  const allConnections = useQuery({
    queryKey: ['recommendedUsers'], 
    queryFn: async () => {
      try {
        const data = await getRequest('/connections/getallconnections');
        console.log(data)
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

  return (
    <div className='main'>
      <div className='connection-container shaded-border'>
        <h1 className='font-bold text-2xl my-3'>My Network</h1>
        <p className='font-semibold text-l mb-3'>Connection Requests</p>
        {
          requests && requests.length > 0?
          requests.map((item)=>{
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
                <Link to={'/profile/' + item._id} key={item._id} className='connection-card shaded-border hand-hover'>
                  <div>
                    <img src={item.profilePicture} className='profile-img-large'/>
                  </div>
                  <div>
                    <h1 className='font-bold'>{item.fullName}</h1>
                    <p className='text-sm text-gray-600'>{item.headline}</p>
                  </div>
                </Link>
              )
            }):''
          }
        </div>
      </div>
    </div>
  )
}

export default NetworkPage