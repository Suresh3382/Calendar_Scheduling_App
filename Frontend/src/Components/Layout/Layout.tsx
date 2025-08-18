import { useContext } from "react";
import { User2Icon, LogOut, User, User2 } from "lucide-react";
import { Avatar, Popover } from "antd";
import Home from "../Home/Home";
import { UContext } from "@/Utils/Context";
import { useNavigate } from "react-router-dom";

const Layout = () => {
  const { loggedUser } = useContext(UContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const popoverContent = (
    <div className="font-[Poppins] w-72 p-4 backdrop-blur-lg rounded-[6px] bg-gray-50">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar
            src={loggedUser?.username}
            size={64}
            alt="Profile"
            className="rounded-full border-2 border-white object-cover"
          >
            <User2 size={30} />
          </Avatar>
          <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-gray-900">
            {loggedUser?.username}
          </span>
          <span className="text-sm text-gray-500">{loggedUser?.email}</span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <button
          onClick={() => navigate("/Profile")}
          className="w-full cursor-pointer flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <User size={16} className="text-gray-500" />
          <span>Profile Settings</span>
        </button>
      </div>

      <div className="mt-4 border-t border-gray-200 pt-3">
        <button
          onClick={handleLogout}
          className="w-full cursor-pointer flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium !text-red-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col font-[Poppins]">
      <div className="sticky top-0 z-50 flex items-center justify-between bg-[#ffffff] px-6 py-4 h-[7vh] shadow">
        <span className="font-semibold">
          <img src="/logo.png" alt="App Logo" className="h-10 w-56" />
        </span>
        <div className="flex items-center gap-4">
          <span className="text-xl">{loggedUser?.username}</span>
          <Popover
            placement="bottomRight"
            trigger="click"
            content={popoverContent}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-gray-400 text-white shadow-[0_2px_6px_rgba(30,136,229,0.4)]">
              <User2Icon size={20} />
            </div>
          </Popover>
        </div>
      </div>

      <div className="flex-1 w-full bg-[#F1F5F9] p-3 overflow-auto">
        <Home />
      </div>
    </div>
  );
};

export default Layout;
