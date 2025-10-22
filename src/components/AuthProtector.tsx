import React from 'react'
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
type props = {children:React.ReactNode;}
const AuthProtector = ({children}:props) => {
  const {user , loading} = useAuth();
  if(loading) return 
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  if(user) return <Navigate to={'/'} replace/>;
  return (
    <div>
      {children}
    </div>
  )
}

export default AuthProtector