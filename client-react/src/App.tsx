import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Menubar from './components/Menubar'
import Navabar from './components/Navabar'
import Login from './pages/Login'
import Video from './pages/Video'
import { useAppSelector } from './store/hooks'
import UploadVideo from './pages/UploadVideo'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Search from './pages/Search'


const App: React.FC = () => {
  const {mode} = useAppSelector(state=>state.mode)
  return (
    <BrowserRouter>
      <div className={`flex ${mode?"bg-white":"bg-black"}`}>
        <Menubar />
        <div className="flex-7">
          <Navabar />
          <Routes>
            <Route path="/">
              <Route index element={<Home type="random"/>} />
              <Route path='trends' element={<Home type="trend"/>} />
              <Route path='subcriptions' element={<Home  type="sub"/>} />
              <Route path='libary' element={<Home  type="save"/>} />
              <Route path='login' element={<Login />} />
              <Route path='register' element = {<Signup />} />
              <Route path="profile" element = {<Profile />} />
              <Route path='search' element = {<Search/>} />
              <Route path="video">
                <Route path=":id" element={<Video />} />
              </Route>
              <Route path='addVideo' element={<UploadVideo /> } />
            </Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
