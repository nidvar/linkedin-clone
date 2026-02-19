import { useState, useEffect, type SubmitEvent } from 'react';
import type { AuthUserType } from '../utils/types';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postRequest } from '../utils/utilFunctions';
import { Plus, Trash2 } from 'lucide-react';

function SkillSection({data, ownProfile}: {data: AuthUserType, ownProfile: boolean}) {
  const { username } = useParams();
  const queryClient = useQueryClient();

  const [edit, setEdit] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const updateSkillsMutation = useMutation({
    mutationFn: async (skills: string[]) => {
      const result = await postRequest('/user/updatedetails', {skills: skills});
      console.log(result)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
      setEdit(false);
    },
  });

  const addSkills = (skill: string)=>{
    setSkillInput('');
    let array = [...skills];
    array.push(skill);
    setSkills(array);
  }

  const deleteSkill = (index: number)=>{
    let array = [...skills];
    array.splice(index, 1);
    setSkills(array);
  }

  const handleSubmit = async function(e: SubmitEvent){
    e.preventDefault();
    updateSkillsMutation.mutate(skills);
  }

  useEffect(()=>{
    if(data.skills != undefined || data.skills != null || data.skills != ''){
      setSkills(data.skills);
    }
  }, [data])

  return (
    <div className='profile-section shaded-border'>
      <h3 className='section-title'>Skills</h3>
      <div className='profile-section-content'>
        {
          skills.map((item, index)=>{
            return (
              <p 
                key={index} 
                className='flex items-center gap-5'
              >
                {item}{edit?<Trash2 size={14} className='hand-hover' onClick={function(){deleteSkill(index)}}/>:''}
              </p>
            );
          })
        }
      </div>
      {
        edit?
        <form onSubmit={handleSubmit}>
          <div className='input-skills' >
            <input 
              value={skillInput}
              placeholder='Add skills' 
              onChange={function(e){setSkillInput(e.target.value)}}
            />
            <Plus className='hand-hover' onClick={function(){addSkills(skillInput)}}/>
          </div>
          <button className='mr-3' type="submit">Update</button>
          <button 
          className='edit-button' 
          onClick={
            function(){
              setEdit(prev => !prev); 
              queryClient.invalidateQueries({ queryKey: ['profile', username] });
            }
          }
          >{edit?'Cancel':'Edit'}</button>
        </form>:''
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

export default SkillSection