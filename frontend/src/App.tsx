import Layout from './components/layout/Layout'
import { Routes, Route } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import HomePage from './pages/HomePage'
import SignUpPage from './pages/auth/SignUpPage'
import LoginPage from './pages/auth/LoginPage'

import { getRequest } from './utils/utilFunctions'

function App() {

  const data = useQuery({ 
    queryKey: ['authUser'], 
    queryFn: async () => {
      const authUser = await getRequest('/auth/me');
      console.log(authUser);
      return authUser
    }
  });

  console.log(data.data);
  console.log(data);

  return (
    <Layout>
      <Routes>
        <Route path='/' element={ data?.data ? <HomePage /> : <LoginPage />}/>
        <Route path='/signup' element={ data?.data ? <HomePage /> : <SignUpPage />}/>
        <Route path='/login' element={ data?.data ? <HomePage /> : <LoginPage />}/>
      </Routes>
    </Layout>
  )
}

export default App
