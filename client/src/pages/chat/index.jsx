import { useEffect } from "react";
import { replace, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppStore } from "@/store";

const chat =() => {
    const {userInfo} = useAppStore();
    const navigate = useNavigate();
    useEffect(() => {
        if (!userInfo.profileSetup) {
        toast("Please complete your profile setup before accessing the chat.", {
            variant: "warning",
        });
        navigate("/profile", replace);
            
        }
    }, [userInfo, navigate]);
}
export default chat;