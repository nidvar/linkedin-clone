import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CircleX } from 'lucide-react';

import type { AuthUserType, ExperienceType } from '../utils/types'
import { postRequest } from '../utils/utilFunctions';

function ExperienceSection({data, ownProfile}: {data: AuthUserType, ownProfile: boolean}) {

  const { username } = useParams();
  const queryClient = useQueryClient();

  const [edit, setEdit] = useState(false);
  const [add, setAdd] = useState(false);

  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [startYear, setStartYear] = useState(0);
  const [endYear, setEndYear] = useState(0);

  const [changes, setChanges] = useState(false);

  const [experienceArray, setExperienceArray] = useState<ExperienceType[]>([]);

  const updateSectionMutation = useMutation({
    mutationFn: async (body: {experience: ExperienceType[]}) => {
      const result = await postRequest('/user/updatedetails', body);
      if(result.message === 'User details updated') return result;
    },
    onSuccess: () => {
      clearStudyFields();
      setEdit(false);
      setAdd(false);
      setChanges(false);
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
    },
  });

  const clearStudyFields = ()=>{
    setCompany('');
    setTitle('');
    setEndYear(0);
    setStartYear(0);
  }

  const cancelAllChanges = function(){
    clearStudyFields();
    setChanges(false);
    setEdit(false);
    setAdd(false);

    let array = [...data.experience];
    setExperienceArray(array);
  }

  const deleteStudy = (index: number)=>{
    let array = [...experienceArray];
    array.splice(index, 1);
    setExperienceArray(array);
    setChanges(true);
  };

  const saveDeletionToDB = ()=>{
    updateSectionMutation.mutate({experience: experienceArray});
  }

  const addExperience = ()=>{
    if(company === '' || title === '' || startYear === 0 || endYear === 0) return;
    const newExperience = {company: company, title: title, startYear: startYear, endYear: endYear};
    let array = [...experienceArray];
    array.push(newExperience);
    updateSectionMutation.mutate({experience: array});
  };

  useEffect(()=>{
    if(data.username != undefined || data.username != null || data.username != ''){
      setExperienceArray(data.experience);
    }
  }, [data]);

  return (
    <div className='profile-section shaded-border'>
      <h3 className='section-title'>Experience</h3>
      <div className='profile-section-content'>
        {
          experienceArray.map((item, index)=>{
            return (
              <div className='education-details-array flex items-center gap-4' key={Math.random()}>
                {edit? <CircleX color={'red'} className='hand-hover mt-1' size={20} onClick={function(){deleteStudy(index)}}/>:''}
                <div key={Math.random()}>
                  <p><span>Title:</span> {item.title}</p>
                  <p><span>Company:</span> {item.company}</p>
                  <p><span>Time of Employment:</span> {item.startYear.toString()} - {item.endYear.toString()}</p>
                  <p><span>Description:</span> {item.title}</p>
                </div>
              </div>
            )
          })
        }
      </div>
      {
        add?
          <div className='profile-details-update-form'>
            <label className='label'>Company</label>
            <input
              id="company"
              type="text"
              value={company}
              onChange={function (e) { setCompany(e.target.value) }}
            />
            <label className='label'>Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={function (e) { setTitle(e.target.value) }}
            />
            <label className='label'>Start year</label>
            <input
              id="startYear"
              type="number"
              value={startYear == 0?'':startYear}
              onChange={function (e) { setStartYear(Number(e.target.value)) }}
            />
            <label className='label'>End year</label>
            <input
              id="endYear"
              type="number"
              value={endYear == 0?'':endYear}
              onChange={function (e) { setEndYear(Number(e.target.value)) }}
            />
          </div>:''
      }

      {
        ownProfile === true?
        <>
          {
            add?
            <div className='flex my-3 gap-3'>
              <button onClick={function(){addExperience()}}>SAVE</button>
              <button className='edit-button' onClick={function(){cancelAllChanges()}}>Cancel</button>
            </div>:''
          }
          {
            changes?
            <div className='flex my-3 gap-3'>
              <button onClick={function(){saveDeletionToDB()}}>SAVE</button>
              <button className='edit-button' onClick={function(){cancelAllChanges()}}>Cancel</button>
            </div>:''
          }
          {
            edit && !changes?
            <button className='edit-button' onClick={function(){cancelAllChanges()}}>Cancel</button>:''
          }
          {
            add || edit?
              '':
              <div className='flex gap-3 items-center'>
                <button className='edit-button' onClick={function(){setEdit(prev => !prev); clearStudyFields();}}>Edit</button>
                <button className='edit-button' onClick={function(){setAdd(true)}}>Add</button>
              </div>
          }
        </>:''
      }
    </div>
  )
}

export default ExperienceSection