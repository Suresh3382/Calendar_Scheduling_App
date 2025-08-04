import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Components/LoginSignUp/Login';
import Signup from './Components/LoginSignUp/Signup';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default App;
