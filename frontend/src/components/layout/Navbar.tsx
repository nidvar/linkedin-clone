import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Home, LogOut, User, Users } from 'lucide-react';

// local imports
import { getRequest, postRequest } from "../../utils/utilFunctions";
import type { AuthUserType } from "../../utils/types";

const Navbar = () => {

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData<AuthUserType | null>(['authUser']);

  const query = useQuery({ 
    queryKey: ['notifications'], 
    queryFn: async () => {
      try {
        const notifications = await getRequest('/notifications');
        console.log(notifications);
        return notifications;
      } catch (error) {
        return error;
      }
    },
    enabled: authUser !== null
  });

  const mutateObj = useMutation({
    mutationFn: async () => {
      return await postRequest('/auth/logout', {});
    },
    onSuccess: ()=>{
      queryClient.setQueryData(['authUser'], null);
      navigate('/login');
    },
    onError: (error)=>{
      console.log(error);
    }
  });

  if (query.isLoading) return null;

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
              <Link to='/' className="flex flex-col items-center gap-1 hand-hover">
                <Users/>
                <span title="Connections" className="text-xs">My Network</span>
              </Link>
              <Link to='/' className="flex flex-col items-center gap-1 hand-hover">
                <User/>
                <span title="Profile" className="text-xs">Me</span>
              </Link>
              <Link to='/' className="flex flex-col items-center gap-1 hand-hover">
                <Bell/>
                <span title="Notifications" className="text-xs">Notifications</span>
              </Link>
              <div className="flex flex-col items-center gap-1 hand-hover">
                <LogOut onClick={function(){mutateObj.mutate()}}/>
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