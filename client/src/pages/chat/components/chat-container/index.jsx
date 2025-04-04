import { FiMoreVertical, FiPaperclip, FiMic, FiSmile } from "react-icons/fi";
import { BsArrowLeft, BsCheck2All, BsCrosshair } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { RiCloseCircleLine, RiCloseFill, RiCrossFill, RiCrossLine, RiSearchLine } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "../../../../store";

const ChatContainer = () => {
  const [message, setMessage] = useState("");
  const emojiRef = useRef(null);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const {closeChat, selectedChatData} = useAppStore();

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = (emojiData) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
    // Keep the picker open after selection
    // setEmojiPickerOpen(false); // Uncomment if you want it to close
  };

  // Sample c hat messages
  const messages = [
    {
      id: 1,
      sender: "other",
      text: "Hey there! How are you doing?",
      time: "10:30 AM",
      status: "read",
    },
    {
      id: 2,
      sender: "me",
      text: "I'm good, thanks! Working on that project we discussed.",
      time: "10:32 AM",
      status: "read",
    },
    {
      id: 3,
      sender: "other",
      text: "Great! Did you get a chance to look at the designs I sent?",
      time: "10:33 AM",
      status: "read",
    },
    {
      id: 4,
      sender: "me",
      text: "Yes, they look amazing! I have a few small suggestions though.",
      time: "10:35 AM",
      status: "delivered",
    },
    {
      id: 5,
      sender: "other",
      text: "I'd love to hear them. Maybe we can schedule a quick call tomorrow?",
      time: "10:36 AM",
      status: "read",
    },
  ];

  return (
    <div className="relative w-full md:w-[65vw] lg:w-[70vw] xl:w-[75vw] bg-[#0b0e11] border-l border-l-[#252632] h-screen flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 bg-[#1e1f2a] border-b border-[#252632]">
        <div className="flex items-center">
          <button className="md:hidden mr-2 text-gray-400 hover:text-white">
            <BsArrowLeft size={20} />
          </button>
          <div className="relative mr-3">
            <div className="w-10 h-10 rounded-full bg-[#3a3b4c] flex items-center justify-center text-white">
            {selectedChatData.image ? (
                        <img
                          src={selectedChatData.image}
                          alt={selectedChatData.fullName}
                          className="w-full h-full rounded-full object-cover"
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
          <button className=" mr-2 text-gray-400 hover:text-white" onClick={closeChat}>
            <RiCloseFill size={20} />
          </button>
          <button className="hover:text-white transition-colors">
            <FiMoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#111319] bg-opacity-90 bg-[url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png')]">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                  message.sender === "me"
                    ? "bg-[#005c4b] text-white rounded-tr-none"
                    : "bg-[#1e1f2a] text-white rounded-tl-none"
                }`}
              >
                <p>{message.text}</p>
                <div
                  className={`flex items-center justify-end space-x-1 mt-1 text-xs ${
                    message.sender === "me" ? "text-[#a3beb6]" : "text-gray-500"
                  }`}
                >
                  <span>{message.time}</span>
                  {message.sender === "me" && (
                    <BsCheck2All
                      className={
                        message.status === "read" ? "text-blue-400" : ""
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
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
          <div className="absolute bottom-18 left-2" ref ={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              onClose={() => setEmojiPickerOpen(false)}
              autoFocusSearch={false}
            />
          </div>
          <button className="p-2 text-gray-400 hover:text-white">
            <FiPaperclip size={22} />
          </button>
          <input
            type="text"
            placeholder="Type a message"
            className="flex-1 bg-[#2a2b36] text-white rounded-lg px-4 py-2 mx-2 focus:outline-none focus:ring-1 focus:ring-[#3a3b4c]"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <button className="p-2 text-gray-400 hover:text-white">
            <FiMic size={22} />
          </button>
          <button className="ml-2 p-2 bg-[#005c4b] text-white rounded-full hover:bg-[#008069]">
            <IoMdSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
