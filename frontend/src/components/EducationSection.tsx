import { useParams } from 'react-router-dom';
import type { AuthUserType } from '../utils/types'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { postRequest } from '../utils/utilFunctions';

function EducationSection({profileData, ownProfile}: {profileData: AuthUserType, ownProfile: boolean}) {
  
  const { username } = useParams();
  const queryClient = useQueryClient();

  const [edit, setEdit] = useState(false);

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
      <h1>Education</h1>
      <div className='profile-section-content'>
        {
          profileData.education.map((item)=>{
            return (
              <div key={Math.random()}>
                <p>School: {item.school}</p>
                <p>Field of Study: {item.fieldOfStudy}</p>
                <p>Start Year: {item.startYear}</p>
                <p>End Year: {item.endYear}</p>
              </div>
            )
          })
        }
      </div>
      {
        ownProfile === true?
        <button className='edit-button' onClick={function(){setEdit(prev => !prev);}}>{edit?'Cancel':'Edit'}</button>:''
      }
    </div>
  )
}

export default EducationSection