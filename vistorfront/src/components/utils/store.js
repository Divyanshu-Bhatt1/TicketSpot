import {create} from "zustand";

const useStore=create((set)=>(
    {
        isLoactionExist:false,
        setIsLoactionExist:(locStatus) => set({ isAuthenticated: locStatus })
        

    }
))

export default useStore;