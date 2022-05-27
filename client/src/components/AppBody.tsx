import React from 'react'
import Header from './Header'
import Footer from './Footer'
import '../styling/AppBody.scss'
import { useAuth } from '../contexts/AuthContext'

const AppBody = ({children} : appBodyProps) => {
  const { currentUser } = useAuth();

  return (
    <div className={currentUser ? "AppBody" : "AppBody noFooter"}>
      <Header/>
      <div className='wrapper'>
        {children}
      </div>
      { currentUser && <Footer/> }
    </div>
  )
}

export default AppBody

interface appBodyProps {
  // currentUser?: User, 
  children: JSX.Element | JSX.Element[]
}