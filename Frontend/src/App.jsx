import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import Login from './components/login.jsx'
import Signup from './components/signup.jsx'
import DashBoard from './pages/dashBoard.jsx'
import DoctorDashBoard from './pages/doctorDashBoard.jsx'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <div>
      <Toaster position='top-center' reverseOrder={false}/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path="/dashBoard" element={<DashBoard />} />
        <Route path='/doctorDashBoard' element={<DoctorDashBoard/>}/>
      </Routes>
    </div>
  )
}

export default App