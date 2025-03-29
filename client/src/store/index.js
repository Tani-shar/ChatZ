import {create} from "zustand";
import {createAuthSlice} from "./authSlice";

export const useAppStore = create()((...a)=>({
    ...createAuthSlice(...a),
}));