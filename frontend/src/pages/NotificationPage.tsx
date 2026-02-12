import { useQuery } from '@tanstack/react-query';
import type { AuthUserType, NotificationType } from '../utils/types';
import { daysAgo, getRequest } from '../utils/utilFunctions';
import { Eye, Trash2, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

function NotificationPage({userData}: {userData: AuthUserType}) {

  const notifications = useQuery({
    queryKey: ['notifications', userData?._id],
    enabled: !!userData,
    queryFn: async () => {
      try {
        const data = await getRequest('/notifications');
        console.log(data);
        return data.notifications;
      } catch (error) {
        return error;
      }
    },
  });

  const notificationType = function(arg: string){
    if(arg === 'connectionAccepted'){
      return 'accepted your connection request';
    }
  };

  const notificationIcon = function(arg: string){
    if(arg === 'connectionAccepted'){
      return <UserPlus />
    }
  }

  return (
    <div className='main'>
      <div className='main-container shaded-border'>
        <h1 className='font-bold text-2xl mb-10'>Notifications</h1>
        {
          notifications.data && notifications.data.length > 0?
          <>
            {
              notifications.data.map((notification: NotificationType) => {
                return(
                  <div key={notification._id} className='flex justify-between'>
                    <div className='flex gap-5'>
                      <Link to={`/profile/${notification.relatedUser._id}`}>
                        <img src={notification.relatedUser.profilePicture} className='profile-img'/>
                      </Link>
                      <div>
                        <div className='flex gap-2'>
                        {notificationIcon(notification.type)}
                        <h1><span className='font-bold'>{notification.relatedUser.fullName}</span> {notificationType(notification.type)}</h1>
                        </div>
                        <p className='text-gray-600 text-sm mt-2'>{daysAgo(notification.createdAt)}</p>
                      </div>
                    </div>
                    <div className='flex gap-4'>
                      <Eye color={'skyblue'} className='hand-hover'/>
                      <Trash2 color={'red'} className='hand-hover' />
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