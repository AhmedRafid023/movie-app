import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner.jsx';
import {scrollContainer} from "../../utils/scrollUtils.js";

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        authorization: `Bearer ${API_KEY}`,
    },
};

const Home = () => {
    const [featuredContent, setFeaturedContent] = useState(null);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [trendingTVShows, setTrendingTVShows] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTrendingMovies = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/trending/movie/day?page=1`, API_OPTIONS);
            if (!response.ok) throw new Error('Could not fetch trending movies');
            const data = await response.json();
            setFeaturedContent(data.results[0]);
            setTrendingMovies(data.results.slice(0, 20));
        } catch (error) {
            console.log(`Error fetching trending movies: ${error}`);
        }
    };

    const fetchTrendingTVShows = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/trending/tv/day?page=1`, API_OPTIONS);
            if (!response.ok) throw new Error('Could not fetch trending TV shows');
            const data = await response.json();
            setTrendingTVShows(data.results.slice(0, 20));
        } catch (error) {
            console.log(`Error fetching trending TV shows: ${error}`);
        }
    };

    const fetchTopRatedMovies = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/movie/top_rated?page=1`, API_OPTIONS);
            if (!response.ok) throw new Error('Could not fetch top rated movies');
            const data = await response.json();
            setTopRatedMovies(data.results.slice(0, 20));
        } catch (error) {
            console.log(`Error fetching top rated movies: ${error}`);
        }
    };

    const fetchUpcomingMovies = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/movie/upcoming?page=1`, API_OPTIONS);
            if (!response.ok) throw new Error('Could not fetch upcoming movies');
            const data = await response.json();
            setUpcomingMovies(data.results.slice(0, 20));
        } catch (error) {
            console.log(`Error fetching upcoming movies: ${error}`);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            fetchTrendingMovies(),
            fetchTrendingTVShows(),
            fetchTopRatedMovies(),
            fetchUpcomingMovies(),
        ]).finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="bg-dark-100 text-light-100">
            {/* Hero Section */}
            <section className="hero-section relative h-[600px] flex items-end pb-16">
                {featuredContent && (
                    <div
                        className="absolute inset-0 bg-cover bg-top"
                        style={{
                            backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredContent.backdrop_path})`,
                        }}
                    ></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-dark-100/80 to-transparent"></div>
                <div className="relative z-10 container mx-auto px-4">
                    <div className="max-w-3xl">
                        <p className="text-5xl font-bold mb-4">
                            {featuredContent?.title || featuredContent?.name}
                        </p>
                        <p className="text-light-200 text-lg mb-6">
                            {featuredContent?.overview}
                        </p>
                        <div className="flex gap-4">
                            <Link
                                to={`/movie/${featuredContent?.id}`}
                                className="px-6 py-2 bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trending Movies */}
            <section className="container mx-auto px-4 py-8 relative">
                <h2 className="text-2xl font-bold mb-6">Trending Movies</h2>

                {/* Scroll Left Button */}
                <button
                    onClick={() => {
                        const container = document.querySelector('.trending-movies-container');
                        scrollContainer('left', container);
                    }}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-75 text-white p-2 rounded-full z-10"
                >
                    &lt;
                </button>

                {/* Scroll Right Button */}
                <button
                    onClick={() => {
                        const container = document.querySelector('.trending-movies-container');
                        scrollContainer('right', container);
                    }}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-75 text-white p-2 rounded-full z-10"
                >
                    &gt;
                </button>

                <div className="flex overflow-x-auto gap-4 pb-4 trending-movies-container hide-scrollbar">
                    {trendingMovies.map((movie) => (
                        <Link
                            to={`/movie/${movie.id}`}
                            key={movie.id}
                            className="flex-shrink-0 w-40 hover:scale-105 transition-transform"
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full h-56 object-cover rounded-lg"
                            />
                            <p className="mt-2 text-sm text-light-200">{movie.title}</p>
                            <div className="flex gap-2">
                                <img src="star.svg" alt="star" />
                                <p>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
                                <span>•</span>
                                <p className="capitalize text-gray-100 font-medium text-base">{movie.original_language}</p>

                                <span>•</span>
                                <p className="text-gray-100 font-medium text-base">
                                    {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Trending TV Shows */}
            <section className="container mx-auto px-4 py-8 relative">
                <h2 className="text-2xl font-bold mb-6">Trending TV Shows</h2>

                {/* Scroll Left Button */}
                <button
                    onClick={() => {
                        const container = document.querySelector('.trending-tvshows-container');
                        scrollContainer('left', container);
                    }}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-75 text-white p-2 rounded-full z-10"
                >
                    &lt;
                </button>

                {/* Scroll Right Button */}
                <button
                    onClick={() => {
                        const container = document.querySelector('.trending-tvshows-container');
                        scrollContainer('right', container);
                    }}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-75 text-white p-2 rounded-full z-10"
                >
                    &gt;
                </button>

                <div className="flex overflow-x-auto gap-4 pb-4 trending-tvshows-container hide-scrollbar">
                    {trendingTVShows.map((tvShow) => (
                        <Link
                            to={`/tv/${tvShow.id}`}
                            key={tvShow.id}
                            className="flex-shrink-0 w-40 hover:scale-105 transition-transform"
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w300${tvShow.poster_path}`}
                                alt={tvShow.name}
                                className="w-full h-56 object-cover rounded-lg"
                            />
                            <p className="mt-2 text-sm text-light-200">{tvShow.name}</p>
                            <div className="flex gap-2">
                                <img src="star.svg" alt="star" />
                                <p>{tvShow.vote_average ? tvShow.vote_average.toFixed(1) : 'N/A'}</p>
                                <span>•</span>
                                <p className="capitalize text-gray-100 font-medium text-base">{tvShow.original_language}</p>

                                <span>•</span>
                                <p className="text-gray-100 font-medium text-base">
                                    {tvShow.first_air_date ? tvShow.first_air_date.split('-')[0] : 'N/A'}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Top Rated Movies */}
            <section className="container mx-auto px-4 py-8 relative">
                <h2 className="text-2xl font-bold mb-6">Top Rated Movies</h2>

                {/* Scroll Left Button */}
                <button
                    onClick={() => {
                        const container = document.querySelector('.top-rated-movies-container');
                        scrollContainer('left', container);
                    }}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-75 text-white p-2 rounded-full z-10"
                >
                    &lt;
                </button>

                {/* Scroll Right Button */}
                <button
                    onClick={() => {
                        const container = document.querySelector('.top-rated-movies-container');
                        scrollContainer('right', container);
                    }}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-75 text-white p-2 rounded-full z-10"
                >
                    &gt;
                </button>

                <div className="flex overflow-x-auto gap-4 pb-4 top-rated-movies-container hide-scrollbar">
                    {topRatedMovies.map((movie) => (
                        <Link
                            to={`/movie/${movie.id}`}
                            key={movie.id}
                            className="flex-shrink-0 w-40 hover:scale-105 transition-transform"
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full h-56 object-cover rounded-lg"
                            />
                            <p className="mt-2 text-sm text-light-200">{movie.title}</p>
                            <div className="flex gap-2">
                                <img src="star.svg" alt="star" />
                                <p>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
                                <span>•</span>
                                <p className="capitalize text-gray-100 font-medium text-base">{movie.original_language}</p>

                                <span>•</span>
                                <p className="text-gray-100 font-medium text-base">
                                    {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Upcoming Movies */}
            <section className="container mx-auto px-4 py-8 relative">
                <h2 className="text-2xl font-bold mb-6">Coming Soon</h2>

                {/* Scroll Left Button */}
                <button
                    onClick={() => {
                        const container = document.querySelector('.upcoming-movies-container');
                        scrollContainer('left', container);
                    }}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-75 text-white p-2 rounded-full z-10"
                >
                    &lt;
                </button>

                {/* Scroll Right Button */}
                <button
                    onClick={() => {
                        const container = document.querySelector('.upcoming-movies-container');
                        scrollContainer('right', container);
                    }}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-75 text-white p-2 rounded-full z-10"
                >
                    &gt;
                </button>

                <div className="flex overflow-x-auto gap-4 pb-4 upcoming-movies-container hide-scrollbar">
                    {upcomingMovies.map((movie) => (
                        <Link
                            to={`/movie/${movie.id}`}
                            key={movie.id}
                            className="flex-shrink-0 w-40 hover:scale-105 transition-transform"
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full h-56 object-cover rounded-lg"
                            />
                            <p className="mt-2 text-sm text-light-200">{movie.title}</p>
                            <div className="flex gap-2">
                                <img src="star.svg" alt="star" />
                                <p>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
                                <span>•</span>
                                <p className="capitalize text-gray-100 font-medium text-base">{movie.original_language}</p>

                                <span>•</span>
                                <p className="text-gray-100 font-medium text-base">
                                    {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;