import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

import { fetchUser, getRequest } from '../utils/utilFunctions';
import { MapPin } from 'lucide-react';
import ProfileSections from '../components/ProfileSections';

function ProfilePage() {

  const { username } = useParams();

  const [editProfile, setEditProfile] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [profilePic, setProfilePic] = useState('');

  const userData = useQuery({ 
    queryKey: ['authUser'], 
    queryFn: fetchUser
  });

  const profileData = useQuery({ 
    queryKey: ['profile', username], 
    queryFn: async () => {
      const profileData = await getRequest('/user/profile/' + username);
      const user = profileData.user;
      return user;
    }
  });

  const handleProfileUpload = function(e: React.ChangeEvent<HTMLInputElement>){
    setErrorMessage('');
    if(e.target.files && e.target.files[0]){
      if(e.target.files[0].size > 1500000){
        setErrorMessage('Image must be under 1.5MB');
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = async ()=>{
        const base64Image = reader.result;
        if(typeof base64Image === 'string'){
            setProfilePic(base64Image);
        }
      }
    };
  }

  if(profileData.data === undefined) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <div className='profile-header shaded-border relative'>
        <div className='profile-banner'
          style={{
            backgroundImage: `url(${profileData.data.bannerImg || '/banner.png'})`,
          }}
        ></div>
        <div className='profile-picture-container'>
          <img src={profileData.data.profilePicture || 'avatar.png'} className='profile-img-xlarge circle'/>
          <h1 className='bold text-xl mt-2'>{profileData.data.fullName}</h1>
          <p className='text-gray-500 text-sm'>{profileData.data.headline}</p>
          <p className='text-gray-500 text-sm'>{profileData.data.connections.length} {profileData.data.connections.length != 1 ? 'connections' : 'connection'}</p>
          <p className='text-gray-500 text-sm flex items-center gap-1'><MapPin size={14} />Location</p>
        </div>
        <div className='edit-button-container'>
          {
            userData.data._id === profileData.data._id?
            <button onClick={function(){setEditProfile(true)}}>EDIT PROFILE</button>:''
          }
        </div>

        {
          editProfile === true?
          <form className='profile-update-form'>
            <img 
                src={profilePic || "blank_profile.jpg"}
                className='image-upload-input'
            />
            <input
              id='profile-image'
              type='file'
              onChange={handleProfileUpload}
            />
            {errorMessage}
            <input placeholder='Headline'/>
            <input placeholder='Location'/>
            <div className='flex gap-1'>
              <button type="button" onClick={function(){setEditProfile(false)}}>CANCEL</button>
              <button type="submit">UPDATE</button>
            </div>
          </form>:''
        }
      </div>

      <ProfileSections section='About' profileData={profileData.data} canUpdate={userData.data._id === profileData.data._id}/>
      <ProfileSections section='Experiences' profileData={profileData.data} canUpdate={userData.data._id === profileData.data._id}/>
      <ProfileSections section='Education' profileData={profileData.data} canUpdate={userData.data._id === profileData.data._id}/>
      <ProfileSections section='Skills' profileData={profileData.data} canUpdate={userData.data._id === profileData.data._id}/>

    </div>
  )
}

export default ProfilePage