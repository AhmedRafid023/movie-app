import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
    const { loggedIn, userName, setLoggedIn, setUserName } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setLoggedIn(false);
        setUserName("");
        navigate("/");
        setIsProfileOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-gradient-to-r from-black via-gray-900 to-purple-900 p-2 shadow-md fixed w-full top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-yellow-400 text-3xl font-extrabold tracking-wider">
                    Matrix
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/movies" className="text-white text-lg hover:text-yellow-400 transition duration-300">
                        Movies
                    </Link>
                    <Link to="/tv-shows" className="text-white text-lg hover:text-yellow-400 transition duration-300">
                        TV Shows
                    </Link>
                    <Link
                        to={loggedIn ? "/watchlist" : "/login"}
                        className="text-white text-lg hover:text-yellow-400 transition duration-300"
                    >
                        Watchlist
                    </Link>

                    {/* Profile Section with Dropdown */}
                    {loggedIn ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 text-white hover:text-yellow-300 transition"
                            >
                                <FaUserCircle size={28} className="text-yellow-400" />
                                <span className="font-semibold">{userName}</span>
                            </button>

                            {/* Beautiful Dropdown */}
                            {isProfileOpen && (
                                <div className="absolute top-full right-0 mt-3 w-48 bg-gray-900 text-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform scale-95 origin-top-right">
                                    <div className="px-4 py-3 border-b border-gray-700">
                                        <p className="text-sm font-medium text-gray-300">Signed in as</p>
                                        <p className="text-lg font-semibold text-yellow-400">{userName}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full px-4 py-3 text-left text-white hover:bg-red-600 transition duration-300"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex space-x-4">
                            <Link to="/login" className="text-white text-lg hover:text-yellow-400 transition duration-300">
                                Sign In
                            </Link>
                            <Link to="/register" className="bg-yellow-400 px-4  text-black font-bold rounded-lg hover:bg-yellow-300 transition duration-300">
                                Register
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
                        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-black bg-opacity-90 backdrop-blur-md mt-4 p-4 rounded-lg shadow-md absolute top-full left-0 w-full">
                    <div className="flex flex-col gap-4">
                        <Link to="/movies" className="text-white hover:text-yellow-400" onClick={toggleMobileMenu}>
                            Movies
                        </Link>
                        <Link to="/tv-shows" className="text-white hover:text-yellow-400" onClick={toggleMobileMenu}>
                            TV Shows
                        </Link>
                        <Link
                            to={loggedIn ? "/watchlist" : "/login"}
                            className="text-white hover:text-yellow-400"
                            onClick={toggleMobileMenu}
                        >
                            Watchlist
                        </Link>

                        {loggedIn ? (
                            <>
                                <div className="flex items-center gap-2 text-yellow-400 font-semibold">
                                    <FaUserCircle size={22} />
                                    {userName}
                                </div>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        toggleMobileMenu();
                                    }}
                                    className="bg-red-600 px-4 py-2 text-white rounded-lg hover:bg-red-500 transition duration-300"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-white hover:text-yellow-400" onClick={toggleMobileMenu}>
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-yellow-400 px-4 py-2 text-black font-bold rounded-lg hover:bg-yellow-300 transition duration-300"
                                    onClick={toggleMobileMenu}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;