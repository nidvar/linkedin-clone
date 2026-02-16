import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { fetchUser, getRequest } from '../utils/utilFunctions';
import { MapPin } from 'lucide-react';
import ProfileSections from '../components/ProfileSections';

function ProfilePage() {

  const { username } = useParams();

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
          <h1 className='bold text-xl'>{profileData.data.fullName}</h1>
          <p className='text-gray-500 text-sm'>{profileData.data.headline}</p>
          <p className='text-gray-500 text-sm'>{profileData.data.connections.length} {profileData.data.connections.length > 1 ? 'connections' : 'connection'}</p>
          <p className='text-gray-500 text-sm flex items-center gap-1'><MapPin size={14} />Location</p>
        </div>
        <div className='edit-button-container'>
          {
            userData.data._id === profileData.data._id &&
            <button>EDIT PROFILE</button>
          }
        </div>
      </div>

      <ProfileSections section='About' profileData={profileData.data} canUpdate={userData.data._id === profileData.data._id}/>
      <ProfileSections section='Experiences' profileData={profileData.data} canUpdate={userData.data._id === profileData.data._id}/>
      <ProfileSections section='Education' profileData={profileData.data} canUpdate={userData.data._id === profileData.data._id}/>
      <ProfileSections section='Skills' profileData={profileData.data} canUpdate={userData.data._id === profileData.data._id}/>

    </div>
  )
}

export default ProfilePage