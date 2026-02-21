import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';

import ProfileHeader from '../components/ProfileHeader';
import AboutSection from '../components/AboutSection';
import ExperienceSection from '../components/ExperienceSection';
import EducationSection from '../components/EducationSection';
import SkillSection from '../components/SkillSection';

import { fetchUser, getRequest } from '../utils/utilFunctions';

function ProfilePage() {

  const { username } = useParams();
  const navigate = useNavigate();

  const userData = useQuery({ 
    queryKey: ['authUser'], 
    queryFn: fetchUser
  });

  const profileData = useQuery({
    queryKey: ['profile', username],
    queryFn: async () => {
      const res = await getRequest('/user/profile/' + username);
      return res.user;
    },
    enabled: !!username,
  });

  if(profileData.error) {
    navigate('/')
  };

  if(profileData.data === undefined) return <div className='text-center'>Loading...</div>;

  return (
    <div className="profile-page">
      <div className='profile-header shaded-border relative'>
        <div className='profile-banner'
          style={{
            backgroundImage: `url(${profileData.data.bannerImg || '/banner.png'})`,
          }}
        ></div>
        <ProfileHeader data={profileData.data} ownProfile={userData.data._id === profileData.data._id}/>
      </div>

      <AboutSection data={profileData.data} ownProfile={userData.data._id === profileData.data._id} />
      <ExperienceSection data={profileData.data} ownProfile={userData.data._id === profileData.data._id} />
      <EducationSection data={profileData.data} ownProfile={userData.data._id === profileData.data._id} />
      <SkillSection data={profileData.data} ownProfile={userData.data._id === profileData.data._id} />

    </div>
  )
}

export default ProfilePage;