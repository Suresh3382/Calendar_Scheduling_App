import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Components/LoginSignUp/Login";
import Signup from "./Components/LoginSignUp/Signup";
import Home from "./Components/Home/Home";
import ProtectedRoute from "./Routes/ProtectedRoute";
import Layout from "./Components/Layout/Layout";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
       <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
