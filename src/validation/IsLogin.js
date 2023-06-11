import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuth } from '../contexts/UserContext';
import LayoutMain from '../layouts/LayoutMain';

const IsLogin = ({ children }) => {
  const { user } = UserAuth();
  if (!user) {
    return <Navigate to='/' />;
  }else {
    return <LayoutMain>{children}</LayoutMain>;
  }
  
  
};

export default IsLogin;
