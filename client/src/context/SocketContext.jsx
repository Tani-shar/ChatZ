import { createContext, useContext, useEffect, useRef } from "react";
import { useAppStore } from "../store";
import { io } from "socket.io-client";

const HOST = "http://localhost:8747"; // Replace with your actual client host

const socketContext = createContext(null);
// export const SocketContextProvider = ({ children }) => {
//   const socketRef = useRef(null);

//   useEffect(() => {
//     socketRef.current = new WebSocket(HOST);

//     return () => {
//       socketRef.current.close();
//     };
//   }, []);

//   return (
//     <socketContext.Provider value={socketRef}>
//       {children}
//     </socketContext.Provider>
//   );
// };

export const useSocket = () => {
  const context = useContext(socketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const userInfo = useAppStore((state) => state.userInfo);

  useEffect(() => {
    socket.current = io(HOST, {
      withCredentials: true,
      query: {
        userId: userInfo ? userInfo.id : null,
      },
    });

    socket.current.on("connect", () => {
      console.log("Connected to socket server");
    });

    const handleReceiveMessage = (message) => {
      const {selectedChatData, selectedChatType, addMessage} = useAppStore.getState();

      // Fix the comparison logic
      if(selectedChatType !== undefined && 
         (selectedChatData._id === message.sender._id || 
          selectedChatData._id === message.recipient._id)){
        addMessage(message);
        console.log("Message received in active chat:", message);
      }
    
      console.log("Received message:", message);
    };

    socket.current.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.current.disconnect();
    };
  }, [userInfo]);
  
  return (
    <socketContext.Provider value={socket}>{children}</socketContext.Provider>
  );
};
