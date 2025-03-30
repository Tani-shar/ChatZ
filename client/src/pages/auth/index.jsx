import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import apiClient from "@/lib/api-client.js";
import { SIGN_UP_ROUTE, LOGIN_ROUTE } from "../../utils/constant"; // Combined imports
import { useAppStore } from "../../store";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const { setUserInfo } = useAppStore();
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check for existing session on mount
  
  const validateRegister = () => {
    if (!fullName || !email || !password) {
      toast.error("All fields are required.");
      return false;
    }
    if (fullName.length < 3) {
      toast.error("Full name must be at least 3 characters long.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Email address is invalid.");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.post(
        LOGIN_ROUTE,
        { email, password},
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data?.user) {
        setUserInfo(response.data.user);
        toast.success("Login successful!");
        navigate(response.data.user.profileSetup ? "/chat" : "/profile");
      }
      console.log('Full response:', response); 
    } catch (err) {
      console.error('Full error:', err); // Add this
      console.error('Response data:', err.response?.data); // Add this
      setError(err.response?.data?.message || "Login failed. Please try again.");
      toast.error("Login failed. Please check your credentials.");
  
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;
    
    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.post(
        SIGN_UP_ROUTE,
        { fullName, email, password },
        { withCredentials: true }
      );

      if (response.data?.user) {
        // setUserInfo(response.data.user);
        toast.success("Registration successful!");
        // navigate(response.data.user.profileSetup ? "/chat" : "/profile");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/60"></div>
      </div>

      {/* Branding */}
      <div className="fixed top-8 left-8 z-10">
        <h1 className="text-3xl font-light tracking-widest text-gray-300">
          CHATZ
        </h1>
        <div className="h-px w-16 mt-2 bg-amber-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md overflow-hidden border border-gray-800 shadow-xl bg-gray-900/80 backdrop-blur-sm"
        >
          {/* Header */}
          <div className="px-10 pt-10 pb-6 border-b border-gray-800">
            <div className="flex justify-center mb-6">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="40" height="40" rx="4" className="fill-gray-800" />
                <path
                  d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10ZM20 25C17.2386 25 15 22.7614 15 20C15 17.2386 17.2386 15 20 15C22.7614 15 25 17.2386 25 20C25 22.7614 22.7614 25 20 25Z"
                  className="fill-amber-500"
                />
                <path
                  d="M20 15C17.2386 15 15 17.2386 15 20C15 22.7614 17.2386 25 20 25V15Z"
                  className="fill-amber-600"
                />
              </svg>
            </div>

            {/* Tabs */}
            <div className="flex">
              <button
                onClick={() => {
                  setActiveTab("login");
                  setError("");
                }}
                className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                  activeTab === "login"
                    ? "text-amber-400 border-b-2 border-amber-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                SIGN IN
              </button>
              <button
                onClick={() => {
                  setActiveTab("register");
                  setError("");
                }}
                className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                  activeTab === "register"
                    ? "text-amber-400 border-b-2 border-amber-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                CREATE ACCOUNT
              </button>
            </div>
          </div>

          {/* Form Area */}
          <div className="px-10 py-8">
            {error && (
              <div className="mb-6 p-3 text-sm text-red-400 bg-red-900/30 border border-red-800/50 rounded">
                {error}
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === "login" ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeTab === "login" ? 10 : -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {activeTab === "login" ? (
                  <LoginForm
                    email={email}
                    password={password}
                    // remember={remember}
                    isLoading={isLoading}
                    onEmailChange={setEmail}
                    onPasswordChange={setPassword}
                    // onRememberChange={setRemember}
                    onSubmit={handleLogin}
                  />
                ) : (
                  <RegisterForm
                    fullName={fullName}
                    email={email}
                    password={password}
                    isLoading={isLoading}
                    onFullNameChange={setFullName}
                    onEmailChange={setEmail}
                    onPasswordChange={setPassword}
                    onSubmit={handleRegister}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-xs bg-gray-900 text-gray-500">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            {/* Social Auth */}
            <div className="grid grid-cols-3 gap-3">
              {["Google", "Apple", "LinkedIn"].map((provider) => (
                <button
                  key={provider}
                  className="flex items-center justify-center py-2.5 text-sm font-medium transition-colors bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
                  disabled={isLoading}
                >
                  {provider}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 py-4 text-center text-xs text-gray-600 border-t border-gray-800 bg-black/30">
        CHATZ © {new Date().getFullYear()} | PRIVATE COMMUNICATION NETWORK
      </div>
    </div>
  );
};

// Login Form Component
const LoginForm = ({
  email,
  password,
  // remember,
  isLoading,
  onEmailChange,
  onPasswordChange,
  // onRememberChange,
  onSubmit,
}) => {
  const [isRevealPwd, setIsRevealPwd] = useState(false);

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div>
        <label htmlFor="login-email" className="block mb-3 text-xs font-medium tracking-wider uppercase text-gray-500">
          EMAIL ADDRESS
        </label>
        <input
          id="login-email"
          type="email"
          className="w-full px-4 py-3 text-sm bg-gray-800 border border-gray-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 text-gray-200 placeholder-gray-500"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          disabled={isLoading}
          autoComplete="email"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label htmlFor="login-password" className="text-xs font-medium tracking-wider uppercase text-gray-500">
            PASSWORD
          </label>
          <button 
            type="button"
            className="text-xs text-amber-500 hover:text-amber-400 focus:outline-none"
            onClick={() => {/* TODO: Implement forgot password */}}
          >
            FORGOT?
          </button>
        </div>
        <div className="relative">
          <input
            id="login-password"
            type={isRevealPwd ? "text" : "password"}
            className="w-full px-4 py-3 text-sm bg-gray-800 border border-gray-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 text-gray-200 placeholder-gray-500"
            placeholder="••••••••"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
            minLength={8}
            disabled={isLoading}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-sm text-gray-400 hover:text-gray-300 focus:outline-none"
            onClick={() => setIsRevealPwd(!isRevealPwd)}
            disabled={isLoading}
            aria-label={isRevealPwd ? "Hide password" : "Show password"}
          >
            {isRevealPwd ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          className="h-4 w-4 rounded bg-gray-800 border-gray-700 text-amber-500 focus:ring-amber-500/30"
          // checked={remember}
          // onChange={(e) => onRememberChange(e.target.checked)}
          disabled={isLoading}
        />
        <label
          htmlFor="remember-me"
          className="ml-3 block text-sm text-gray-400"
        >
          Remember this device
        </label>
      </div>

      <button
        type="submit"
        className={`w-full py-3.5 px-4 text-sm font-medium transition-colors ${
          isLoading
            ? "bg-amber-700 cursor-not-allowed"
            : "bg-amber-600 hover:bg-amber-500"
        } text-gray-900`}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            PROCESSING...
          </span>
        ) : (
          "ACCESS CHATZ"
        )}
      </button>
    </form>
  );
};

// Register Form Component
const RegisterForm = ({
  fullName,
  email,
  password,
  isLoading,
  onFullNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) => {
  const [isRevealPwd, setIsRevealPwd] = useState(false);

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div>
        <label htmlFor="register-name" className="block mb-3 text-xs font-medium tracking-wider uppercase text-gray-500">
          FULL NAME
        </label>
        <input
          id="register-name"
          type="text"
          className="w-full px-4 py-3 text-sm bg-gray-800 border border-gray-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 text-gray-200 placeholder-gray-500"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          required
          disabled={isLoading}
          autoComplete="name"
        />
      </div>

      <div>
        <label htmlFor="register-email" className="block mb-3 text-xs font-medium tracking-wider uppercase text-gray-500">
          EMAIL ADDRESS
        </label>
        <input
          id="register-email"
          type="email"
          className="w-full px-4 py-3 text-sm bg-gray-800 border border-gray-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 text-gray-200 placeholder-gray-500"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          disabled={isLoading}
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="register-password" className="block mb-3 text-xs font-medium tracking-wider uppercase text-gray-500">
          PASSWORD
        </label>
        <div className="relative">
          <input
            id="register-password"
            type={isRevealPwd ? "text" : "password"}
            className="w-full px-4 py-3 text-sm bg-gray-800 border border-gray-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 text-gray-200 placeholder-gray-500"
            placeholder="••••••••"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
            minLength={8}
            disabled={isLoading}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-sm text-gray-400 hover:text-gray-300 focus:outline-none"
            onClick={() => setIsRevealPwd(!isRevealPwd)}
            disabled={isLoading}
            aria-label={isRevealPwd ? "Hide password" : "Show password"}
          >
            {isRevealPwd ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className={`w-full py-3.5 px-4 text-sm font-medium transition-colors ${
            isLoading
              ? "bg-amber-700 cursor-not-allowed"
              : "bg-amber-600 hover:bg-amber-500"
          } text-gray-900`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              PROCESSING...
            </span>
          ) : (
            "JOIN CHATZ"
          )}
        </button>
      </div>
    </form>
  );
};

export default Auth;