import { useEffect, useState, type SubmitEvent } from 'react';
import { useParams } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postRequest } from '../utils/utilFunctions';
import type { AuthUserType } from '../utils/types';

function AboutSection({data, ownProfile}: {data: AuthUserType, ownProfile: boolean}) {

  const { username } = useParams();
  const queryClient = useQueryClient();

  const [edit, setEdit] = useState(false);

  const [about, setAbout] = useState('');

  const updateAboutMutation = useMutation({
    mutationFn: async (body: string) => {
      const result = await postRequest('/user/updatedetails', {about: body});
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
      setAbout('');
      setEdit(false);
    },
  });

  const handleSubmit = async function(e: SubmitEvent){
    e.preventDefault();
    updateAboutMutation.mutate(about);
  }

  useEffect(()=>{
    if(data.username != undefined || data.username != null || data.username != ''){
      setAbout(data.about);
    }
  }, [data])

  return (
    <div className='profile-section shaded-border'>
      <h3 className='section-title'>About</h3>
      {
        edit?
        <form onSubmit={handleSubmit}>
          <textarea 
            value={about} 
            className='p-3 my-3' 
            placeholder='Type here...' 
            onChange={function(e){setAbout(e.target.value)}}
          ></textarea>
          <button className='mr-3' type="submit">Update</button>
          <button className='edit-button' onClick={function(){setEdit(prev => !prev)}}>{edit?'Cancel':'Edit'}</button>
        </form>:<p className='profile-section-content'>{data.about}</p>
      }
      {
        ownProfile === true?
        <>
          {
            edit === false?
            <button className='edit-button' onClick={function(){setEdit(prev => !prev)}}>Edit</button>:''
          }
        </>:''
      }
    </div>
  )
}

export default AboutSection