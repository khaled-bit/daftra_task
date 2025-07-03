import React, { useEffect } from "react";
import AdminSidebar from "../Pages/Admin/AdminSidebar";
import { Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div>
            <AdminSidebar />
            <div className="relative xl:ml-[24%] pt-20 md:pt-24 pl-3 pr-3 bg-lightBackground min-h-screen">
                <Outlet />
            </div>
        </div>
    );
}
