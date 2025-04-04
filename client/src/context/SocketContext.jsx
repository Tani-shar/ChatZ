import {createContext, useContext, useEffect, useRef} from "react"
import { useAppStore } from "../store"
import { io } from "socket.io-client"

const HOST = "http://localhost:8747"; // Replace with your actual client host


const socketContext = createContext(null)
export const SocketContextProvider = ({children}) => {
  const socketRef = useRef(null)

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8747")

    return () => {
      socketRef.current.close()
    }
  }, [])

  return (
    <socketContext.Provider value={socketRef}>
      {children}
    </socketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(socketContext)
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}

export const SocketProvider = ({children}) => {
    const socket = useRef();
    const userInfo = useAppStore((state) => state.userInfo);

    useEffect(() => {
        socket.current = io(HOST, {
            withCredentials: true,
            query: {
                userId: userInfo ? userInfo.id : null,
            },
            

        })
        
        socket.current.on("connect", () => {
            console.log("Connected to socket server");
        });
        return () => {
            socket.current.disconnect();
        }
    }, [userInfo]);
    return (
        <socketContext.Provider value={socket}>
            {children}
        </socketContext.Provider>
    )
}