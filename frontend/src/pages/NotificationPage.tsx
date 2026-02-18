import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AuthUserType, NotificationType } from '../utils/types';
import { daysAgo, getRequest, postRequest } from '../utils/utilFunctions';
import { Eye, ThumbsUp, Trash2, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

function NotificationPage({userData}: {userData: AuthUserType}) {

  const queryClient = useQueryClient();

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

  return (
    <div className='main'>
      <div className='main-container shaded-border'>
        <h1 className='font-bold text-2xl mb-10'>Notifications</h1>
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
                    <div className='flex justify-between my-4'>
                      <div className='w-full'>
                        <div className='flex gap-5 related-post-container'>
                          <Link to={`/profile/${notification.relatedUser._id}`}>
                            <img src={notification.relatedUser.profilePicture} className='profile-img circle img-fit'/>
                          </Link>
                          <div className='w-full'>
                            <div className='flex gap-2'>
                              {notificationIcon(notification.type)}
                              <h1>
                                <span className='font-bold'>{notification.relatedUser.fullName}</span> {notificationType(notification.type)}
                              </h1>
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
                      <div className='flex gap-4'>
                        {
                          notification.read === true?
                          <Eye color={'skyblue'} />:
                          <Eye color={'black'} className='hand-hover' onClick={function(){readMutation.mutate(notification._id)}}/>
                        }
                        <Trash2 color={'red'} className='hand-hover' onClick={function(){deleteMutation.mutate(notification._id)}}/>
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