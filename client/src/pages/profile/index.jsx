import React, { useState, useRef } from 'react';
import { FaUser, FaCamera, FaCheck, FaGoogle, FaApple, FaLinkedin } from 'react-icons/fa';
import { UPDATE_PROFILE_ROUTE } from '../../utils/constant';
import apiClient from '../../lib/api-client';
const ChatZProfilePage = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ profileImage, firstName, lastName });

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try{
        const response = await apiClient.post(UPDATE_PROFILE_ROUTE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            // withCredentials: true,
        });
        const result = await response.data;
        console.log(result);
    }
    catch(error){
        console.error("Error uploading profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#050603] flex items-center justify-center p-4 font-sans">
      <div className="bg-[#0F1521] rounded-lg shadow-md overflow-hidden w-full max-w-md border border-gray-200">
        {/* Header */}
        <div className="bg-[#0F1521] p-6 text-center">
          <h1 className="text-3xl font-bold text-[#E17100] mb-2">CHATZ</h1>
          <p className="text-gray-300 uppercase tracking-wider text-sm">COMPLETE YOUR PROFILE</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Profile Picture Upload */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-[#0F1521] flex items-center justify-center overflow-hidden border-4 border-[#E17100] shadow-md">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-gray-400 text-4xl" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-[#E17100] text-white p-2 rounded-full shadow-sm"
              >
                <FaCamera className="text-sm" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Name Fields */}
          <div className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-[#E17100] mb-1 uppercase tracking-wider">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 rounded border border-gray-300 focus:ring-2 focus:ring-[#E17100] focus:border-[#E17100] outline-none transition"
                placeholder="Enter your first name"
                required
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-[#E17100] mb-1 uppercase tracking-wider">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 rounded border border-gray-300 focus:ring-2 focus:ring-[#E17100] focus:border-[#E17100] outline-none transition"
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#E17100] hover:bg-[#E17100] text-white font-medium py-3 px-4 rounded shadow-sm transition duration-300 uppercase tracking-wider"
          >
            Save Profile
          </button>

          {/* Divider */}
          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 uppercase">or</span>
            </div>
          </div> */}

          {/* Social Login Options */}
          {/* <div className="flex justify-center space-x-4">
            <button
              type="button"
              className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              <FaGoogle className="text-gray-600" />
            </button>
            <button
              type="button"
              className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              <FaApple className="text-gray-600" />
            </button>
            <button
              type="button"
              className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              <FaLinkedin className="text-gray-600" />
            </button>
          </div> */}
        </form>

        {/* Footer */}
        <div className="bg-[#F1521] p-4 text-center text-xs text-gray-100">
          <p>CHATZ © 2025 | PRIVATE COMMUNICATION NETWORK</p>
        </div>
      </div>
    </div>
  );
};

export default ChatZProfilePage;