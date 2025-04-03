import { useEffect } from "react";
import { replace, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppStore } from "@/store";
import ContactContainer from "./components/contact-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";


const chat =() => {
    const {userInfo, selectedChatType} = useAppStore();
    const navigate = useNavigate();
    useEffect(() => {
        if (!userInfo.profileSetup) {
        toast("Please complete your profile setup before accessing the chat.", {
            variant: "warning",
        });
        navigate("/profile", replace);
            
        }
    }, [userInfo, navigate]);

    return (
        <div className="flex">
            <ContactContainer />
            {
                selectedChatType === undefined ? (
                    <EmptyChatContainer />
                ): ( 
                    <ChatContainer />
                 )
            }
            {/* <ChatContainer /> */}
            {/* <EmptyChatContainer /> */}
        </div>
    )
}
export default chat;