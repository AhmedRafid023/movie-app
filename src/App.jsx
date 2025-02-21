import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetailsPage from './pages/MovieDetailsPage';
import Navbar from "./components/Navbar.jsx";
import Movies from "./pages/Movies.jsx";
import TvShows from "./pages/TvShows.jsx";
import TVShowDetails from "./pages/TVShowDetails.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import { AuthProvider } from './context/AuthContext.jsx';
import WatchList from "./pages/WatchList.jsx";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<SignUpPage />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/tv-shows" element={<TvShows />} />
                    <Route path="/movie/:id" element={<MovieDetailsPage />} />
                    <Route path='/tv/:id' element={<TVShowDetails />} />
                    <Route path='/watchlist' element={<WatchList />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;