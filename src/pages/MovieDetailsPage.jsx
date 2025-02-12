import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from "../components/Spinner.jsx";

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        authorization: `Bearer ${API_KEY}`,
    }
};

const MovieDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [credits, setCredits] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [similarMovies, setSimilarMovies] = useState([]);
    const [trailerKey, setTrailerKey] = useState(null); // State to store the YouTube trailer key

    const fetchMovieDetails = async () => {
        setIsLoading(true);
        setError('');

        try {
            // Fetch movie details
            const movieResponse = await fetch(`${API_BASE_URL}/movie/${id}`, API_OPTIONS);
            if (!movieResponse.ok) {
                throw new Error("Could not fetch movie details");
            }
            const movieData = await movieResponse.json();

            // Fetch movie credits
            const creditsResponse = await fetch(`${API_BASE_URL}/movie/${id}/credits`, API_OPTIONS);
            if (!creditsResponse.ok) {
                throw new Error("Could not fetch movie credits");
            }
            const creditsData = await creditsResponse.json();

            // Fetch similar movies
            const similarResponse = await fetch(`${API_BASE_URL}/movie/${id}/similar`, API_OPTIONS);
            if (!similarResponse.ok) {
                throw new Error("Could not fetch similar movies");
            }
            const similarData = await similarResponse.json();

            // Fetch movie videos (trailers)
            const videosResponse = await fetch(`${API_BASE_URL}/movie/${id}/videos`, API_OPTIONS);
            if (!videosResponse.ok) {
                throw new Error("Could not fetch movie videos");
            }
            const videosData = await videosResponse.json();

            // Find the official trailer (YouTube)
            const trailer = videosData.results.find(
                (video) => video.type === "Trailer" && video.site === "YouTube"
            );

            setMovie(movieData);
            setCredits(creditsData);
            setSimilarMovies(similarData.results);
            setTrailerKey(trailer?.key); // Set the YouTube trailer key (if found)
        } catch (error) {
            console.log(`Error fetching movie details: ${error}`);
            setError('Could not fetch movie details. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMovieDetails();
    }, [id]);

    // Function to handle clicking on a similar movie
    const handleSimilarMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
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

    // Get the director from the credits
    const director = credits.crew.find((member) => member.job === 'Director');

    return (
        <div className="movie-details p-8 bg-dark-100 text-white">
            {/* Back Button */}
            <button onClick={() => navigate(-1)} className="mb-8 px-4 py-2 bg-light-100/10 text-light-200 rounded-lg">
                Back to Home
            </button>

            {/* Movie Header */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Poster */}
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full md:w-1/3 rounded-lg"
                />

                {/* Details */}
                <div className="flex-1">
                    <h1 className="text-4xl font-bold">{movie.title}</h1>
                    <p className="mt-2 text-light-200">{movie.tagline}</p>

                    {/* Metadata */}
                    <div className="mt-4 flex flex-wrap gap-4">
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

                    {/* Overview */}
                    <p className="mt-6 text-light-200">{movie.overview}</p>

                    {/* Director */}
                    {director && (
                        <div className="mt-6">
                            <h2 className="text-xl font-bold">Director</h2>
                            <p className="text-light-200">{director.name}</p>
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
                                            src={`https://image.tmdb.org/t/p/w200${similarMovie.poster_path}`}
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
        </div>
    );
};

export default MovieDetailsPage;