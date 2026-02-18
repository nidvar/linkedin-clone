import { useRef, useState, useEffect, type SubmitEvent } from 'react';
import { Camera, MapPin } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import type { AuthUserType } from '../utils/types';
import { postRequest } from '../utils/utilFunctions';

function ProfileHeader({data, ownProfile} : {data: AuthUserType, ownProfile: boolean}) {

  const queryClient = useQueryClient();
  const navigate = useNavigate()

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editProfile, setEditProfile] = useState(false);
  const [editProfilePic, setEditProfilePic] = useState(false);
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [disabled, setDisabled] = useState(false);

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
      username: string | undefined;
      location: string;
      headline: string;
    }) => {
      return await postRequest('/user/updateheader', body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
      setEditProfile(false);
      navigate('/profile/' + username);
    },
    onError: (error) => {
      console.log(error);
      setErrorMessage(error.message);
    }
  });

  const profilePictureUpdateMutation = useMutation({
    mutationFn: async (body: {
      type: string;
      image: string | undefined | null;
    }) => {
      return await postRequest('/user/updateimage', body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      setEditProfile(false);
      setEditProfilePic(false);
      setDisabled(false);
    }
  });

  const updateImage = async (e: SubmitEvent, type: string)=>{
    e.preventDefault();
    if(imagePreview === null){
      return
    };
    setDisabled(true);
    const body = {
      type: type,
      image: imagePreview,
    };
    profilePictureUpdateMutation.mutate(body);
  }

  const updateHeader = async (e: SubmitEvent) => {
    e.preventDefault();

    const body = {
      username: username,
      location: location,
      headline: occupation
    };

    headerUpdateMutation.mutate(body);
  }

  useEffect(()=>{
    if(data.username != undefined || data.username != null || data.username != ''){
      setUsername(data.username);
      setLocation(data.location);
      setOccupation(data.headline);
    }
  }, [data])

  return (
    <div className='profile-picture-container relative'>
      {
        editProfilePic === true?
          <form className='profile-picture-update-form' onSubmit={function(e){updateImage(e,'profilePic')}}>
            <img 
              src={imagePreview || "blank_profile.jpg"}
              className='profile-image-preview img-fit'
            />
            <input
              className='profile-upload-input'
              disabled={disabled}
              ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange}
            />
            {
              errorMessage != ''?
              <p className='text-red-500 text-sm text-center'>{errorMessage}</p>:null
            }
            <div className='flex gap-1'>
              <button onClick={function(){setEditProfilePic(false); setImagePreview(null);}}>CANCEL</button>
              <button disabled={disabled} type="submit">UPDATE</button>
            </div>
          </form>:
          <>
            <img src={data.profilePicture || 'avatar.png'} className='profile-img-xlarge circle img-fit'/>
            {
              ownProfile?
              <div className='profile-update-button hand-hover'>
                <Camera size={25} onClick={function(){setEditProfilePic(true)}} />
              </div>:null
            }
          </>
      }

      {
        editProfilePic === false?
        <>
          <h1 className='bold text-xl mt-2'>{data.fullName}</h1>
          <p className='text-gray-500 text-sm'>profile: /{data.username}</p>
          <p className='text-gray-500 text-sm'>Occupation: {data.headline}</p>
          <p className='text-gray-500 text-sm'>{data.connections.length} {data.connections.length != 1 ? 'connections' : 'connection'}</p>
          <p className='text-gray-500 text-sm flex items-center gap-1'><MapPin size={14} />Location: {data.location}</p>
          {
            ownProfile?
            <>
              {
                editProfile === false?
                <button className='edit-button' onClick={function(){setEditProfile(true)}}>Edit</button>:null
              }
            </>:null
          }
        </>:null
      }

      {
        editProfile === true?
        <form className='profile-update-form' onSubmit={updateHeader}>
          <input placeholder='Username' value={username} onChange={function(e){setUsername(e.target.value)}} maxLength={20}/>
          <input placeholder='Occupation' value={occupation} onChange={function(e){setOccupation(e.target.value)}} maxLength={20}/>
          <input placeholder='Location' value={location} onChange={function(e){setLocation(e.target.value)}} maxLength={20}/>
          <div className='flex gap-1'>
            <button onClick={function(){setEditProfile(false)}}>CANCEL</button>
            <button type="submit">UPDATE</button>
          </div>
          <p className='text-red-500 text-sm text-center'>{errorMessage}</p>
        </form>:''
      }
    </div>
  )
}

export default ProfileHeader