import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { io } from './utilities/socketConnection'
import MainVideoPage from './videoComponents/MainVideoPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

const Home = () => <h1>Home Page</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path='/join-video' element={<MainVideoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
