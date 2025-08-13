import { createContext } from "react";
import type { UContextType } from "./ContextInterface";
import dayjs from "dayjs";

export const UContext = createContext<UContextType>({
    userEvents: [],
    setUserEvents: () => { },
    loading: false,
    setLoading: () => { },
    date: dayjs(),
    setDate: () => { },
    isModalOpen: false,
    setIsModalOpen: () => { },
    refreshEvents: false,
    setRefreshEvents: () => { },
    currentEvent: null,
    setCurrentEvent: () => { },
    currentUser: null,
    setCurrentUser: () => { },
    loggedUser: null,
    setLoggedUser: () => { }
});