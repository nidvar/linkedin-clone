import { useParams } from 'react-router-dom';
import type { AuthUserType } from '../utils/types'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { postRequest } from '../utils/utilFunctions';

function ExperienceSection({data, ownProfile}: {data: AuthUserType, ownProfile: boolean}) {
  
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
      <h1 className='font-semibold'>Experience</h1>
      <div className='profile-section-content'>
        {
          data.experience.map((item)=>{
            return (
              <div key={Math.random()}>
                <p>Title: {item.title}</p>
                <p>Company: {item.title}</p>
                <p>Time of Employment: {item.startYear} - {item.endYear}</p>
                <p>Number of Months: {item.numberOfMonths}</p>
                <p>Description: {item.title}</p>
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

export default ExperienceSection