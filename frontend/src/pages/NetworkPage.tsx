import { useQueryClient } from '@tanstack/react-query';

import type { ConnectionRequestType } from '../utils/types';

function NetworkPage() {
  const queryClient = useQueryClient();
  const requests = queryClient.getQueryData<ConnectionRequestType[] | null>(['requests']);

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
                  <button className='mr-2'>Accept</button>
                  <button className='bg-slate-400'>Decline</button>
                </div>

              </div>
            )
          }):''
        }
      </div>
    </div>
  )
}

export default NetworkPage