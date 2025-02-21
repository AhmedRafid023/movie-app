import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { loggedIn, userId } = useContext(AuthContext);
    const navigate = useNavigate();

    const LOCAL_API_BASE_URL = "http://localhost:5000/api";

    // Fetch the user's watchlist
    useEffect(() => {
        if (!loggedIn) {
            setError('Please log in to view your watchlist.');
            setLoading(false);
            return;
        }

        const fetchWatchlist = async () => {
            try {
                const response = await fetch(`${LOCAL_API_BASE_URL}/watchlist/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch watchlist');
                }

                const data = await response.json();
                setWatchlist(data.watchlist);
            } catch (error) {
                console.error('Error fetching watchlist:', error);
                setError('Failed to fetch watchlist. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchWatchlist();
    }, [loggedIn, userId]);

    // Remove an item from the watchlist
    const handleRemoveFromWatchlist = async (tmdbId, mediaType) => {
        try {
            const response = await fetch(`${LOCAL_API_BASE_URL}/watchlist/remove`, {
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
            setWatchlist((prevWatchlist) =>
                prevWatchlist.filter((item) => item.tmdb_id !== tmdbId)
            );
            alert('Removed from watchlist!');
        } catch (error) {
            console.error('Error removing from watchlist:', error);
            alert('Failed to remove from watchlist. Please try again.');
        }
    };

    // Redirect to the movie/show details page
    const handleCardClick = (tmdbId, mediaType) => {
        navigate(`/${mediaType}/${tmdbId}`);
    };

    if (!loggedIn) {
        return <div className="watchlist-page">Please log in to view your watchlist.</div>;
    }

    if (loading) {
        return <div className="watchlist-page">Loading your watchlist...</div>;
    }

    if (error) {
        return <div className="watchlist-page">{error}</div>;
    }

    return (
        <div className="watchlist-page">
            <h2>My Watchlist</h2> {/* Added a heading */}
            {watchlist.length === 0 ? (
                <p>Your watchlist is empty. Start adding movies and shows!</p>
            ) : (
                <div className="watchlist-grid">
                    {watchlist.map((item) => (
                        <div key={item.tmdb_id} className="watchlist-card">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                                alt={item.title}
                                onClick={() => handleCardClick(item.tmdb_id, item.media_type)} // Make image clickable
                                style={{ cursor: 'pointer' }} // Indicate clickability
                            />
                            <div className="watchlist-card-details">
                                <h3>{item.title}</h3>
                                {/* Display rating with a check if available */}
                                <p>Rating: {item.rating ? item.rating : "N/A"}</p>
                                <button
                                    className="remove-button"
                                    onClick={() => handleRemoveFromWatchlist(item.tmdb_id, item.media_type)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Watchlist;