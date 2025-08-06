import React from "react";
import { Clock, User2Icon } from "lucide-react";
import { Button } from "antd";
import Home from "../Home/Home";

const Layout = () => {
  return (
    <div className="h-screen flex flex-col font-[Poppins]">
      <div className="sticky top-0 z-50 flex items-center justify-between bg-[#0A192F] px-6 py-4 h-[7vh] shadow">
        <h1 className="text-white text-xl font-semibold">📅 Scheduler</h1>

        <div className="flex items-center gap-4">
          <Button
            size="middle"
            className="!bg-[#1E88E5] !text-white !font-medium !shadow-[0_2px_6px_rgba(30,136,229,0.4)] !border-none"
            icon={<Clock size={16} />}
          >
            Book Appointment
          </Button>

          <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-[#1E88E5] text-white shadow-[0_2px_6px_rgba(30,136,229,0.4)]">
            <User2Icon size={20} />
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="w-[15vw] text-white p-4 sticky top-[7vh] bg-[#0A192F] border-r border-[#123456]"></div>
        <div className="w-[85vw] bg-[#F1F5F9] overflow-auto">
          <Home />
        </div>
      </div>
    </div>
  );
};

export default Layout;
