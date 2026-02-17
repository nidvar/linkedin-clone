import { useRef, useState, type SubmitEvent } from 'react';

import type { AuthUserType } from '../utils/types';
import { MapPin, UserPen } from 'lucide-react';

function ProfileHeader({profileData, userData} : {profileData: AuthUserType, userData: AuthUserType}){

  const [errorMessage, setErrorMessage] = useState('');
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [editProfile, setEditProfile] = useState(false);
  const [editProfilePic, setEditProfilePic] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);


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

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
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
            <img src={profileData.profilePicture || 'avatar.png'} className='profile-img-xlarge circle'/>
            <div className='profile-update-button hand-hover'>
              <UserPen size={20} onClick={function(){setEditProfilePic(true)}} />
            </div>
          </>
      }

      {
        editProfilePic === false?
        <>
          <h1 className='bold text-xl mt-2'>{profileData.fullName}</h1>
          <p className='text-gray-500 text-sm'>{profileData.username}</p>
          <p className='text-gray-500 text-sm'>{profileData.headline}</p>
          <p className='text-gray-500 text-sm'>{profileData.connections.length} {profileData.connections.length != 1 ? 'connections' : 'connection'}</p>
          <p className='text-gray-500 text-sm flex items-center gap-1'><MapPin size={14} />{profileData.location}</p>
          {
            userData._id === profileData._id?
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
        <form className='profile-update-form' onSubmit={handleSubmit}>
          <input placeholder='Username'/>
          <input placeholder='Occupation'/>
          <input placeholder='Location'/>
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