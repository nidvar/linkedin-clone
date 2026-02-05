import Layout from './components/layout/Layout'
import { Routes, Route } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import HomePage from './pages/HomePage'
import SignUpPage from './pages/auth/SignUpPage'
import LoginPage from './pages/auth/LoginPage'

import { getRequest } from './utils/utilFunctions'

function App() {
  const query = useQuery({ 
    queryKey: ['authUser'], 
    queryFn: async () => {
      try {
        const authUser = await getRequest('/auth/me');
        return authUser;
      } catch (error) {
        return error;
      }
    }
  });

  if (query.isLoading) return null;

  return (
    <Layout>
      <Routes>
        <Route path='/' element={ query.data?.user? <HomePage /> : <LoginPage />}/>
        <Route path='/signup' element={ query.data?.user? <HomePage /> : <SignUpPage />}/>
        <Route path='/login' element={ query.data?.user? <HomePage /> : <LoginPage />}/>
      </Routes>
    </Layout>
  )
}

export default App
