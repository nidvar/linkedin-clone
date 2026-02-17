import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { postRequest } from '../utils/utilFunctions';
import type { AuthUserType } from '../utils/types';

function AboutSection({profileData, ownProfile}: {profileData: AuthUserType, ownProfile: boolean}) {

  const { username } = useParams();
  const queryClient = useQueryClient();

  const [edit, setEdit] = useState(false);

  const [about, setAbout] = useState('');

  const updateSectionMutation = useMutation({
    mutationFn: async () => {
      const result = await postRequest('/user/update', {});
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
    },
  });

  return (
    <div className='profile-section shaded-border'>
      <h1>About</h1>
      <p className='profile-section-content'>{profileData.about}</p>
      {
        edit?
        <>
          <textarea value={about} className='p-3' placeholder='Type here...' onChange={function(e){setAbout(e.target.value)}}></textarea>
          <button className='mr-3' onClick={function(){}}>Update</button>
        </>:''
      }
      {
        ownProfile === true?
        <button className='edit-button' onClick={function(){setEdit(prev => !prev);}}>{edit?'Cancel':'Edit'}</button>:''
      }
    </div>
  )
}

export default AboutSection