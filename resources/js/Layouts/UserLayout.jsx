import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import UserSidebar from "@/Pages/User/UserSidebar";

export default function AdminLayout() {
    return (
        <div>
            <UserSidebar />
            <div className="lg:pt-24 lg:w-[68%] xl:w-[74%] lg:ml-[32%] xl:ml-[26%] pt-20 bg-white min-h-screen">
                <Outlet />
            </div>
        </div>
    );
}
