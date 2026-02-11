import Layout from './components/layout/Layout'
import { Routes, Route } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import HomePage from './pages/HomePage'
import SignUpPage from './pages/auth/SignUpPage'
import LoginPage from './pages/auth/LoginPage'
import NetworkPage from './pages/NetworkPage'

import { getRequest } from './utils/utilFunctions'
import NotificationPage from './pages/NotificationPage'

function App() {
  const userData = useQuery({ 
    queryKey: ['authUser'], 
    queryFn: async () => {
      try {
        const authUser = await getRequest('/auth/me');
        const user = authUser.user;
        return user;
      } catch (error) {
        return null;
      }
    }
  });

  if (userData.isLoading) return null;

  return (
    <Layout>
      <Routes>
        <Route path='/' element={ userData.data? <HomePage /> : <LoginPage />}/>
        <Route path='/signup' element={ userData.data? <HomePage /> : <SignUpPage />}/>
        <Route path='/login' element={ userData.data? <HomePage /> : <LoginPage />}/>
        <Route path='/network' element={ userData.data? <NetworkPage /> : <LoginPage />}/>
        <Route path='/notifications' element={ userData.data? <NotificationPage /> : <LoginPage />}/>
      </Routes>
    </Layout>
  )
}

export default App
