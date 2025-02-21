import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import hamburger and close icons

const Navbar = () => {
    const { loggedIn, userName, setLoggedIn, setUserName } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

    // Handle user logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoggedIn(false);
        setUserName('');
        navigate('/');
    };

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-black p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-yellow-400 text-2xl font-bold">
                    Matrix
                </Link>

                {/* Hamburger Menu Icon (Mobile Only) */}
                <div className="md:hidden">
                    <button
                        onClick={toggleMobileMenu}
                        className="text-white focus:outline-none"
                    >
                        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>

                {/* Navigation Links and User Options (Desktop) */}
                <div className="hidden md:flex gap-6">
                    <div className="flex gap-6">
                        <Link to="/movies" className="text-white hover:text-gray-300">
                            Movies
                        </Link>
                        <Link to="/tv-shows" className="text-white hover:text-gray-300">
                            TV Shows
                        </Link>
                        <Link to={loggedIn ? '/watchlist' : '/login'} className="text-white hover:text-gray-300">
                            Watchlist
                        </Link>
                    </div>

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
            </div>

            {/* Mobile Menu (Visible on Small Screens) */}
            {isMobileMenuOpen && (
                <div className="md:hidden mt-4">
                    <div className="flex flex-col gap-4">
                        <Link
                            to="/movies"
                            className="text-white hover:text-gray-300"
                            onClick={toggleMobileMenu}
                        >
                            Movies
                        </Link>
                        <Link
                            to="/tv-shows"
                            className="text-white hover:text-gray-300"
                            onClick={toggleMobileMenu}
                        >
                            TV Shows
                        </Link>
                        <Link
                            to={loggedIn ? '/watchlist' : '/login'}
                            className="text-white hover:text-gray-300"
                            onClick={toggleMobileMenu}
                        >
                            Watchlist
                        </Link>
                        {loggedIn ? (
                            <>
                                <span className="text-white">{userName}</span>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        toggleMobileMenu();
                                    }}
                                    className="text-white hover:text-gray-300"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-white hover:text-gray-300"
                                    onClick={toggleMobileMenu}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-white hover:text-gray-300"
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