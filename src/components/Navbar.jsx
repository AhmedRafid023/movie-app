import React, {useContext, useEffect, useState} from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const {loggedIn, userName, setLoggedIn, setUserName} = useContext(AuthContext);
    const navigate = useNavigate();


    // Handle user logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoggedIn(false);
        setUserName('');
        navigate('/');
    };

    return (
        <nav className="bg-black p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-yellow-400 text-2xl font-bold">
                    Matrix
                </Link>

                {/* Navigation Links */}
                <div className="flex gap-6">
                    <Link to="/movies" className="text-white hover:text-gray-300">
                        Movies
                    </Link>
                    <Link to="/tv-shows" className="text-white hover:text-gray-300">
                        TV Shows
                    </Link>
                    <Link to={ loggedIn ? "/watchlist" : "/login" } className="text-white hover:text-gray-300">
                        Watchlist
                    </Link>
                </div>

                {/* User Options */}
                <div className="flex gap-6">
                    {loggedIn ? (
                        <>
                            <span className="text-white">{userName}</span>
                            <button
                                onClick={handleLogout}
                                className="text-white hover:text-gray-300"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-white hover:text-gray-300">
                                Sign In
                            </Link>
                            <Link to="/register" className="text-white hover:text-gray-300">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
