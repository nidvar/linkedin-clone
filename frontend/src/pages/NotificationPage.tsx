import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { AuthUserType, NotificationType } from '../utils/types';
import { getRequest } from '../utils/utilFunctions';

function NotificationPage() {

  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData<AuthUserType | null>(['authUser']);

  const notifications = useQuery({
    queryKey: ['notifications'], 
    queryFn: async () => {
      try {
        const data = await getRequest('/notifications');
        console.log(data);
        return data.notifications;
      } catch (error) {
        return error;
      }
    },
    enabled: authUser !== null,
  });

  console.log(notifications.data);

  return (
    <div className='main'>
      <div className='main-container shaded-border'>
        <h1 className='font-bold text-2xl my-3'>Notifications</h1>
        {
          notifications.data && notifications.data.length > 0?
          <div>
            <div>

            </div>

            <div>

            </div>

            <div>

            </div>
          </div>:
          <div>No notifications</div>
        }
      </div>
    </div>
  )
}

export default NotificationPage