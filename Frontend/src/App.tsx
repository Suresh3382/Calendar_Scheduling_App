import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/LoginSignUp/Login";
import Signup from "./Components/LoginSignUp/Signup";
import ProtectedRoute from "./Routes/ProtectedRoute";
import Layout from "./Components/Layout/Layout";
import { UContext } from "./Utils/Context";
import type { EventInterface } from "./Components/Home/EventInterface";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { ISignUpInterface } from "./Components/LoginSignUp/LoginSignUpInterface";
import { callApi } from "./Utils/AxiosConifg";
import { baseURL } from "./baseURL";
import type { View } from "react-big-calendar";
import { Toaster } from "react-hot-toast";
import ProfilePage from "./Components/Profile/ProfilePage";

const App = () => {
  const [userEvents, setUserEvents] = useState<EventInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshEvents, setRefreshEvents] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<EventInterface | null>(null);
  const [currentUser, setCurrentUser] = useState<ISignUpInterface | null>(null);
  const [loggedUser, setLoggedUser] = useState<ISignUpInterface | null>(null);
  const [email, setEmail] = useState<string>("");
  const [view, setView] = useState<View>("month");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [loader, setLoader] = useState<boolean>(false);
  const [searchedTerm, setSearchedTerm] = useState<string>("");

  const userId = localStorage.getItem("userId");
  const AccessToken = localStorage.getItem("AccessToken");

  useEffect(() => {
    callApi({
      requestEndpoint: `${baseURL}user/getloggeduser`,
      method: "get",
    })
      .then((res) => {
        console.log(res.data.response);
        setLoggedUser(res.data.response);
      })
      .catch((err) => {
        console.log("error :", err);
      });
  }, [userId, AccessToken]);

  const Token = localStorage.getItem("Token");

  return (
    <UContext.Provider
      value={{
        userEvents,
        setUserEvents,
        loading,
        setLoading,
        date,
        setDate,
        isModalOpen,
        setIsModalOpen,
        refreshEvents,
        setRefreshEvents,
        currentEvent,
        setCurrentEvent,
        currentUser,
        setCurrentUser,
        loggedUser,
        setLoggedUser,
        view,
        setView,
        calendarDate,
        setCalendarDate,
        loader,
        setLoader,
        email,
        setEmail,
        searchedTerm,
        setSearchedTerm,
      }}
    >
      <Routes>
        <Route
          path="/login"
          element={!Token ? <Login /> : <Navigate to="/" />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </UContext.Provider>
  );
};

export default App;
