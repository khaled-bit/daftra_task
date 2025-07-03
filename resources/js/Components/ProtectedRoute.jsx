import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loading />;
    }
    if (user) {
        return <div>{children}</div>;
    } else {
        return <Navigate to={"/login"} />;
    }
};

export default ProtectedRoute;
