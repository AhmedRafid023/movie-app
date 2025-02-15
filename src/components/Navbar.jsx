import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${searchQuery}`);
            setSearchQuery('');
        }
    };

    return (
        <nav className="bg-dark-900 p-4 shadow-lg">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-light-200">
                    MyIMDB
                </Link>

                {/* Navigation Links */}
                <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
                    <Link to="/movies" className="text-light-200 hover:text-light-100">
                        Movies
                    </Link>
                    <Link to="/tv-shows" className="text-light-200 hover:text-light-100">
                        TV Shows
                    </Link>
                    <Link to="/watchlist" className="text-light-200 hover:text-light-100">
                        Watchlist
                    </Link>
                </div>

                 {/*Search Bar */}
                <form onSubmit={handleSearch} className="mt-4 md:mt-0 flex items-center">
                    <input
                        type="text"
                        placeholder="Search movies or TV shows..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 rounded-l-lg bg-light-100/10 text-light-200 placeholder-light-200/50 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-light-100/20 text-light-200 rounded-r-lg hover:bg-light-100/30"
                    >
                        Search
                    </button>
                </form>

                 {/*User Options */}
                <div className="flex gap-4 mt-4 md:mt-0">
                    <Link to="/signin" className="text-light-200 hover:text-light-100">
                        Sign In
                    </Link>
                    <Link to="/register" className="text-light-200 hover:text-light-100">
                        Register
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
