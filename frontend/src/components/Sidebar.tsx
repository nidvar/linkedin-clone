import { Bell, Home, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { AuthUser } from '../utils/types';

function Sidebar({user} : {user: AuthUser["user"] | null}) {
  if(!user) return null;
  return (
    <div className='sidebar'>
      <div className='sidebar-profile-container relative'>
        <div className='banner absolute'
          style={{
            backgroundImage: `url(${user.bannerImg || 'banner.png'})`,
          }}
        ></div>
        <div className='sidebar-profile'>
          <img src={user.profilePicture || 'avatar.png'} className='sidebar-profile-img'/>
          <h1 className='font-bold text-xl my-2'>{user.fullName}</h1>
          <p>{user.headline}</p>
          <p>{user.connections.length} connections</p>
        </div>
      </div>
      <div className='sidebar-profile-options'>
        <Link to='/' className='flex gap-2'><Home />Home</Link>
        <Link to='/' className='flex gap-2'><User />My Network</Link>
        <Link to='/' className='flex gap-2'><Bell /> Notifications</Link>
      </div>
      <Link to='/'>Visit your profile</Link>
    </div>
  )
}

export default Sidebar