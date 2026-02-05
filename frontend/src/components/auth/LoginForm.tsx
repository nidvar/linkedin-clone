import { useMutation } from '@tanstack/react-query';
import { useState, type SubmitEvent } from 'react';
import { postRequest } from '../../utils/utilFunctions';
import { useNavigate } from 'react-router-dom';

function LoginForm() {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const mutateObj = useMutation({
    mutationFn: async () => {
      const body = { email, password };
      await postRequest('/auth/login', body);
    },
    onSuccess: ()=>{
      navigate('/');
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
    <form className='signup-form' onSubmit={handleSubmit}>
      <label>Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={function (e) { setEmail(e.target.value) }}
      />

      <label>Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={function (e) { setPassword(e.target.value) }}
      />
      {
        mutateObj.isPending ? <p>Logging in...</p> : <button type="submit">Sign In</button>
      }
      <p className='error'>{error}</p>
    </form>
  )
}

export default LoginForm;