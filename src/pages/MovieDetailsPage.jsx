import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { Plus, Check } from 'lucide-react';
import { toast } from 'react-toastify';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    },
};

const MovieDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [credits, setCredits] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [similarMovies, setSimilarMovies] = useState([]);
    const [trailerKey, setTrailerKey] = useState(null);
    const { loggedIn, userId } = useContext(AuthContext);
    const [isInWatchlist, setIsInWatchlist] = useState(false);

    const WATCHLIST_API_BASE_URL =
        import.meta.env.MODE === 'development'
            ? import.meta.env.VITE_LOCAL_BASE_URL
            : import.meta.env.VITE_PROD_BASE_URL;

    const fetchMovieDetails = async () => {
        setIsLoading(true);
        setError('');

        try {
            const movieResponse = await fetch(`${API_BASE_URL}/movie/${id}`, API_OPTIONS);
            if (!movieResponse.ok) throw new Error('Could not fetch movie details');
            const movieData = await movieResponse.json();

            const creditsResponse = await fetch(`${API_BASE_URL}/movie/${id}/credits`, API_OPTIONS);
            if (!creditsResponse.ok) throw new Error('Could not fetch movie credits');
            const creditsData = await creditsResponse.json();

            const similarResponse = await fetch(`${API_BASE_URL}/movie/${id}/similar`, API_OPTIONS);
            if (!similarResponse.ok) throw new Error('Could not fetch similar movies');
            const similarData = await similarResponse.json();

            const videosResponse = await fetch(`${API_BASE_URL}/movie/${id}/videos`, API_OPTIONS);
            if (!videosResponse.ok) throw new Error('Could not fetch movie videos');
            const videosData = await videosResponse.json();

            const trailer = videosData.results.find(
                (video) => video.type === 'Trailer' && video.site === 'YouTube',
            );

            setMovie(movieData);
            setCredits(creditsData);
            setSimilarMovies(similarData.results);
            setTrailerKey(trailer?.key);
        } catch (error) {
            console.error(`Error fetching movie details: ${error}`);
            setError('Could not fetch movie details. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchWatchlistStatus = async () => {
        if (!loggedIn) return;

        try {
            const response = await fetch(`${WATCHLIST_API_BASE_URL}/watchlist/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    tmdb_id: movie.id.toString(),
                    media_type: 'movie',
                }),
            });

            if (!response.ok) throw new Error('Failed to fetch watchlist status');
            const data = await response.json();
            setIsInWatchlist(data.inWatchlist);
        } catch (error) {
            console.error('Error fetching watchlist status:', error);
        }
    };

    useEffect(() => {
        fetchMovieDetails();
    }, [id]);

    useEffect(() => {
        if (loggedIn && userId && movie) {
            fetchWatchlistStatus();
        }
    }, [loggedIn, userId, movie]);

    const handleSimilarMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
    };

    const handleAddToWatchlist = async () => {
        if (!loggedIn) {
            alert('Please log in to add movies to your watchlist.');
            return;
        }

        try {
            const response = await fetch(`${WATCHLIST_API_BASE_URL}/watchlist/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    tmdb_id: movie.id.toString(),
                    media_type: 'movie',
                    title: movie.title,
                    poster_path: movie.poster_path,
                    backdrop_path: movie.backdrop_path,
                    extra_details: {},
                }),
            });

            if (!response.ok) throw new Error('Failed to add to watchlist');
            const data = await response.json();
            setIsInWatchlist(true);
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

    const director = credits.crew.find((member) => member.job === 'Director');

    return (
        <div className="bg-dark-100 text-white">
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-end pb-16">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-90"
                    style={{
                        backgroundImage: movie.backdrop_path
                            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
                            : 'linear-gradient(to bottom, #1a1a1a, #000000)',
                    }}
                ></div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-dark-100/80 to-transparent"></div>
                {/* Content */}
                <div className="relative z-10 container mx-auto px-4">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
                        <p className="text-light-200 text-lg mb-6">{movie.tagline}</p>
                        {/* Metadata */}
                        <div className="flex flex-wrap gap-4">
                            <span className="text-light-200">{movie.release_date}</span>
                            <span className="text-light-200">{movie.runtime} minutes</span>
                            <span className="text-light-200">{movie.vote_average}/10</span>
                            <div className="flex gap-2">
                                {movie.genres.map((genre) => (
                                    <span key={genre.id} className="px-2 py-1 bg-light-100/10 rounded">
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Movie Details Section */}
            <section className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Poster (Smaller Size) */}
                    <div className="w-full md:w-1/4 mt-8">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full rounded-lg shadow-lg"
                        />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                        {/* Overview */}
                        <p className="mt-6 text-light-200">{movie.overview}</p>

                        {/* Director */}
                        {director && (
                            <div className="mt-6">
                                <h2 className="text-xl font-bold">Director</h2>
                                <p className="text-light-200">{director.name}</p>
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
                                        title="Movie Trailer"
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

                        {/* Similar Movies */}
                        <div className="mt-6">
                            <h2 className="text-xl font-bold">Similar Movies</h2>
                            {similarMovies.length > 0 ? (
                                <div className="flex flex-wrap gap-4 mt-4">
                                    {similarMovies.slice(0, 5).map((similarMovie) => (
                                        <div
                                            key={similarMovie.id}
                                            className="flex flex-col items-center cursor-pointer hover:opacity-80"
                                            onClick={() => handleSimilarMovieClick(similarMovie.id)}
                                        >
                                            <img
                                                src={
                                                    similarMovie.poster_path
                                                        ? `https://image.tmdb.org/t/p/w200${similarMovie.poster_path}`
                                                        : '/no-movie.png'
                                                }
                                                alt={similarMovie.title}
                                                className="w-24 h-24 rounded-lg object-cover"
                                            />
                                            <p className="mt-2 text-center text-light-200">{similarMovie.title}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-light-200">No similar movies found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MovieDetailsPage;