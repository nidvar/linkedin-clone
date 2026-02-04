import { useMutation } from '@tanstack/react-query';
import { useState, useEffect, type SubmitEvent } from 'react';
import { postRequest } from '../../utils/utilFunctions';

function SignUpForm() {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutateObj = useMutation({
    mutationFn: async () => {
      const body = {
        firstName,
        lastName,
        email,
        password
      };

      return postRequest('/auth/signup', body);
    }
  });

  const handleSubmit = async (e: SubmitEvent)=>{
    e.preventDefault();
    mutateObj.mutate();
  };

  useEffect(() => {
    console.log('sign up form');
  }, []);

  return (
      <form className='signup-form' onSubmit={handleSubmit}>
        <label>Firt Name</label>
        <input 
          id="firstName"
          type="text"
          value={firstName}
          onChange={function(e){setFirstName(e.target.value)}}
        />

        <label>Last Name</label>
        <input 
          id="lastName"
          type="text"
          value={lastName}
          onChange={function(e){setLastName(e.target.value)}}
        />

        <label>Email</label>
        <input 
          id="email"
          type="email"
          value={email}
          onChange={function(e){setEmail(e.target.value)}}
        />

        <label>Password</label>
        <input 
          id="password"
          type="password"
          value={password}
          onChange={function(e){setPassword(e.target.value)}}
        />
        <button type="submit">Agree & Join</button>
      </form>
  )
}

export default SignUpForm