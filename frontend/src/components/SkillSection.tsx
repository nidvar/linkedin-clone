import React, { useState } from 'react'
import type { AuthUserType } from '../utils/types';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postRequest } from '../utils/utilFunctions';

function SkillSection({profileData, canUpdate}: {profileData: AuthUserType, canUpdate: boolean}) {
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
      <h1>Skills</h1>
      <div className='profile-section-content'>
        {
          profileData.skills.map((item)=>{
            return (
              <div className='flex gap-2' key={Math.random()}>
                <p>{item}</p>
              </div>
            )
          })
        }
      </div>
      {
        canUpdate === true?
        <button className='edit-button' onClick={function(){setEdit(prev => !prev);}}>{edit?'Cancel':'Edit'}</button>:''
      }
    </div>
  )
}

export default SkillSection