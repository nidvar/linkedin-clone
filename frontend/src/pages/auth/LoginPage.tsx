import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, type SubmitEvent } from 'react';
import { postRequest } from '../../utils/utilFunctions';
import { Link } from 'react-router-dom';

function LoginPage() {

  const queryClient = useQueryClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const mutateObj = useMutation({
    mutationFn: async () => {
      const body = { email, password };
      await postRequest('/auth/login', body);
    },
    onSuccess: ()=>{
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error)=>{
      setError(error.message || 'Login failed');
    }
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    mutateObj.mutate();
  };

  return (
    <div className='signup-page login-page'>
      <form className='signup-form login-form shaded-border' onSubmit={handleSubmit}>
        <h1 className='text-3xl mb-4'>Sign in</h1>
        <input
          id="email"
          type="email"
          placeholder='email'
          value={email}
          onChange={function (e) { setEmail(e.target.value) }}
        />

        <input
          id="password"
          type="password"
          placeholder='password'
          value={password}
          onChange={function (e) { setPassword(e.target.value) }}
        />
        {
          mutateObj.isPending ? <p className='text-center'>Logging in...</p> : <button type="submit" className='blue-button'>Sign In</button>
        }
        {
          error !== '' ? <p className='error'>{error}</p> : null
        }
        <p className='agreement'>By clicking Agree & Join or Continue, you agree to the LinkedIn <Link 
            className='link bold'
            to='https://www.linkedin.com/legal/user-agreement?trk=registration-frontend_join-form-user-agreement'
            target="_blank"
          >User Agreement
          </Link>, <Link 
            className='link bold'
            to='https://www.linkedin.com/legal/privacy-policy?trk=registration-frontend_join-form-privacy-policy'
            target="_blank"
          >
          Privacy Policy</Link>, and <Link 
            className='link bold'
            to='https://www.linkedin.com/legal/cookie-policy?trk=registration-frontend_join-form-cookie-policy'
            target="_blank"
          >Cookie Policy</Link>.</p>
        <div>
          <p className='text-center'>New to LinkedIn? <Link to='/signup' className="link bold">Join now</Link></p>
        </div>
      </form>
    </div>
  )
}

export default LoginPage;