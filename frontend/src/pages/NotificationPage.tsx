import { useQueryClient } from '@tanstack/react-query';
import type { NotificationType } from '../utils/types';

function NotificationPage() {

  const queryClient = useQueryClient();
  const notifications = queryClient.getQueryData< NotificationType | null>(['notifications']);

  console.log(notifications);

  return (
    <div>NotificationPage</div>
  )
}

export default NotificationPage