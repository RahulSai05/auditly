"use client";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/Dropmenu";
import { CircleUser } from "lucide-react";

export function Profile() {
  const router = useNavigate();
  const userDataString = localStorage.getItem("token");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const handleLogout = async () => {
    if (!userData) return;
    try {
      const response = await axios.post("http://54.210.159.220:8000/logout", {
        user_name: userData["User Name"],
        user_id: JSON.stringify(userData["User ID"]),
      });
      if (response.status === 200) {
        localStorage.removeItem("token");
        router("/login");
      } else {
        console.error("Logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (!userData) {
    return (
      <button
        className="flex border w-56 px-3 py-2 gap-x-3 rounded-md"
        onClick={() => router("/login")}
      >
        <CircleUser />
        Login
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="-mt-1" asChild>
        <button className=" rounded-full border bg-black uppercase text-white w-10 h-10 ">
          {userData["User Name"][0]}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-2 gap-y-4 pl-3 text-gray-700 pt-5 grid z-50 bg-white">
        <center className="border-b pb-2">
          <button className=" rounded-full border bg-black uppercase text-white w-10 h-10 ">
            {userData["User Name"][0]}
          </button>
          <div className="text-sm mt-1">
            Customer ID : {userData["User ID"]}
          </div>
        </center>
        <div className="cursor-pointer">Edit Profile</div>
        <div className="cursor-pointer">Account Settings</div>
        <div className="cursor-pointer">Renewal & Billing</div>
        <div
          className="cursor-pointer"
          onClick={() => router("/forgot-password")}
        >
          Forgot Password
        </div>
        <div
          className="cursor-pointer"
          onClick={() => router("/reset-password")}
        >
          Reset Settings
        </div>
        <div className="cursor-pointer" onClick={handleLogout}>
          Logout
        </div>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
