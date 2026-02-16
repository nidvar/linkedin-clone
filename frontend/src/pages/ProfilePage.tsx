import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useRef, useState, type SubmitEvent } from 'react';

import { fetchUser, getRequest, postRequest } from '../utils/utilFunctions';
import { MapPin } from 'lucide-react';
import ProfileSections from '../components/ProfileSections';

function ProfilePage() {

  const { username } = useParams();
  const queryClient = useQueryClient();

  const [editProfile, setEditProfile] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [about, setAbout] = useState('');
  const [location, setLocation] = useState('');

  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const grabData = function(arg: any, type: string){
    if(type === 'about'){
      console.log(arg);
    }
  }

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

  // const updateProfileMutation = useMutation({
  //   mutationFn: async () => {
  //     await postRequest('/user/update', {body: body});
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['profile', username] });
  //   }
  // });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    // updateProfileMutation.mutate();
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
            <>
              {
                editProfile === true?
                <button onClick={function(){setEditProfile(false)}}>CANCEL</button>:
                <button onClick={function(){setEditProfile(true)}}>EDIT</button>
              }
            </>:''
          }
        </div>

        {
          editProfile === true?
          <form className='profile-update-form' onSubmit={handleSubmit}>
            <img 
                src={imagePreview || "blank_profile.jpg"}
                className='image-upload-input'
            />
            <input
              ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange}
            />
            {
              errorMessage != ''?
              <p className='text-red-500 text-sm text-center'>{errorMessage}</p>:null
            }
            <input placeholder='Occupation'/>
            <input placeholder='Location'/>
            <div className='flex gap-1'>
              <button type="submit">UPDATE</button>
            </div>
          </form>:''
        }
      </div>

      <ProfileSections section='About' profileData={profileData.data} canUpdate={userData.data._id === profileData.data._id} />
      <ProfileSections section='Experiences' profileData={profileData.data} canUpdate={userData.data._id === profileData.data._id} />
      <ProfileSections section='Education' profileData={profileData.data} canUpdate={userData.data._id === profileData.data._id} />
      <ProfileSections section='Skills' profileData={profileData.data} canUpdate={userData.data._id === profileData.data._id} />

    </div>
  )
}

export default ProfilePage