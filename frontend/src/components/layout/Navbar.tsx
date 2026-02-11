import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, Users } from 'lucide-react';

// local imports
import { getRequest, postRequest } from "../../utils/utilFunctions";
import type { AuthUserType } from "../../utils/types";

const Navbar = () => {

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData<AuthUserType | null>(['authUser']);

  const notifications = useQuery({ 
    queryKey: ['notifications'], 
    queryFn: async () => {
      try {
        const data = await getRequest('/notifications');
        return data.notifications;
      } catch (error) {
        return error;
      }
    },
    enabled: authUser !== null,
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
    enabled: authUser !== null,
  });

  const mutateObj = useMutation({
    mutationFn: async () => {
      return await postRequest('/auth/logout', {userId: authUser?._id});
    },
    onSuccess: ()=>{
      queryClient.setQueryData(['authUser'], null);
      navigate('/login');
    },
    onError: (error)=>{
      console.log(error);
    }
  });

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
            authUser?
            <>
              <Link to='/' className="flex flex-col items-center hand-hover">
                <img src={authUser.profilePicture} alt="" className="profile-img-small"/>
                <span title="Profile" className="text-xs mt-1">Profile</span>
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
                  notifications.data && notifications.data.length > 0?
                  <span className='notification-dot'>
                    {notifications.data.length}
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