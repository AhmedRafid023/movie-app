import React, { useEffect, useState } from 'react';
import Search from '../components/Search.jsx';
import Spinner from '../components/Spinner.jsx';
import TVShowCard from '../components/TVShowCard.jsx';
import { useDebounce } from 'react-use';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        authorization: `Bearer ${API_KEY}`,
    },
};

const TvShows = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [tvShowList, setTvShowList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [featuredContent, setFeaturedContent] = useState(null);

    // Debounce the search to optimize the API call
    useDebounce(() => {
        setDebounceSearchTerm(searchTerm);
        setPage(1);
    },
        500, [searchTerm]);

    // Scroll to top when the page changes
    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top of the page
    }, [page]);

    const fetchFeaturedContent = async () => {
        try {
            // Fetch popular TV shows
            const response = await fetch(`${API_BASE_URL}/trending/tv/day?page=1`, API_OPTIONS);
            if (!response.ok) throw new Error("Could not fetch featured content");
            const data = await response.json();

            // Set the first popular TV show as featured content
            setFeaturedContent(data.results[0]);
        } catch (error) {
            console.log(`Error fetching featured content: ${error}`);
        }
    };

    // Fetch TV shows from the API
    const fetchTvShows = async (query = '', page = 1) => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const endpoint = query
                ? `${API_BASE_URL}/search/tv?query=${encodeURIComponent(query)}&page=${page}`
                : `${API_BASE_URL}/trending/tv/day?page=${page}`;
            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error('Could not fetch TV shows');
            }
            const data = await response.json();

            if (data.results.length === 0) {
                setErrorMessage('No TV shows found.');
                setTvShowList([]);
                return;
            }

            // Update TV show list and total pages
            setTvShowList(data.results);
            setTotalPages(data.total_pages);

        } catch (error) {
            console.log(`Error fetching TV shows: ${error}`);
            setErrorMessage('Could not fetch TV shows. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch TV shows on component mount or when debounced search term/page changes
    useEffect(() => {
        fetchTvShows(debounceSearchTerm, page);
        fetchFeaturedContent();
    }, [debounceSearchTerm, page]);

    // Handle pagination
    const handlePageClick = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    // Generate page numbers for pagination
    const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5; // Number of visible page buttons
        let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <main className="bg-dark-100 text-light-100">
            {/* Hero Section */}
            <section className="hero-section relative h-[600px] flex items-end pb-16">
                {featuredContent && (
                    <div
                        className="absolute inset-0 bg-cover bg-top opacity-90"
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
                        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    </div>
                </div>
            </section>

            {/* TV Show List Section */}
            <section className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-6">All TV Shows</h2>
                {isLoading ? (
                    <Spinner />
                ) : errorMessage ? (
                    <p className="text-red-500">{errorMessage}</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {tvShowList.map((tvShow) => (
                            <Link to={`/tv/${tvShow.id}`} key={tvShow.id}>
                                <TVShowCard tvShow={tvShow} />
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="flex justify-center gap-2 mt-8">
                    <button
                        onClick={() => handlePageClick(page - 1)}
                        disabled={page === 1 || isLoading}
                        className="px-4 py-2 bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
                    >
                        Previous
                    </button>

                    {/* Page Numbers */}
                    {generatePageNumbers().map((pageNumber) => (
                        <button
                            key={pageNumber}
                            onClick={() => handlePageClick(pageNumber)}
                            disabled={pageNumber === page || isLoading}
                            className={`px-4 py-2 rounded-lg ${
                                pageNumber === page
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-dark-200 hover:bg-dark-300'
                            } transition-colors`}
                        >
                            {pageNumber}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageClick(page + 1)}
                        disabled={page === totalPages || isLoading}
                        className="px-4 py-2 bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </section>
        </main>
    );
};

export default TvShows;