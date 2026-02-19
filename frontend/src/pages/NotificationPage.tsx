import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AuthUserType, NotificationType } from '../utils/types';
import { daysAgo, getRequest, postRequest } from '../utils/utilFunctions';
import { EllipsisVertical, Eye, ThumbsUp, Trash2, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function NotificationPage({userData}: {userData: AuthUserType}) {

  const queryClient = useQueryClient();

  const [showId, setShowId] = useState('');

  const notifications = useQuery({
    queryKey: userData ? ['notifications', userData._id] : ['notifications', 'guest'],
    enabled: !!userData,
    queryFn: async () => {
      const data = await getRequest('/notifications');
      console.log(data);
      return data.notifications;
    },
  });

  const notificationType = function(arg: string){
    if(arg === 'connectionAccepted'){
      return 'accepted your connection request';
    }
    if(arg === 'like'){
      return 'liked your post';
    }
    if(arg === 'comment'){
      return 'commented on your post';
    }
  };

  const notificationIcon = function(arg: string){
    if(arg === 'connectionAccepted'){
      return <UserPlus />
    }
    if(arg === 'like'){
      return <ThumbsUp />
    }
  }

  const readMutation = useMutation({
    mutationFn: async (arg: string) => {
      const result = await postRequest('/notifications/' +arg + '/markasread', {});
      console.log(result)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userData?._id] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (arg: string) => {
      const result = await postRequest('/notifications/delete/' + arg, {}, 'DELETE');
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userData?._id] });
    }
  });

  const showMenuFn = function(id: string){
    if(showId != id){
      setShowId('');
    }
    setShowId(id);
  }

  return (
    <div className='main notification-page'>
      <div className='main-container shaded-border relative'>
        <h1 className='page-title'>Notifications</h1>
        {
          notifications.data && notifications.data.length > 0?
          <>
            {
              notifications.data.map((notification: NotificationType, index: number) => {
                return(
                  <div key={notification._id} >
                    {
                      index > 0?
                      <div className='horizontal-line'></div>:''
                    }
                    <div className='flex justify-between my-8'>
                      <div className='w-full'>
                        <div className='flex gap-3 related-post-container items-center'>
                          <Link to={`/profile/${notification.relatedUser.username}`} >
                            <img src={notification.relatedUser.profilePicture} className='profile-img circle img-fit min-w-[50px]'/>
                          </Link>
                          <div className='w-full flex flex-col gap-1'>
                            <div className='flex gap-2'>
                              <div className='the-desktop'>
                                {notificationIcon(notification.type)}
                              </div>
                              <p>
                                <span className='font-bold'>{notification.relatedUser.fullName}</span> {notificationType(notification.type)}
                              </p>
                              <div className='the-mobile mr-3'>
                                {notificationIcon(notification.type)}
                              </div>
                            </div>
                            <p className='text-gray-600 text-sm'>{daysAgo(notification.createdAt)}</p>
                            {
                              notification.type === 'comment' || notification.type === 'like'?
                              <div className='related-post hand-hover'>
                                <Link to='/' className='text-gray-600 text-sm mt-2'>{notification.relatedPost.content}</Link>
                              </div>:
                              ''
                            }
                          </div>
                        </div>
                      </div>
                      <div className='flex gap-4 the-desktop'>
                        {
                          notification.read === true?
                          <Eye color={'skyblue'} className='notification-icons'/>:
                          <Eye color={'black'} className='hand-hover notification-icons' onClick={function(){readMutation.mutate(notification._id)}}/>
                        }
                        <Trash2 color={'red'} className='hand-hover notification-icons' onClick={function(){deleteMutation.mutate(notification._id)}}/>
                      </div>
                      <div className='the-mobile'>
                        {
                          showId === notification._id?
                          <>
                            <EllipsisVertical className='hand-hover' onClick={function(){showMenuFn('')}}/>
                            <div className='notification-options'>
                              {
                                notification.read === true?
                                <p className='text-gray-400'>Read</p>:
                                <p className='hand-hover' onClick={function(){readMutation.mutate(notification._id)}}>Mark as read</p>
                              }
                              <p color={'red'} className='hand-hover' onClick={function(){deleteMutation.mutate(notification._id)}}>delete notification</p>
                              <p className='hand-hover'onClick={function(){showMenuFn('')}}>cancel</p>
                            </div>
                          </>:<EllipsisVertical className='hand-hover' onClick={function(){showMenuFn(notification._id)}}/>
                        }
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </>:<div>No notifications</div>
        }
      </div>
    </div>
  )
}

export default NotificationPage