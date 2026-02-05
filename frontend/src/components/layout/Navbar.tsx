import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { postRequest } from "../../utils/utilFunctions";

const Navbar = () => {

  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  return (
    <div className='border m-10 bg-blue-100 flex gap-10'>
      <Link to='/'>Home</Link>
      <Link to='/login'>Login</Link>
      <Link to='/signup'>Sign up</Link>
      <button onClick={function(){mutateObj.mutate()}}>LOGOUT</button>
    </div>
  )
}

export default Navbar;