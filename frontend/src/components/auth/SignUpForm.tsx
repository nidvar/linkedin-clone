import { useMutation } from '@tanstack/react-query';
import { useState, type SubmitEvent } from 'react';
import { postRequest } from '../../utils/utilFunctions';
import { useNavigate } from 'react-router-dom';

function SignUpForm() {

  const navigate = useNavigate();

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
        navigate('/login'); 
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
    <form className='signup-form' onSubmit={handleSubmit}>
      <label>Firt Name</label>
      <input
        id="firstName"
        type="text"
        value={firstName}
        onChange={function (e) { setFirstName(e.target.value) }}
      />

      <label>Last Name</label>
      <input
        id="lastName"
        type="text"
        value={lastName}
        onChange={function (e) { setLastName(e.target.value) }}
      />

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
        mutateObj.isPending ? <p>Signing up...</p> : <button type="submit">Agree & Join</button>
      }
      {error}
    </form>
  )
}

export default SignUpForm;