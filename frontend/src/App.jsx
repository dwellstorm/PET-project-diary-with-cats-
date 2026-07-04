import React, { useEffect, useState } from 'react';
import axios from  'axios'
import CatCard from './components/CatCard.jsx';
import MainPage from './components/MainPage.jsx';
import ChangeProfile from './components/ChangeProfile.jsx';
import NavigationBar from './components/NavigationBar.jsx';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import EditCatCard from './components/EditCatCard.jsx';
import MyProfile from './components/MyProfile.jsx';
import Login from './components/Login.jsx';
import Registration from './components/Registration.jsx';
function App() {

    return (
      <>
      
      <BrowserRouter>
        <NavigationBar />
          <Routes>
            <Route path='/' element={<MainPage />} />
            <Route path='/cat-card' element={<CatCard />} />
            <Route path='/entries/card/:entry_id' element={< EditCatCard/>}/>
            <Route path='/my-profile' element={< MyProfile/>}/>
            <Route path='/login' element={<Login />} />
            <Route path='/registration-page' element={<Registration />} />
            <Route path='/change-profile' element={<ChangeProfile />} />

          </Routes>
      </BrowserRouter>
      </>

    )
}

export default App;