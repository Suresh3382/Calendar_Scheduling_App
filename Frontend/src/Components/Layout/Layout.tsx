import React, { useContext } from "react";
import { User2Icon } from "lucide-react";
import Home from "../Home/Home";
import { UContext } from "@/Utils/Context";

const Layout = () => {
  const { loggedUser } = useContext(UContext);
  return (
    <div className="h-screen flex flex-col font-[Poppins]">
      <div className="sticky top-0 z-50 flex items-center justify-between bg-[#ffffff] px-6 py-4 h-[7vh] shadow">
        <span className="font-semibold">
          <img src="/logo.png" className="h-10 w-56"></img>
        </span>

        <div className="flex items-center gap-4">
          <span className=" text-xl">{loggedUser?.username}</span>
          <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-gray-400 text-white shadow-[0_2px_6px_rgba(30,136,229,0.4)]">
            <User2Icon size={20} />
          </div>
        </div>
      </div>

      <div className="h-[93vh] w-full bg-[#F1F5F9] p-3">
        <Home />
      </div>
    </div>
  );
};

export default Layout;
