import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

import { postRequest } from '../utils/utilFunctions';
import type { AuthUserType } from '../utils/types';

function ProfileSections({section, profileData, canUpdate}: {section: string, profileData: AuthUserType, canUpdate: boolean}) {

  const { username } = useParams();
  const queryClient = useQueryClient();

  const [edit, setEdit] = useState(false);

  const [about, setAbout] = useState('');

  const updateSectionMutation = useMutation({
    mutationFn: async () => {
      const body = { section };
      const result = await postRequest('/user/update', body);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
    },
  });

  const displayData = function(){
    if(section === 'About'){
      return profileData.about;
    }
    if(section === 'Experiences'){
      profileData.experience.map((item)=>{
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
    if(section === 'Education'){
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
    if(section === 'Skills'){
      profileData.skills.map((item)=>{
        return (
          <div className='flex gap-2' key={Math.random()}>
            <p>{item}</p>
          </div>
        )
      })
    }
  }

  return (
    <div className='profile-section shaded-border'>
      <h1>{section}</h1>
      <p className='profile-section-content'>{displayData()}</p>
      {
        section === 'About'?
        <>
        {
          edit?
          <>
            <textarea value={about} className='p-3' placeholder='Type here...' onChange={function(e){setAbout(e.target.value)}}></textarea>
            <button className='mr-3' onClick={function(){}}>Update</button>
          </>:''
        }
        </>:''
      }
      {
        canUpdate === true?
        <button className='edit-button' onClick={function(){setEdit(prev => !prev);}}>{edit?'Cancel':'Edit'}</button>:''
      }
    </div>
  )
}

export default ProfileSections