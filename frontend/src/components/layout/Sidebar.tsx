import { Bell, Home, User } from 'lucide-react'
import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <div className='sidebar'>
      <div className='sidebar-profile-container relative'>
        <div className='banner absolute'></div>
        <div className='sidebar-profile'>
          <img src='avatar.png' className='sidebar-profile-img'/>
          <h1>Name</h1>
          <p>Profession</p>
          <p>Connections</p>
        </div>
      </div>
      <div className='sidebar-profile-options'>
        <Link to='/' className='flex gap-2'><Home /> Home</Link>
        <Link to='/' className='flex gap-2'> <User /> My Network</Link>
        <Link to='/'  className='flex gap-2'><Bell /> Notifications</Link>
      </div>
      <Link to='/'>Visit your profile</Link>
    </div>
  )
}

export default Sidebar