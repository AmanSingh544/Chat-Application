import React, { useContext, useState } from "react";
import { authApi } from "../api/authApi";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";
import '../components/login.css';
import { useNotification } from "../context/NotificationContext";

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const { setLogin: saveUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const handleAuth = async (credentials) => {
        try {
            const res = isLogin ? await authApi.login(credentials) : await authApi.register(credentials);
            if (res.success) {
                console.log("Authentication successful:", res);
                addNotification({
                    message:  res?.data?.message,
                    type: 'success',
                });
                saveUser(res); // Save user data in AuthContext
                navigate('/dashboard'); // Redirect to chat page on successful authentication
            } else {
                console.error("Authentication failed:", res.message);
                addNotification({
                    message: "Authentication failed: " + res.message,
                    type: 'error',
                });
                // Handle authentication failure (e.g., show error message)
            }
        }
        catch (error) {
            console.error("Authentication error:", error);
            addNotification({
                message: error.response?.data?.message || error.message || "Unexpected error",
                type: 'error',
            });
        };
    };


    return (
        <AuthForm onSubmit={handleAuth} isLogin={isLogin} setIsLogin={setIsLogin} />
    );
};

export default AuthPage;
// This component handles user authentication, allowing users to log in or register.