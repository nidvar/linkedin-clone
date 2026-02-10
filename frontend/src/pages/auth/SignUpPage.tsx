import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, type SubmitEvent } from 'react';
import { postRequest } from '../../utils/utilFunctions';
import { Link, useNavigate } from 'react-router-dom';
import type { AuthUser } from '../../utils/types';

function SignUpPage() {

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const mutateObj = useMutation({
    mutationFn: async () => {
      const body = { firstName, lastName, email, password };
      const result = await postRequest('/auth/signup', body);
      if (result.success === true) { 
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      }else{
        setError(result.message);
      }
      return result;
    }
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    mutateObj.mutate();
  };

  return (
    <>
      <h1 className="text-3xl mb-8 text-center">Make the most of your professional life</h1>
      <form className='signup-form' onSubmit={handleSubmit}>
        <label className='label'>First Name</label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={function (e) { setFirstName(e.target.value) }}
        />

        <label className='label'>Last Name</label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={function (e) { setLastName(e.target.value) }}
        />

        <label className='label'>Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={function (e) { setEmail(e.target.value) }}
        />

        <label className='label'>Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={function (e) { setPassword(e.target.value) }}
        />
        <p className='agreement m-5'>By clicking Agree & Join or Continue, you agree to the LinkedIn <Link 
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
        {
          mutateObj.isPending ? <p className='text-center'>Signing up...</p> : <button type="submit" className='blue-button'>Agree & Join</button>
        }
        {error}
        <div>
          <p className='text-center mt-5'>Already on LinkedIn? <Link to='/login' className="link bold">Sign in</Link></p>
        </div>
      </form>
    </>
  )
}

export default SignUpPage;