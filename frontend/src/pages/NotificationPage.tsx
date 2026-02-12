import { useQueryClient } from '@tanstack/react-query';
import type { NotificationType } from '../utils/types';

function NotificationPage() {

  const queryClient = useQueryClient();
  const notifications = queryClient.getQueryData< NotificationType[] | null>(['notifications']);

  console.log(notifications);

  return (
    <div>
      <h1>Notifications</h1>
      {
        notifications && notifications.length > 0?
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
  )
}

export default NotificationPage