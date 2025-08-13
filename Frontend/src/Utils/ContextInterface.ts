import type { EventInterface } from "@/Components/Home/EventInterface";
import type { ISignUpInterface } from "@/Components/LoginSignUp/LoginSignUpInterface";
import type { Dayjs } from "dayjs";
import type React from "react";

export interface UContextType {
  userEvents: EventInterface[];
  setUserEvents: React.Dispatch<React.SetStateAction<EventInterface[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  date: Dayjs;
  setDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refreshEvents: boolean;
  setRefreshEvents: React.Dispatch<React.SetStateAction<boolean>>;
  currentEvent: EventInterface | null;
  setCurrentEvent: React.Dispatch<React.SetStateAction<EventInterface | null>>;
  currentUser: ISignUpInterface | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<ISignUpInterface | null>>;
  loggedUser : ISignUpInterface | null;
  setLoggedUser : React.Dispatch<React.SetStateAction<ISignUpInterface | null>>;
}
