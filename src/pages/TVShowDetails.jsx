import React, {useContext, useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from "../components/Spinner.jsx";
import {AuthContext} from "../context/AuthContext.jsx";
import {Check, Plus} from "lucide-react";
import {toast} from "react-toastify";

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        authorization: `Bearer ${API_KEY}`,
    }
};

const TVShowDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tvShow, setTVShow] = useState(null);
    const [credits, setCredits] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [similarTVShows, setSimilarTVShows] = useState([]);
    const [trailerKey, setTrailerKey] = useState(null); // State to store the YouTube trailer key
    const { loggedIn, userId,  } = useContext(AuthContext); // Get user info from context
    const [isInWatchlist, setIsInWatchlist] = useState(false);

    const WATCHLIST_API_BASE_URL = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_LOCAL_BASE_URL
        : import.meta.env.VITE_PROD_BASE_URL;

    const fetchTVShowDetails = async () => {
        setIsLoading(true);
        setError('');

        try {
            // Fetch TV show details
            const tvShowResponse = await fetch(`${API_BASE_URL}/tv/${id}`, API_OPTIONS);
            if (!tvShowResponse.ok) {
                throw new Error("Could not fetch TV show details");
            }
            const tvShowData = await tvShowResponse.json();

            // Fetch TV show credits
            const creditsResponse = await fetch(`${API_BASE_URL}/tv/${id}/credits`, API_OPTIONS);
            if (!creditsResponse.ok) {
                throw new Error("Could not fetch TV show credits");
            }
            const creditsData = await creditsResponse.json();

            // Fetch similar TV shows
            const similarResponse = await fetch(`${API_BASE_URL}/tv/${id}/similar`, API_OPTIONS);
            if (!similarResponse.ok) {
                throw new Error("Could not fetch similar TV shows");
            }
            const similarData = await similarResponse.json();

            // Fetch TV show videos (trailers)
            const videosResponse = await fetch(`${API_BASE_URL}/tv/${id}/videos`, API_OPTIONS);
            if (!videosResponse.ok) {
                throw new Error("Could not fetch TV show videos");
            }
            const videosData = await videosResponse.json();

            // Find the official trailer (YouTube)
            const trailer = videosData.results.find(
                (video) => video.type === "Trailer" && video.site === "YouTube"
            );

            setTVShow(tvShowData);
            setCredits(creditsData);
            setSimilarTVShows(similarData.results);
            setTrailerKey(trailer?.key); // Set the YouTube trailer key (if found)
        } catch (error) {
            console.log(`Error fetching TV show details: ${error}`);
            setError('Could not fetch TV show details. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchWatchlistStatus = async () => {
        if (!loggedIn) return; // Only fetch if the user is logged in

        try {
            const response = await fetch(`${WATCHLIST_API_BASE_URL}/watchlist/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    tmdb_id: tvShow.id.toString(),
                    media_type: 'movie',
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch watchlist status');
            }

            const data = await response.json();
            setIsInWatchlist(data.inWatchlist); // Update the state
        } catch (error) {
            console.error('Error fetching watchlist status:', error);
        }
    };


    useEffect(() => {
        fetchTVShowDetails();
    }, [id]);

    useEffect(() => {
        if (loggedIn && userId && tvShow) {
            fetchWatchlistStatus();
        }
    }, [loggedIn, userId, tvShow]);

    // Function to handle clicking on a similar TV show
    const handleSimilarTVShowClick = (tvShowId) => {
        navigate(`/tv/${tvShowId}`);
    };

    const handleAddToWatchlist = async () => {
        if (!loggedIn) {
            alert('Please log in to add TV shows to your watchlist.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/watchlist/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    tmdb_id: tvShow.id.toString(), // Use the TV show's ID
                    media_type: 'tv', // Set media_type to 'tv' for TV shows
                    title: tvShow.name, // TV shows use 'name' instead of 'title'
                    poster_path: tvShow.poster_path,
                    backdrop_path: tvShow.backdrop_path,
                    extra_details: {}, // Add any extra details if needed
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add to watchlist');
            }

            const data = await response.json();
            setIsInWatchlist(true); // Update the state
            toast.success('Added to watchlist!');
        } catch (error) {
            console.error('Error adding to watchlist:', error);
            alert('Failed to add to watchlist. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    // Get the creator(s) from the credits
    const creators = credits.crew.filter((member) => member.job === 'Creator');

    return (
        <div className="tvshow-details p-8 bg-dark-100 text-white">
            {/* Back Button */}
            <button onClick={() => navigate(-1)} className="mb-8 px-4 py-2 bg-light-100/10 text-light-200 rounded-lg">
                Back
            </button>

            {/* TV Show Header */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Poster */}
                <img
                    src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                    alt={tvShow.name}
                    className="w-full md:w-1/3 rounded-lg"
                />

                {/* Details */}
                <div className="flex-1">
                    <h1 className="text-4xl font-bold">{tvShow.name}</h1>
                    <p className="mt-2 text-light-200">{tvShow.tagline}</p>

                    {/* Metadata */}
                    <div className="mt-4 flex flex-wrap gap-4">
                        <span className="text-light-200">First Air Date: {tvShow.first_air_date}</span>
                        <span className="text-light-200">Seasons: {tvShow.number_of_seasons}</span>
                        <span className="text-light-200">Episodes: {tvShow.number_of_episodes}</span>
                        <span className="text-light-200">Rating: {tvShow.vote_average}/10</span>
                        <div className="flex gap-2">
                            {tvShow.genres.map((genre) => (
                                <span key={genre.id} className="px-2 py-1 bg-light-100/10 rounded">
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Overview */}
                    <p className="mt-6 text-light-200">{tvShow.overview}</p>

                    {/* Creators */}
                    {creators.length > 0 && (
                        <div className="mt-6">
                            <h2 className="text-xl font-bold">Creators</h2>
                            <div className="flex flex-wrap gap-2">
                                {creators.map((creator) => (
                                    <p key={creator.id} className="text-light-200">{creator.name}</p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Watchlist Button */}
                    {loggedIn && (
                        <div className="mt-6">
                            {isInWatchlist ? (
                                <button
                                    className="flex items-center gap-2 px-6 py-2 border border-gray-500 text-white rounded-lg hover:bg-gray-700 transition"
                                    disabled
                                >
                                    <Check size={18} /> Added to Watchlist
                                </button>
                            ) : (
                                <button
                                    className="flex items-center gap-2 px-6 py-2 border border-gray-500 text-white rounded-lg hover:bg-gray-700 transition"
                                    onClick={handleAddToWatchlist}
                                >
                                    <Plus size={18} /> Add to Watchlist
                                </button>
                            )}
                        </div>
                    )}

                    {/* Trailer */}
                    <div className="mt-6">
                        <h2 className="text-xl font-bold">Trailer</h2>
                        {trailerKey ? (
                            <div className="mt-4 aspect-video w-full max-w-2xl">
                                <iframe
                                    src={`https://www.youtube.com/embed/${trailerKey}`}
                                    title="TV Show Trailer"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full rounded-lg"
                                ></iframe>
                            </div>
                        ) : (
                            <p className="text-light-200">No trailer available.</p>
                        )}
                    </div>

                    {/* Cast */}
                    <div className="mt-6">
                        <h2 className="text-xl font-bold">Cast</h2>
                        <div className="flex flex-wrap gap-4 mt-4">
                            {credits.cast.slice(0, 10).map((actor) => (
                                <div key={actor.id} className="flex flex-col items-center">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                        alt={actor.name}
                                        className="w-24 h-24 rounded-full object-cover"
                                    />
                                    <p className="mt-2 text-center text-light-200">{actor.name}</p>
                                    <p className="text-sm text-gray-100">{actor.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Similar TV Shows */}
                    <div className="mt-6">
                        <h2 className="text-xl font-bold">Similar TV Shows</h2>
                        {similarTVShows.length > 0 ? (
                            <div className="flex flex-wrap gap-4 mt-4">
                                {similarTVShows.slice(0, 5).map((similarTVShow) => (
                                    <div
                                        key={similarTVShow.id}
                                        className="flex flex-col items-center cursor-pointer hover:opacity-80"
                                        onClick={() => handleSimilarTVShowClick(similarTVShow.id)}
                                    >
                                        <img
                                            src={similarTVShow.poster_path ? `https://image.tmdb.org/t/p/w200${similarTVShow.poster_path}` : '/no-movie.png'}
                                            alt={similarTVShow.name}
                                            className="w-24 h-24 rounded-lg object-cover"
                                        />
                                        <p className="mt-2 text-center text-light-200">{similarTVShow.name}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-light-200">No similar TV shows found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TVShowDetails;