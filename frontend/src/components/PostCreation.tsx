import { useMutation } from '@tanstack/react-query'
import { postRequest } from '../utils/utilFunctions';
import { useState, type SubmitEvent } from 'react';

function PostCreation({profile} : {profile: string}) {

  const [post, setPost] = useState({});
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const mutateObj = useMutation({
    mutationFn: async () => {
      const result =  await postRequest('/post/create', {content: post, image: image});
      if (result.success === true) { 
        console.log('post success')
      }else{
        console.log(result.message);
      }
      return result;
    }
  });

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files[0];
  //   setImage(file);
  //   if (file) {
  //     readFileAsDataURL(file).then(setImagePreview);
  //   } else {
  //     setImagePreview(null);
  //   }
  // };

  // const readFileAsDataURL = (file: File): Promise<string | ArrayBuffer | null> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => resolve(reader.result);
  //     reader.onerror = reject;
  //     reader.readAsDataURL(file);
  //   });
  // };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    mutateObj.mutate();
  }

  return (
    <div className='post-creation-container'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <div className='flex gap-3'>
          <img src={profile} alt="Preview" className='profile-img'/>
          <textarea 
            className='p-2'
            placeholder={'What\'s on your mind?'} 
            onChange={(e) => setPost({content: e.target.value})}>
          </textarea>
        </div>
        <div className='flex justify-between'>
          <p>upload image</p>
          <button type='submit'>SHARE</button>
        </div>
      </form>
    </div>
  )
}

export default PostCreation