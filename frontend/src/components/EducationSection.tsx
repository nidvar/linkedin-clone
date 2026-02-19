import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CircleX } from 'lucide-react';

import type { AuthUserType, EducationType } from '../utils/types'
import { postRequest } from '../utils/utilFunctions';

function EducationSection({data, ownProfile}: {data: AuthUserType, ownProfile: boolean}) {
  
  const { username } = useParams();
  const queryClient = useQueryClient();

  const [edit, setEdit] = useState(false);
  const [add, setAdd] = useState(false);

  const [school, setSchool] = useState('');
  const [field, setField] = useState('');
  const [startYear, setStartYear] = useState(0);
  const [endYear, setEndYear] = useState(0);

  const [changes, setChanges] = useState(false);

  const [educationArray, setEducationArray] = useState<EducationType[]>([]);

  const updateSectionMutation = useMutation({
    mutationFn: async (body: {education: EducationType[]}) => {
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
    setSchool('');
    setField('');
    setEndYear(0);
    setStartYear(0);
  }

  const cancelAllChanges = function(){
    clearStudyFields();
    setChanges(false);
    setEdit(false);
    setAdd(false);

    let array = [...data.education];
    setEducationArray(array);
  }

  const deleteStudy = (index: number)=>{
    let array = [...educationArray];
    array.splice(index, 1);
    setEducationArray(array);
    setChanges(true);
  };

  const saveDeletionToDB = ()=>{
    updateSectionMutation.mutate({education: educationArray});
  }

  const addStudy = ()=>{
    if(school === '' || field === '' || startYear === 0 || endYear === 0) return;
    const newStudy = {school: school, field: field, startYear: startYear, endYear: endYear};
    let array = [...educationArray];
    array.push(newStudy);
    updateSectionMutation.mutate({education: array});
  };

  useEffect(()=>{
    if(data.username != undefined || data.username != null || data.username != ''){
      setEducationArray(data.education);
    }
  }, [data]);

  return (
    <div className='profile-section shaded-border'>
      <h3 className='section-title'>Education</h3>
      <div className='profile-section-content'>
        {
          educationArray.map((item, index)=>{
            return (
              <div className='education-details-array flex items-center gap-4' key={Math.random()}>
                {edit? <CircleX color={'red'} className='hand-hover mt-1' size={20} onClick={function(){deleteStudy(index)}}/>:''}
                <div>
                  <p><span>School:</span> {item.school}</p>
                  <p><span>Field of Study:</span> {item.field}</p>
                  <p><span>Start Year:</span> {item.startYear.toString()}</p>
                  <p><span>End Year:</span> {item.endYear.toString()}</p>
                </div>
              </div>
            )
          })
        }
      </div>
      {
        add?
          <div className='profile-details-update-form'>
            <label className='label'>School</label>
            <input
              id="school"
              type="text"
              value={school}
              onChange={function (e) { setSchool(e.target.value) }}
            />
            <label className='label'>Field of study</label>
            <input
              id="field"
              type="text"
              value={field}
              onChange={function (e) { setField(e.target.value) }}
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
              <button onClick={function(){addStudy()}}>SAVE</button>
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

export default EducationSection