"use client";
import axios from "axios";
import {
  createContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { toast } from "react-toastify";

interface AppData {
  user: any;
  isLoading: boolean;
}

interface AppContextType {
  appData: AppData;
  setAppData: Dispatch<SetStateAction<AppData>>;
}

const defaultAppData: AppData = {
  user: null,
  isLoading: true,
};

export const AppContext = createContext<AppContextType>({
  appData: defaultAppData,
  setAppData: () => {},
});

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [appData, setAppData] = useState(defaultAppData);

  const fetchUser = async () => {
    console.log("Fetching user");
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/loggedin-user`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      if (response.data && response.data.success) {
        setAppData((prev) => ({ ...prev, user: response.data.data }));
      }
    } catch (error: any) {
      if (error.message === "Network Error") {
        toast.error("Error Connecting to the Server");
        return;
      }
      console.log(error);
    } finally {
      setAppData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    console.log("Appdata updated:", appData);
  }, [appData]);

  return (
    <AppContext.Provider value={{ appData, setAppData }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
