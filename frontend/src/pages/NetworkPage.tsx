import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ChevronDown, ChevronRight, CircleCheck, CircleX, UserPlus } from 'lucide-react';

import type { AuthUserType, ConnectionRequestType, userDetailsType, sentRequestType } from '../utils/types';
import { getRequest, postRequest } from '../utils/utilFunctions';


function NetworkPage({ userData }: { userData: AuthUserType }) {

  const queryClient = useQueryClient();

  const [showSentRequests, setShowSentRequests] = useState(true);
  const [showConnections, setShowConnections] = useState(true);
  const [showRequests, setShowRequests] = useState(true);

  const requests = useQuery({
    queryKey: ['requests', userData._id],
    queryFn: async () => {
      const data = await getRequest('/connections/requests');
      return data.connectionRequests;
    },
    enabled: userData !== null,
  });

  const allConnections = useQuery({
    queryKey: ['connections', userData._id],
    enabled: !!userData,
    queryFn: async () => {
      const data = await getRequest('/connections/getallconnections');
      return data.connections
    },
  });

  const sentRequests = useQuery({
    queryKey: ['sentRequests', userData._id],
    enabled: !!userData,
    queryFn: async () => {
      const data = await getRequest('/connections/sentrequests');
      return data.sentRequests;
    },
  });

  const acceptMutation = useMutation({
    mutationFn: async (arg: string) => {
      await postRequest('/connections/accept/' + arg, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests', userData._id] });
      queryClient.invalidateQueries({ queryKey: ['connections', userData._id] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async (arg: string) => {
      await postRequest('/connections/reject/' + arg, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests', userData._id] });
      queryClient.invalidateQueries({ queryKey: ['connections', userData._id] });
    }
  });

  const deleteConnectionMutation = useMutation({
    mutationFn: async (arg: string) => {
      await postRequest('/connections/removeconnection/' + arg, {}, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests', userData._id] });
      queryClient.invalidateQueries({ queryKey: ['connections', userData._id] });
    }
  });

  const cancelRequestMutation = useMutation({
    mutationFn: async (arg: string) => {
      await postRequest('/connections/cancel/' + arg, {}, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sentrequests', userData._id] });
    }
  });

  const returnChevron = function(section: string){
    if(section === 'sentRequests'){
      return showSentRequests?
       <ChevronDown size={20} className='hand-hover' onClick={() => { setShowSentRequests(false) }} />: 
       <ChevronRight size={20} className='hand-hover' onClick={() => { setShowSentRequests(true) }} />
    };
    if(section === 'connections'){
      return showConnections?
       <ChevronDown size={20} className='hand-hover' onClick={() => { setShowConnections(false) }} />: 
       <ChevronRight size={20} className='hand-hover' onClick={() => { setShowConnections(true) }} />
    };
    if(section === 'requests'){
      return showRequests?
       <ChevronDown size={20} className='hand-hover' onClick={() => { setShowRequests(false) }} />: 
       <ChevronRight size={20} className='hand-hover' onClick={() => { setShowRequests(true) }} />
    };
  }

  return (
    <div className='main'>
      <div className='main-container shaded-border flex flex-col'>
        <h1 className='page-title'>My Network</h1>
        <h3 className='section-title flex gap-3 items-center'>Connection Requests {returnChevron('requests')}</h3>
        {
          showRequests?
          <>
            {
              requests.data && requests.data.length > 0 ?
                requests.data.map((item: ConnectionRequestType) => {
                  return (
                    <div key={item._id} className='flex justify-between items-center request-box'>
                      <div className='flex gap-3 my-4'>
                        <Link to={'/profile/' + item.sender.username}>
                          <img src={item.sender.profilePicture} className='profile-img circle img-fit' />
                        </Link>
                        <Link to={'/profile/' + item.sender.username}>
                          <h1 className='font-bold'>{item.sender.fullName}</h1>
                          <p className='text-sm text-gray-600'>{item.sender.headline}</p>
                        </Link>
                      </div>

                      <div className='flex'>
                        <CircleCheck color={'green'} className='mr-2 the-mobile' onClick={function () { acceptMutation.mutate(item.sender._id) }} />
                        <CircleX color={'red'} className='the-mobile' onClick={function () { rejectMutation.mutate(item.sender._id) }} />
                      </div>

                      <div className='the-desktop'>
                        <button className='mr-2' onClick={function () { acceptMutation.mutate(item.sender._id) }}>Accept</button>
                        <button className='bg-red-600' onClick={function () { rejectMutation.mutate(item.sender._id) }}>Decline</button>
                      </div>
                    </div>
                  )
                }) :
                <div className='flex flex-col gap-1 items-center my-10'>
                  <UserPlus size={54} color={'gray'} />
                  <p className='text-xl my-3'>No connection requests</p>
                </div>
            }
          </>:''
        }

        <h3 className='section-title flex gap-3 items-center'>Sent Requests {returnChevron('sentRequests')}</h3>
        {
          showSentRequests? 
          <>
            {
              sentRequests.data && sentRequests.data.length > 0 ?
                <div className='flex gap-3 my-4 flex-wrap connection-container'>
                  {
                    sentRequests.data.map((item: sentRequestType) => {
                      return (
                        <div className='shaded-border connection-card' key={item._id}>
                          <Link to={'/profile/' + item.recipient.username} className='hand-hover flex flex-col gap-2 items-center'>
                            <div>
                              <img src={item.recipient.profilePicture} className='profile-img-large circle img-fit' />
                            </div>
                            <div>
                              <h1 className='font-bold'>{item.recipient.fullName}</h1>
                              <p className='text-sm text-gray-600'>{item.recipient.headline && item.recipient.headline.length > 20 ? item.recipient.headline.slice(0, 20) + '...' : item.recipient.headline}</p>
                            </div>
                          </Link>
                          <button onClick={function () { cancelRequestMutation.mutate(item.recipient._id) }}>CANCEL</button>
                        </div>
                      )
                    })
                  }
                </div> :
                <div className='flex flex-col gap-1 items-center my-10'>
                  <UserPlus size={54} color={'gray'} />
                  <p className='text-xl my-3'>No sent requests</p>
                </div>
            }
          </>:''
        }

        <h3 className='section-title flex gap-3 items-center'>My Connections {returnChevron('connections')}</h3>
        {
          showConnections?
          <>
            {
              allConnections.data && allConnections.data.length > 0 ?
                <div className='flex gap-3 my-4 connection-container'>
                  {
                    allConnections.data.map((item: userDetailsType) => {
                      return (
                        <div className='shaded-border connection-card' key={item._id}>
                          <Link to={'/profile/' + item.username} className='hand-hover flex flex-col gap-2 items-center'>
                            <img src={item.profilePicture} className='profile-img-large circle img-fit' />
                            <div>
                              <h1 className='font-bold'>{item.fullName}</h1>
                              <p className='text-sm text-gray-600'>{item.headline && item.headline.length > 20 ? item.headline.slice(0, 20) + '...' : item.headline}</p>
                            </div>
                          </Link>
                          <button className='bg-red-600' onClick={function () { deleteConnectionMutation.mutate(item._id) }}>DELETE</button>
                        </div>
                      )
                    })
                  }
                </div> :
                <div className='flex flex-col gap-1 items-center my-10'>
                  <UserPlus size={54} color={'gray'} />
                  <p className='text-xl my-3'>No connections</p>
                </div>
            }
          </>:''
        }
      </div>
    </div>
  )
}

export default NetworkPage