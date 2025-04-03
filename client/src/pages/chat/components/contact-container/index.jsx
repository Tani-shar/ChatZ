import { FiSearch, FiUserPlus, FiMoreVertical } from "react-icons/fi";
import { BsFilter, BsPower } from "react-icons/bs";
import { RiMessage2Line } from "react-icons/ri";
import { useState } from "react";
import { LOGOUT_ROUTE, SEARCH_CONTACTS } from "../../../../utils/constant";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../../lib/api-client.js";
import { useAppStore } from "../../../../store/index.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const ContactContainer = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [openNewChat, setOpenNewChat] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const {setSelectedChatType, setSelectedChatData} = useAppStore();


  const handleLogout = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUserInfo(null);
        navigate("/auth");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const selectNewContact = (contact) => {
      setOpenNewChat(false);
      setSelectedChatType("contact");
      setSelectedChatData(contact);
      setSearchedContacts([]);
  }

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.trim().length > 0) {
        const res = await apiClient.post(
          SEARCH_CONTACTS,
          { searchTerm },
          { withCredentials: true }
        );
        if (res.status === 200 && res.data.contacts) {
          setSearchedContacts(res.data.contacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.error("Error searching contacts:", error);
    }
  };

  return (
    <div className="relative w-full md:w-[35vw] lg:w-[30vw] xl:w-[25vw] bg-[#111319] border-r border-r-[#252632] h-screen overflow-y-auto flex flex-col">
      <div className="sticky top-0 z-10 bg-[#1a1b26] p-4 border-b border-[#252632]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-white">Chats</h1>
          <div className="flex space-x-4 text-[#a0a3b1]">
            <button className="hover:text-white transition-colors">
              <FiUserPlus size={20} />
            </button>
            <button className="hover:text-white transition-colors" onClick={handleLogout}>
              <BsPower size={20} />
            </button>
            <button className="hover:text-white transition-colors">
              <FiMoreVertical size={20} />
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-500" />
          </div>
          <input
            type="text"
            className="w-full bg-[#252632] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3a3b4c] placeholder-gray-500"
            placeholder="Search or start new chat"
            onChange={(e) => searchContacts(e.target.value)}
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white">
            <BsFilter size={20} />
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 p-4 flex justify-between items-center">
        <button className="flex items-center text-[#a0a3b1] hover:text-white transition-colors">
          <RiMessage2Line size={20} className="mr-2" onClick={() => setOpenNewChat(true)} />
          New
        </button>
        <Dialog open={openNewChat} onOpenChange={setOpenNewChat}>
          <DialogTrigger></DialogTrigger>
          <DialogContent className="bg-[#1e1f2a] border-none text-white w-[450px] h-[350px] flex flex-col">
            <DialogHeader>
              <DialogTitle>Please select a contact</DialogTitle>
            </DialogHeader>
            <div>
              <Input
                placeholder="Search contacts"
                className="rounded-lg p-4 bg-[#2c2e3b] border-none"
                onChange={(e) => searchContacts(e.target.value)}
              />
            </div>
            <ScrollArea className="h-[200px] w-[400px] rounded-md border p-4">
              {searchedContacts.length > 0 ? (
                searchedContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="flex items-center p-2 m-1 bg-[#2c2e3b] rounded-lg text-white cursor-pointer hover:bg-[#3a3b4c] transition-colors"
                    onClick={() => selectNewContact(contact)}
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-[#3a3b4c] rounded-full text-lg font-semibold mr-4 border border-[#18181e]">
                      {/* {contact.fullName.charAt(0).toUpperCase()} */}
                      {contact.image ? (
                        <img
                          src={contact.image}
                          alt={contact.fullName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span>{contact.fullName.charAt(0).toUpperCase()}</span>
                      )}
                        
                    </div>
                    <div>
                      <div className="font-medium">{contact.fullName}</div>
                      <div className="text-sm text-gray-400">{contact.email}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-40 flex items-center justify-center text-gray-500">
                  No contacts found
                  
                  </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ContactContainer;
