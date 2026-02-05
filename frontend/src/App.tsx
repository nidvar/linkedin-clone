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
      const authUser = await getRequest('/auth/me');
      console.log(authUser);
      return authUser
    }
  });

  return (
    <Layout>
      <Routes>
        <Route path='/' element={ query.data != null? <HomePage /> : <LoginPage />}/>
        <Route path='/signup' element={ query.data != null? <HomePage /> : <SignUpPage />}/>
        <Route path='/login' element={ query.data != null? <HomePage /> : <LoginPage />}/>
      </Routes>
    </Layout>
  )
}

export default App
