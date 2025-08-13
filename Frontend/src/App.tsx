import React, { useEffect } from "react";
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

const App = () => {
  const [userEvents, setUserEvents] = React.useState<EventInterface[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [date, setDate] = React.useState<Dayjs>(dayjs());
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [refreshEvents, setRefreshEvents] = React.useState(false);
  const [currentEvent, setCurrentEvent] = React.useState<EventInterface | null>(
    null
  );
  const [currentUser, setCurrentUser] = React.useState<ISignUpInterface | null>(
    null
  );
  const [loggedUser, setLoggedUser] = React.useState<ISignUpInterface | null>(
    null
  );

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
      </Routes>
    </UContext.Provider>
  );
};

export default App;
