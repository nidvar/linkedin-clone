import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { getRequest } from '../utils/utilFunctions';

function ProfilePage() {

  const { username } = useParams();

  const profileData = useQuery({ 
    queryKey: ['profile', username], 
    queryFn: async () => {
      const profileData = await getRequest('/user/profile/' + username);
      const user = profileData.user;
      return user;
    }
  });

  console.log(profileData.data);

  return (
    <div className="profile-page">
      <h1>Profile Page</h1>
      <div className='profile-header shaded-border'>
        <div className='profile-banner absolute'
          style={{
            backgroundImage: `url(${profileData.data.bannerImg || 'banner.png'})`,
          }}
        ></div>
        <div className='profile-picture'>
          <img src={profileData.data.profilePicture || 'avatar.png'} className='profile-img-large'/>
          <h1 className='bold text-xl'>{profileData.data.fullName}</h1>
          <p>{profileData.data.headline}</p>
          <p>{profileData.data.connections.length} connections</p>
          <p>Location</p>
        </div>
        <button>EDIT PROFILE</button>
      </div>


      <div className='profile-section shaded-border'>
        <h1>About</h1>
      </div>

      <div className='profile-section shaded-border'>
        <h1>Experience</h1>
      </div>

      <div className='profile-section shaded-border'>
        <h1>Education</h1>
      </div>

      <div className='profile-section shaded-border'>
        <h1>Skills</h1>
      </div>


    </div>
  )
}

export default ProfilePage