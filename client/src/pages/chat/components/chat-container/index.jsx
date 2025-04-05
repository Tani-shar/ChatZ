import { FiPaperclip, FiMic, FiSmile } from "react-icons/fi";
import { BsArrowLeft, BsCheck2All } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { RiCloseFill, RiSearchLine } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "../../../../store";
import { useSocket } from "../../../../context/SocketContext";
import moment from "moment";

const ChatContainer = () => {
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const emojiRef = useRef(null);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const { closeChat, selectedChatData, selectedChatType, userInfo, selectedChatMessages } = useAppStore();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);
  
  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = lastDate !== messageDate;
      lastDate = messageDate;
      return (
        <div key={message._id}>
          {showDate && (
            <div className="text-center text-gray-500 text-xs my-2">
              {moment(message.timestamp).format("LL")}
            </div>  
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => {
    return (
      <div className={`${message.sender === userInfo.id ? "justify-end" : "justify-start"} flex mb-3`}>
        <div className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
          message.sender === userInfo.id 
            ? "bg-[#005c4b] text-white rounded-tr-none" 
            : "bg-[#1e1f2a] text-white rounded-tl-none"
        }`}> 
          <p className="break-words">{message.content}</p>
          <div className={`flex items-center justify-end space-x-1 mt-1 text-xs ${
            message.sender === userInfo.id ? "text-[#a3beb6]" : "text-gray-500"
          }`}>
            <span>{moment(message.timestamp).format("LT")}</span>
            {message.sender === userInfo.id && (
              <BsCheck2All className={message.status === "read" ? "text-blue-400" : ""} />
            )}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = (emojiData) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (!socket || !socket.current || !message.trim()) {
      return;
    }
    
    if (selectedChatType === "contact") {
      socket.current.emit("sendMessage", { 
        content: message, 
        sender: userInfo.id, // 67f02eb050939f9d2c28b14a
        recipient: selectedChatData._id, // 67ea43428544e30bde6d753f
        fileUrl: undefined,
        messageType: "text",
      });
      
      // Clear the message after sending
      setMessage("");
    }
  };

  return (
    <div className="relative w-full md:w-[65vw] lg:w-[70vw] xl:w-[75vw] bg-[#0b0e11] border-l border-l-[#252632] h-screen flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 bg-[#1e1f2a] border-b border-[#252632]">
        <div className="flex items-center">
          <button className="md:hidden mr-2 text-gray-400 hover:text-white">
            <BsArrowLeft size={20} />
          </button>
          <div className="relative mr-3">
            <div className="w-10 h-10 rounded-full bg-[#3a3b4c] flex items-center justify-center text-white overflow-hidden">
              {selectedChatData.image ? (
                <img
                  src={selectedChatData.image}
                  alt={selectedChatData.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{selectedChatData.fullName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0b0e11]"></div>
          </div>
          <div>
            <h3 className="text-white font-medium">{selectedChatData.fullName}</h3>
            <p className="text-xs text-gray-400">Online</p>
          </div>
        </div>
        <div className="flex space-x-4 text-gray-400">
          <button className="hover:text-white transition-colors">
            <RiSearchLine size={20} />
          </button> 
          <button className="mr-2 text-gray-400 hover:text-white" onClick={closeChat}>
            <RiCloseFill size={20} />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#111319] bg-opacity-90 bg-[url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png')]">
        <div className="space-y-1">
          {renderMessages()}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="p-3 bg-[#1e1f2a] border-t border-[#252632]">
        <div className="flex items-center">
          <button
            className="p-2 text-gray-400 hover:text-white"
            onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
          >
            <FiSmile size={22} />
          </button>
          {emojiPickerOpen && (
            <div className="absolute bottom-16 left-2 z-10" ref={emojiRef}>
              <EmojiPicker
                theme="dark"
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          )}
          <button className="p-2 text-gray-400 hover:text-white">
            <FiPaperclip size={22} />
          </button>
          <input
            type="text"
            placeholder="Type a message"
            className="flex-1 bg-[#2a2b36] text-white rounded-lg px-4 py-2 mx-2 focus:outline-none focus:ring-1 focus:ring-[#3a3b4c]"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            value={message}
          />
          <button className="p-2 text-gray-400 hover:text-white">
            <FiMic size={22} />
          </button>
          <button 
            className="ml-2 p-2 bg-[#005c4b] text-white rounded-full hover:bg-[#008069] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={sendMessage}
            disabled={!message.trim()}
          >
            <IoMdSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
