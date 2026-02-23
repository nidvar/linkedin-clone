import { useRef, useState, useEffect, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Camera, MapPin } from 'lucide-react';

import type { AuthUserType, ConnectionRequestType, sentRequestType } from '../utils/types';
import { getRequest, postRequest } from '../utils/utilFunctions';

function ProfileHeader({data, ownProfile, currentUser, opacity} : {data: AuthUserType, ownProfile: boolean, currentUser: AuthUserType, opacity: boolean}) {

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editProfile, setEditProfile] = useState(false);
  const [editProfilePic, setEditProfilePic] = useState(false);
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [disabled, setDisabled] = useState(false);

  const [connectionStatus, setConnectionStatus] = useState('');

  const recievedRequests = useQuery({
    queryKey: ['requests', currentUser._id],
    queryFn: async () => {
      const data = await getRequest('/connections/requests');
      return data.connectionRequests;
    },
    enabled: currentUser !== null,
  });

  const sentRequests = useQuery({
    queryKey: ['sentRequests', currentUser._id],
    enabled: !!currentUser,
    queryFn: async () => {
      const data = await getRequest('/connections/sentrequests');
      return data.sentRequests;
    },
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

  const sendRequestMutation = useMutation({
    mutationFn: async (arg: string) => {
      await postRequest('/connections/sendRequest/' + arg, {});
    },
    onSuccess: ()=>{
      console.log('sent request');
      queryClient.invalidateQueries({ queryKey: ['sentRequests', currentUser._id] });
      queryClient.refetchQueries({ queryKey: ['sentRequests', currentUser._id] });
    },
    onError: (error)=>{
      console.log(error);
    }
  });

  const deleteConnectionMutation = useMutation({
    mutationFn: async (arg: string) => {
      await postRequest('/connections/removeconnection/' + arg, {}, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', data.username] });
      queryClient.invalidateQueries({ queryKey: ['connections', currentUser._id] });
      queryClient.refetchQueries({ queryKey: ['connections', currentUser._id] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async (arg: string) => {
      await postRequest('/connections/reject/' + arg, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests', currentUser._id] });
      queryClient.invalidateQueries({ queryKey: ['connections', currentUser._id] });
    }
  });

  const cancelRequestMutation = useMutation({
    mutationFn: async (arg: string) => {
      await postRequest('/connections/cancel/' + arg, {}, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sentRequests', currentUser._id] });
      queryClient.refetchQueries({ queryKey: ['sentRequests', currentUser._id] });
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

  const recievedCheck = function(){
    if(recievedRequests.data && recievedRequests.data.length > 0){
      return recievedRequests.data.some((item: ConnectionRequestType) => {
        return (item.sender._id === data._id)
      });
    };
  }

  const sentCheck = function(){
    if(sentRequests.data && sentRequests.data.length > 0){
      return sentRequests.data.some((item: sentRequestType) => {
        return (item.recipient._id === data._id)
      })
    };
  }

  const connectedCheck = function(){
    if(data.connections.includes(currentUser._id)){
      return true
    }else{
      return false
    }
  }

  const displayButtons = function(){
    if(connectedCheck() === true){
      return <button className='px-4' disabled={deleteConnectionMutation.isPending} onClick={function(){deleteConnectionMutation.mutate(data._id);}}>Remove Connection</button>
    }
    if(sentCheck() === true){
      return <button className='px-4' disabled={cancelRequestMutation.isPending} onClick={function(){cancelRequestMutation.mutate(data._id);}}>Cancel Request</button>
    }
    if(recievedCheck() === true){
      return <button className='px-4' disabled={rejectMutation.isPending} onClick={function(){rejectMutation.mutate(data._id);}}>Reject Request</button>
    }
    if(connectedCheck() === false){
      return <button className='px-4' disabled={sendRequestMutation.isPending} onClick={function(){sendRequestMutation.mutate(data._id);}}>Connect</button>
    }
  }

  useEffect(()=>{
    if(data.username){
      setUsername(data.username);
      setLocation(data.location);
      setOccupation(data.headline);
    }
  }, [data]);

  return (
    <div className={
      'profile-picture-container relative ' +
      (opacity ? 'uploading-banner' : '')
    }>
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
          <h1 className='page-title'>{data.fullName}</h1>
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
            </>:<div className='medium-width-button-container'>{displayButtons()}</div>
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