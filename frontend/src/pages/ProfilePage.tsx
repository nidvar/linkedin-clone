import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { fetchUser, getRequest } from '../utils/utilFunctions';
import ProfileHeader from '../components/ProfileHeader';
import AboutSection from '../components/AboutSection';
import ExperienceSection from '../components/ExperienceSection';
import EducationSection from '../components/EducationSection';
import SkillSection from '../components/SkillSection';

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
      console.log(user);
      return user;
    }
  });

  // const updateProfileMutation = useMutation({
  //   mutationFn: async () => {
  //     await postRequest('/user/update', {body: body});
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['profile', username] });
  //   }
  // });

  if(profileData.data === undefined) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <div className='profile-header shaded-border relative'>
        <div className='profile-banner'
          style={{
            backgroundImage: `url(${profileData.data.bannerImg || '/banner.png'})`,
          }}
        ></div>
        <ProfileHeader profileData={profileData.data} userData={userData.data} ownProfile={userData.data._id === profileData.data._id}/>
      </div>

      <AboutSection profileData={profileData.data} ownProfile={userData.data._id === profileData.data._id} />
      <ExperienceSection profileData={profileData.data} ownProfile={userData.data._id === profileData.data._id} />
      <EducationSection profileData={profileData.data} ownProfile={userData.data._id === profileData.data._id} />
      <SkillSection profileData={profileData.data} ownProfile={userData.data._id === profileData.data._id} />

    </div>
  )
}

export default ProfilePage;