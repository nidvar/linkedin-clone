import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postRequest } from '../utils/utilFunctions';
import { useRef, useState, type SubmitEvent } from 'react';
import { Image } from 'lucide-react';

function PostCreation({profile} : {profile: string}) {

   const queryClient = useQueryClient();

  const [post, setPost] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const mutateObj = useMutation({
    mutationFn: async () => {
      const result =  await postRequest('/post/create', {post: post, image: imagePreview});
      if (result.message === 'Post created') { 
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        setPost('');
      }else{
        console.log(result.message);
      }
      return result;
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setImage(file);
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

  const deleteImageUpload = function(){
    setImage(null); 
    setImagePreview(null); 
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    mutateObj.mutate();
  }

  return (
    <div className='post-creation-container'>
      {
        imagePreview !==null?
        <div className='image-preview text-center m-auto'>
          <img src={imagePreview} alt="Preview" className='m-auto'/>
          <button onClick={deleteImageUpload} type='button' className='m-5 bg-red-600'>DELETE</button>
        </div>:''
      }
      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <div className='flex gap-3'>
          <img src={profile} alt="Preview" className='profile-img'/>
          <textarea 
            className='p-2'
            placeholder={'What\'s on your mind?'}
            value={post}
            onChange={(e) => setPost(e.target.value)}>
          </textarea>
        </div>
        <div className='flex justify-between'>
          <label className='flex gap-2 hand-hover'>
            <Image />
            <span>Photo</span>
            <input ref={fileInputRef} className='hidden' type="file" accept="image/*" onChange={handleImageChange}/>
          </label>
          <button type='submit' disabled={mutateObj.isPending}>SHARE</button>
        </div>
      </form>
    </div>
  )
}

export default PostCreation