// src/context/AuthContext.jsx
import React, {createContext, useEffect, useState} from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(() => !!localStorage.getItem('token'));
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Check for a stored token/user in localStorage when the app loads
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setLoggedIn(true);
            setUserName(JSON.parse(storedUser).name);
            setUserId(JSON.parse(storedUser).id);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ loggedIn, setLoggedIn, userName, setUserName, userId, setUserId }}>
            {children}
        </AuthContext.Provider>
    );
};