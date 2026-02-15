import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, Users } from 'lucide-react';
import { useEffect, useState } from "react";

// local imports
import { getRequest, postRequest } from "../../utils/utilFunctions";
import type { NotificationType } from "../../utils/types";

const Navbar = () => {

  const [unread, setUnreadCount] = useState(0);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const userData = useQuery({ 
    queryKey: ['authUser'], 
    queryFn: async () => {
      try {
        const authUser = await getRequest('/auth/me');
        const user = authUser.user;
        return user;
      } catch (error) {
        return null;
      }
    }
  });

  const notifications = useQuery({
    queryKey: userData.data ? ['notifications', userData.data._id] : ['notifications', 'guest'], 
    queryFn: async () => {
      try {
        const data = await getRequest('/notifications');
        return data.notifications;
      } catch (error) {
        return error;
      }
    },
    enabled: userData.data !== null,
  });

  const connectionRequests = useQuery({ 
    queryKey: ['requests'], 
    queryFn: async () => {
      try {
        const data = await getRequest('/connections/requests');
        return data.connectionRequests;
      } catch (error) {
        return error;
      }
    },
    enabled: userData.data !== null,
  });

  const mutateObj = useMutation({
    mutationFn: async () => {
      return await postRequest('/auth/logout', {userId: userData.data?._id});
    },
    onSuccess: ()=>{
      queryClient.setQueryData(['authUser'], null);
      navigate('/login');
    },
    onError: (error)=>{
      console.log(error);
    }
  });

  useEffect(() => {
    if (notifications.data) {
      let unreadCount = 0;
      notifications.data.forEach((item: NotificationType)=>{
        if(item.read === false) unreadCount ++;
      });
      setUnreadCount(unreadCount);
    }
  }, [notifications.data]);

  if (userData.isLoading) return null;
  if (notifications.isLoading) return null;
  if (connectionRequests.isLoading) return null;

  return (
    <div className="my-nav-container relative">
      <div className='my-nav flex justify-between py-2'>
        <div className="nav-left-side">
          <Link to='/'><img src="/long-logo.png" alt="logo" className="logo-img"/></Link>
        </div>
        <div className="nav-right-side">
          {
            userData.data?
            <>
              <Link to='/' className="flex flex-col items-center hand-hover">
                <img src={userData.data.profilePicture} alt="" className="profile-img-small"/>
                <span title="Profile" className="text-xs mt-1">{userData.data.fullName}</span>
              </Link>

              <Link to='/network' className="flex flex-col items-center gap-1 hand-hover relative">
                <Users height={24}/>
                <span title="Connections" className="text-xs">My Network</span>
                {
                  connectionRequests.data && connectionRequests.data.length > 0?
                  <span className='notification-dot'>
                    {connectionRequests.data.length}
                  </span>:''
                }
              </Link>

              <Link to='/notifications' className="flex flex-col items-center gap-1 hand-hover relative">
                <Bell height={24}/>
                <span title="Notifications" className="text-xs">Notifications</span>
                {
                  notifications.data && unread > 0?
                  <span className='notification-dot'>
                    {unread}
                  </span>:''
                }
              </Link>

              <div className="flex flex-col items-center gap-1 hand-hover" onClick={function(){mutateObj.mutate()}}>
                <LogOut height={24}/>
                <span title="Logout" className="text-xs">Logout</span>
              </div>
            </>:''
          }
        </div>
      </div>
    </div>
  )
}

export default Navbar;