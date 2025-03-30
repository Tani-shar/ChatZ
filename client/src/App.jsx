import { BrowserRouter, Navigate } from "react-router-dom";
import Auth from "@/pages/auth";
import Chat from "@/pages/chat";
import Profile from "@/pages/profile";
import { Route, Routes } from "react-router";
import { useEffect } from "react";
import { useAppStore } from "./store";
import apiClient from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constant";

const PrivateRoute = ({ children }) => {
  const userInfo = useAppStore((state) => state.userInfo);
  return userInfo ? children : <Navigate to="/auth" replace />;
};

const AuthRoute = ({ children }) => {
  const userInfo = useAppStore((state) => state.userInfo);
  return userInfo ? <Navigate to="/chat" replace /> : children;
};

function App() {
  const { userInfo, setUserInfo } = useAppStore();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, { withCredentials: true });
        console.log({ response });
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (!userInfo) {
      getUserData();
    }
  }, [userInfo, setUserInfo]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
