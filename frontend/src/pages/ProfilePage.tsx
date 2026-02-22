import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Camera } from 'lucide-react';

import ProfileHeader from '../components/ProfileHeader';
import AboutSection from '../components/AboutSection';
import ExperienceSection from '../components/ExperienceSection';
import EducationSection from '../components/EducationSection';
import SkillSection from '../components/SkillSection';

import { fetchUser, getRequest, postRequest } from '../utils/utilFunctions';

function ProfilePage() {

  const { username } = useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [editBannerPic, setEditBannerPic] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      setEditBannerPic(false);
      setDisabled(false);
    }
  });

  if(profileData.error) {
    navigate('/')
  };

  if(profileData.data === undefined) return <div className='text-center'>Loading...</div>;

  return (
    <div className="profile-page">
      <div className='profile-header shaded-border relative'>
        {
          editBannerPic?
          <div className='profile-banner'>
            <img src={imagePreview || '/banner.png'} className='banner-image-placeholder'/>
            {
              userData.data._id === profileData.data._id?
              <div className='banner-update-button hand-hover'>
                <Camera size={25} onClick={function(){setEditBannerPic(true);}} />
              </div>:null
            }
          </div>:
          <div className='profile-banner'>
            <img src={profileData.data.bannerImg || '/banner.png'} className='banner-image'/>
            {
              userData.data._id === profileData.data._id?
              <div className='banner-update-button hand-hover'>
                <Camera size={25} onClick={function(){setEditBannerPic(true);}} />
              </div>:null
            }
          </div>
        }
        {
          editBannerPic?
          <div className='shaded-border banner-upload-box'>
            <input
              className='profile-upload-input'
              disabled={disabled}
              ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange}
            />
            <div className='flex gap-3'>
              <button onClick={function(){setEditBannerPic(false); setDisabled(false);}}>Cancel</button>
              <button onClick={function(){profilePictureUpdateMutation.mutate({type: 'banner', image: imagePreview})}}>Update</button>
            </div>
          </div>:null
        }
        <ProfileHeader data={profileData.data} ownProfile={userData.data._id === profileData.data._id} currentUser={userData.data} opacity={editBannerPic} />
      </div>

      <AboutSection data={profileData.data} ownProfile={userData.data._id === profileData.data._id} />
      <ExperienceSection data={profileData.data} ownProfile={userData.data._id === profileData.data._id} />
      <EducationSection data={profileData.data} ownProfile={userData.data._id === profileData.data._id} />
      <SkillSection data={profileData.data} ownProfile={userData.data._id === profileData.data._id} />
    </div>
  )
}

export default ProfilePage;