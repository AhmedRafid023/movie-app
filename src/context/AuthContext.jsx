// src/context/AuthContext.jsx
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');

    return (
        <AuthContext.Provider value={{ loggedIn, setLoggedIn, userName, setUserName }}>
            {children}
        </AuthContext.Provider>
    );
};