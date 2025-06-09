import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ;//? JSON.parse(savedUser) : null;
    });

    const setLogin = (data) => {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token',data.token);
        setUser(data);
    };

    const setLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };
    
    return(
        <AuthContext.Provider value = {{ user, setLogin, setLogout }}>
            {children}
        </AuthContext.Provider>
    );
}