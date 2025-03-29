import { Button } from "@/components/ui/button"
import { BrowserRouter, Navigate} from "react-router-dom"
import  Auth  from "@/pages/auth";
import Chat  from "@/pages/chat";
import Profile  from "@/pages/profile";
import { Route, Routes } from "react-router"
import { useAppStore } from "./store";
import { useEffect } from "react";
import apiClient from "./lib/api-client";
// import ErrorBoundary from "@/components/ErrorBoundary"; // Adjust the path as needed

const PrivateRoute = ({ children }) => {
  const userInfo = useAppStore((state) => state.userInfo);
  return userInfo ? children : <Navigate to="/auth" replace />;
};

const AuthRoute = ({ children }) => {
  const userInfo = useAppStore((state) => state.userInfo);
  return userInfo ? <Navigate to="/chat" replace /> : children;
};

function App() {
  
   
  return (
    
    // <ErrorBoundary fallback={<ErrorPage />}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
          <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    // </ErrorBoundary>
  )
}

export default App
