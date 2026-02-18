import { useRef, useState, type SubmitEvent } from 'react';

import type { AuthUserType } from '../utils/types';
import { MapPin, UserPen } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postRequest } from '../utils/utilFunctions';

function ProfileHeader({data, ownProfile} : {data: AuthUserType, ownProfile: boolean}) {

  const queryClient = useQueryClient();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editProfile, setEditProfile] = useState(false);
  const [editProfilePic, setEditProfilePic] = useState(false);
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const [occupation, setOccupation] = useState('');

  const [errorMessage, setErrorMessage] = useState('');


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    if (!e.target.files) return;
    const file = e.target.files[0];
    if(e.target.files[0].size > 1500000){
      setErrorMessage('Image must be under 1.5MB');
      return;
    }
    if (file) {
      readFileAsDataURL(file)
        .then((result)=>{
          console.log(result);
          setImagePreview(result as string)}
        )
        .catch(err => console.error(err));
    } else {
      setImagePreview(null);
    }
  };

  const readFileAsDataURL = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('File reading failed: result is not a string'));
        }
      }
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const headerUpdateMutation = useMutation({
    mutationFn: async (body: {
      updateType: string;
      username: string | undefined;
      location: string;
      headline: string;
    }) => {
      return await postRequest('/user/updateheader', body);
    },
    onSuccess: () => {
      console.log('success')
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      setEditProfile(false);
    }
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const body = {
      updateType: 'header',
      username: '',
      location: '',
      headline: ''
    };

    if(username !== data.username){
      body.username = username;
    };

    if(location !== data.location){
      body.location = location;
    };

    if(occupation !== data.headline){
      body.headline = occupation;
    }

    headerUpdateMutation.mutate(body);
    console.log(occupation, location, username);
    // updateProfileMutation.mutate();
  }

  return (
    <div className='profile-picture-container relative'>
      {
        editProfilePic === true?
          <form className='profile-picture-update-form' onSubmit={handleSubmit}>
            <img 
              src={imagePreview || "blank_profile.jpg"}
              className='profile-image-preview'
            />
            <input
              className='profile-upload-input'
              ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange}
            />
            {
              errorMessage != ''?
              <p className='text-red-500 text-sm text-center'>{errorMessage}</p>:null
            }
            <div className='flex gap-1'>
              <button onClick={function(){setEditProfilePic(false)}}>CANCEL</button>
              <button type="submit">UPDATE</button>
            </div>
          </form>:
          <>
            <img src={data.profilePicture || 'avatar.png'} className='profile-img-xlarge circle'/>
            {
              ownProfile?
              <div className='profile-update-button hand-hover'>
                <UserPen size={20} onClick={function(){setEditProfilePic(true)}} />
              </div>:null
            }
          </>
      }

      {
        editProfilePic === false?
        <>
          <h1 className='bold text-xl mt-2'>{data.fullName}</h1>
          <p className='text-gray-500 text-sm'>profile/{data.username}</p>
          <p className='text-gray-500 text-sm'>Occupation: {data.headline}</p>
          <p className='text-gray-500 text-sm'>{data.connections.length} {data.connections.length != 1 ? 'connections' : 'connection'}</p>
          <p className='text-gray-500 text-sm flex items-center gap-1'><MapPin size={14} />Location: {data.location}</p>
          {
            ownProfile?
            <>
              {
                editProfile === false?
                <button className='edit-button' onClick={function(){setEditProfile(true); console.log(data)}}>Edit</button>:null
              }
            </>:null
          }
        </>:null
      }

      {
        editProfile === true?
        <form className='profile-update-form' onSubmit={handleSubmit}>
          <input placeholder='Username' value={username} onChange={function(e){setUsername(e.target.value)}} />
          <input placeholder='Occupation' value={occupation} onChange={function(e){setOccupation(e.target.value)}}/>
          <input placeholder='Location' value={location} onChange={function(e){setLocation(e.target.value)}}/>
          <div className='flex gap-1'>
            <button onClick={function(){setEditProfile(false)}}>CANCEL</button>
            <button type="submit">UPDATE</button>
          </div>
        </form>:''
      }
    </div>
  )
}

export default ProfileHeader