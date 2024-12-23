import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

const DefaultLayout = () => {
  return (
    <>
    <Navbar />
    <Outlet />
    </>
  )
}

export default DefaultLayout