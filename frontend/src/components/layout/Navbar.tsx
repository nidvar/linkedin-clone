import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, Search, Users } from 'lucide-react';
import { useEffect, useState } from "react";

// local imports
import { fetchUser, getRequest, postRequest } from "../../utils/utilFunctions";
import type { NotificationType } from "../../utils/types";

const Navbar = () => {

  const [unread, setUnreadCount] = useState(0);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const userData = useQuery({ 
    queryKey: ['authUser'], 
    queryFn: fetchUser
  });

  const notifications = useQuery({
    queryKey: userData.data ? ['notifications', userData.data._id] : ['notifications', 'guest'], 
    queryFn: async () => {
      const data = await getRequest('/notifications');
      return data.notifications;
    },
    enabled: userData.data !== null,
  });

  const connectionRequests = useQuery({ 
    queryKey: ['requests'], 
    queryFn: async () => {
      const data = await getRequest('/connections/requests');
      return data.connectionRequests;
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
    <>
      <div className="the-mobile-nav the-mobile">
        <div className="flex justify-between items-center">
          <Link to='/'><img src="/small-logo.png" alt="logo" className="logo-img"/></Link>
          <Link to='/'>
            <input className="search-input"/>
          </Link>
          <Link to='/' className="hand-hover">
            <Search />
          </Link>
        </div>
      </div>

      <div className="my-nav-container relative">
        <div className='my-nav flex justify-between py-2'>
          <div className="nav-left-side the-desktop">
            <Link to='/'><img src="/long-logo.png" alt="logo" className="logo-img"/></Link>
          </div>
          <div className="nav-right-side">
            {
              userData.data?
              <>
                <Link to={'/profile/' + userData.data.username} className="flex flex-col gap-1 items-center hand-hover">
                  <img src={userData.data.profilePicture} alt="" className="circle img-fit profile-img-small the-desktop"/>
                  <img src={userData.data.profilePicture} alt="" className="circle img-fit nav-icons the-mobile"/>
                  <span title="Profile" className="text-xs the-mobile">Me</span>
                  <span title="Profile" className="text-xs the-desktop">{userData.data.fullName}</span>
                </Link>

                <Link to='/network' className="flex flex-col items-center gap-1 hand-hover relative">
                  <Users className="nav-icons"/>
                  <span title="Connections" className="text-xs">My Network</span>
                  {
                    connectionRequests.data && connectionRequests.data.length > 0?
                    <span className='notification-dot'>
                      {connectionRequests.data.length}
                    </span>:''
                  }
                </Link>

                <Link to='/notifications' className="flex flex-col items-center gap-1 hand-hover relative">
                  <Bell className="nav-icons"/>
                  <span title="Notifications" className="text-xs">Notifications</span>
                  {
                    notifications.data && unread > 0?
                    <span className='notification-dot'>
                      {unread}
                    </span>:''
                  }
                </Link>

                <div className="flex flex-col items-center gap-1 hand-hover" onClick={function(){mutateObj.mutate()}}>
                  <LogOut className="nav-icons"/>
                  <span title="Logout" className="text-xs">Logout</span>
                </div>
              </>:''
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar;