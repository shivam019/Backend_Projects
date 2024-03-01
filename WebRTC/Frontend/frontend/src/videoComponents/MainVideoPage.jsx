import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './VideoComponents.css'
import CallInfo from './CallInfo';
import ChatWindow from './ChatWindow';

const MainVideoPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const [apptInfo, setApptInfo] = useState(null);

  useEffect(() => {
    const fetchDecodedToken = async () => {
      try {
        const response = await axios.post('https://localhost:8070/validate-link', { token });
        setApptInfo(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (token) {
      fetchDecodedToken();
    }
  }, [token]);

  return (
    <div className='main-video-page'>
      <div className='video-chat-wrapper'>
        <video id="large-feed" autoPlay controls playsInline></video>
        <video id="own-feed" autoPlay controls playsInline></video>
  
        {apptInfo ? (
          <CallInfo apptInfo={apptInfo} />
        ) : (
          <h1>Loading...</h1>
        )}
  
        <ChatWindow />
      </div>
    </div>
  );
  
};

export default MainVideoPage;
