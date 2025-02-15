import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner.jsx';
import MovieCard from '../components/MovieCard.jsx';
import TVShowCard from '../components/TVShowCard.jsx';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        authorization: `Bearer ${API_KEY}`,
    }
};

const Home = () => {
    const [featuredContent, setFeaturedContent] = useState(null);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch featured content (a popular movie or TV show)
    const fetchFeaturedContent = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/movie/popular?page=1`, API_OPTIONS);
            if (!response.ok) throw new Error("Could not fetch featured content");
            const data = await response.json();
            setFeaturedContent(data.results[0]); // Use the first popular movie as featured content
        } catch (error) {
            console.log(`Error fetching featured content: ${error}`);
        }
    };

    // Fetch trending movies
    const fetchTrendingMovies = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/trending/movie/day?page=1`, API_OPTIONS);
            if (!response.ok) throw new Error("Could not fetch trending movies");
            const data = await response.json();
            setTrendingMovies(data.results.slice(0, 10)); // Show top 10 trending movies
        } catch (error) {
            console.log(`Error fetching trending movies: ${error}`);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        setIsLoading(true);
        Promise.all([fetchFeaturedContent(), fetchTrendingMovies()])
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <section className="hero-section relative h-[600px] flex items-end pb-16">
            {/* Background Image */}
            {featuredContent && (
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-90"
                    style={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredContent.backdrop_path})`,
                    }}
                ></div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-dark-100/80 to-transparent"></div>

            {/* Featured Content */}
            {/*<div className="relative z-10 container mx-auto px-4">*/}
            {/*    <div className="max-w-3xl">*/}
            {/*        <h1 className="text-5xl font-bold mb-4">*/}
            {/*            {featuredContent?.title || featuredContent?.name}*/}
            {/*        </h1>*/}
            {/*        <p className="text-light-200 text-lg mb-6">*/}
            {/*            {featuredContent?.overview}*/}
            {/*        </p>*/}
            {/*        <div className="flex gap-4">*/}
            {/*            <Link*/}
            {/*                to={`/movie/${featuredContent?.id}`}*/}
            {/*                className="px-6 py-2 bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"*/}
            {/*            >*/}
            {/*                View Details*/}
            {/*            </Link>*/}
            {/*            <button*/}
            {/*                className="px-6 py-2 bg-secondary-500 rounded-lg hover:bg-secondary-600 transition-colors"*/}
            {/*                onClick={() => alert('Play trailer')}*/}
            {/*            >*/}
            {/*                Play Trailer*/}
            {/*            </button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Trending Movies */}
            <div className="absolute bottom-0 left-0 right-0 bg-dark-100/90 py-4">
                <div className="container mx-auto px-4">
                    <h2 className="text-xl font-bold mb-4">Trending Now</h2>
                    <div className="flex overflow-x-auto gap-4 pb-4">
                        {trendingMovies.map((movie) => (
                            <Link
                                to={`/movie/${movie.id}`}
                                key={movie.id}
                                className="flex-shrink-0 w-40 hover:opacity-80 transition-opacity"
                            >
                                <img
                                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-full h-56 object-cover rounded-lg"
                                />
                                <p className="mt-2 text-sm text-light-200">{movie.title}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;