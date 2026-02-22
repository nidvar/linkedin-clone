import { Link } from 'react-router-dom'

import { Bell, Home, User } from 'lucide-react'

import type { AuthUserType } from '../utils/types';

function Sidebar({user} : {user: AuthUserType | null}) {
  if(!user) return null;
  return (
    <div className='sidebar shaded-border'>
      <div className='sidebar-profile-container relative'>
        <div className='banner absolute'
          style={{
            backgroundImage: `url(${user.bannerImg || '/banner.png'})`,
          }}
        ></div>
        <div className='sidebar-profile'>
          <Link to={'/profile/' + user.username} className='sidebar-profile-img circle'>
            <img src={user.profilePicture || 'avatar.png'} className='sidebar-profile-img circle img-fit'/>
          </Link>
          <Link to={'/profile/' + user.username} className='font-bold text-xl mt-2'>{user.fullName}</Link>
          <p className='text-gray-600'>{user.headline}</p>
          <p className='text-xs text-gray-600'>{user.connections.length} connections</p>
        </div>
      </div>
      <div className='sidebar-profile-options'>
        <Link to='/' className='flex gap-2'><Home />Home</Link>
        <Link to='/' className='flex gap-2'><User />My Network</Link>
        <Link to='/' className='flex gap-2'><Bell /> Notifications</Link>
      </div>
      <Link to={'/profile/' + user.username} className='font-semibold'>Visit your profile</Link>
    </div>
  )
}

export default Sidebar