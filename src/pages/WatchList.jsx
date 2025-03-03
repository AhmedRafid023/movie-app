import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner.jsx';
import { FaTrash } from 'react-icons/fa';

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { loggedIn, userId } = useContext(AuthContext);
    const navigate = useNavigate();
    const [featuredContent, setFeaturedContent] = useState(null);

    const WATCHLIST_API_BASE_URL = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_LOCAL_BASE_URL
        : import.meta.env.VITE_PROD_BASE_URL;

    const fetchWatchlist = async () => {
        try {
            const token = localStorage.getItem('token');
            if(!token){
                throw new Error('Token is missing');
            }
            const response = await fetch(`${WATCHLIST_API_BASE_URL}/watchlist/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch watchlist');
            }

            const data = await response.json();
            setWatchlist(data.watchlist);
            if (data.watchlist.length > 0) {
                setFeaturedContent(data.watchlist[0]);
            }
        } catch (error) {
            console.error('Error fetching watchlist:', error);
            setError('Failed to fetch watchlist. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch the user's watchlist
    useEffect(() => {
        if (!loggedIn) {
            setError('Please log in to view your watchlist.');
            setLoading(false);
            return;
        }
        if (!userId) {
            setLoading(true)
            return;
        }
        fetchWatchlist();
    }, [loggedIn, userId]);

    // Remove an item from the watchlist
    const handleRemoveFromWatchlist = async (tmdbId, mediaType) => {
        try {
            const response = await fetch(`${WATCHLIST_API_BASE_URL}/watchlist/remove`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    tmdb_id: tmdbId,
                    media_type: mediaType,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove from watchlist');
            }

            // Update the watchlist state by filtering out the removed item
            setWatchlist((prevWatchlist) => {
                const updatedWatchlist = prevWatchlist.filter((item) => item.tmdb_id !== tmdbId);

                // Update featuredContent if the removed item was the featured content
                if (featuredContent && featuredContent.tmdb_id === tmdbId) {
                    setFeaturedContent(updatedWatchlist.length > 0 ? updatedWatchlist[0] : null);
                }

                return updatedWatchlist;
            });

            toast.success('Removed from watchlist!');
        } catch (error) {
            console.error('Error removing from watchlist:', error);
            toast.error('Failed to remove from watchlist. Please try again.');
        }
    };

    // Redirect to the movie/show details page
    const handleCardClick = (tmdbId, mediaType) => {
        navigate(`/${mediaType}/${tmdbId}`);
    };

    if (!loggedIn) {
        return <div className="text-center py-8">Please log in to view your watchlist.</div>;
    }

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    return (
        <main className="bg-dark-100 text-light-100">
            {/* Hero Section */}
            <section className="hero-section relative h-[600px] flex items-end pb-16">
                {featuredContent && (
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-90"
                        style={{
                            backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredContent.backdrop_path})`,
                        }}
                    ></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-dark-100/80 to-transparent"></div>
                <div className="relative z-10 container mx-auto px-4">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl font-bold mb-4">
                            {featuredContent?.name || 'Find TV Shows You Will Love'}
                        </h1>
                        <p className="text-light-200 text-lg mb-6">
                            {featuredContent?.overview ||
                                'Explore a wide range of TV shows and discover your next favorite.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Watchlist Section */}
            <section className="container mx-auto px-4 py-8">
                {watchlist.length === 0 ? (
                    <p className="text-center text-light-200">Your watchlist is empty. Start adding movies and shows!</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {watchlist.map((item) => (
                            <div
                                key={item.tmdb_id}
                                className="watchlist-card bg-dark-200 rounded-lg overflow-hidden hover:scale-105 transition-transform"
                            >
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                                    alt={item.title}
                                    onClick={() => handleCardClick(item.tmdb_id, item.media_type)}
                                    className="w-full h-64 object-cover cursor-pointer"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold">{item.title}</h3>
                                    <p className="text-light-200 text-sm">
                                        Rating: {item.rating ? item.rating : 'N/A'}
                                    </p>
                                    <button
                                        className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors"
                                        onClick={() => handleRemoveFromWatchlist(item.tmdb_id, item.media_type)}
                                    >
                                        <FaTrash className="text-sm" /> {/* Trash icon */}
                                        <span>Remove</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default Watchlist;