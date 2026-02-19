import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CircleX, SquarePlus } from 'lucide-react';

import type { AuthUserType, EducationType } from '../utils/types'
import { postRequest } from '../utils/utilFunctions';

function EducationSection({data, ownProfile}: {data: AuthUserType, ownProfile: boolean}) {
  
  const { username } = useParams();
  const queryClient = useQueryClient();

  const [edit, setEdit] = useState(false);

  const [school, setSchool] = useState('');
  const [field, setField] = useState('');
  const [startYear, setStartYear] = useState(0);
  const [endYear, setEndYear] = useState(0);

  const [educationArray, setEducationArray] = useState<EducationType[]>([]);

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

  const handleSubmit = async ()=>{
    console.log('submit')
  };

  const addStudy = ()=>{
    const newStudy = {school: school, field: field, startYear: startYear, endYear: endYear};
    let array = [...educationArray]
    array.push(newStudy);
    setEducationArray(array);
    clearStudy();
  };

  const clearStudy = ()=>{
    setSchool('');
    setField('');
    setEndYear(0);
    setStartYear(0);
  }

  const deleteStudy = (index: number)=>{
    let array = [...educationArray];
    array.splice(index, 1);
    setEducationArray(array);
  }
  
  useEffect(()=>{
    if(data.username != undefined || data.username != null || data.username != ''){
      setEducationArray(data.education);
    }
  }, [data]);

  return (
    <div className='profile-section shaded-border'>
      <h1 className='font-semibold'>Education</h1>
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
        edit?
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
            <div className='flex justify-between'>
              <button className='edit-button' onClick={function(){setEdit(prev => !prev);clearStudy();}}>Cancel</button>
              <div className='flex my-3 gap-1 font-semibold items-center'>ADD<SquarePlus size={30} className='hand-hover' onClick={function(){addStudy()}}/></div>
            </div>
          </div>:''
      }

      {
        ownProfile === true?
        <>
          {
            edit?
            <button onClick={function(e){setEdit(prev => !prev);clearStudy(); handleSubmit();}}>UPDATE</button>:
            <button className='edit-button' onClick={function(){setEdit(prev => !prev); clearStudy();}}>Edit</button>
          }
        </>:''
      }
    </div>
  )
}

export default EducationSection