import React, {useEffect, useState} from 'react';
import Search from "../components/Search.jsx";
import Spinner from "../components/Spinner.jsx";
import MovieCard from "../components/MovieCard.jsx";
import {useDebounce} from "react-use";
import { Link } from 'react-router-dom';


const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        authorization: `Bearer ${API_KEY}`,
    }
}

const Home = () => {


    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    //debounce the search to optimize the API Call
    useDebounce( () => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

    //fetching movie data from api
    const fetchMovies = async ( query = '', page = 1) => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;
            const response = await fetch(endpoint, API_OPTIONS);

            if(!response.ok) {
                throw new Error("Could not fetch movies");
            }
            const data = await response.json();

            if(data.Response === false) {
                setErrorMessage('Could not fetch movies');
                setMovieList([]);
                return;
            }

            // Update movie list and total pages
            setMovieList(data.results);
            setTotalPages(data.total_pages); // Set total pages from API response

        }catch (error) {
            console.log(`Error fetching movies: ${error}`);
            setErrorMessage('Could not fetch movies. Please try again later.');
        }finally {
            setIsLoading(false);
        }
    }



    useEffect(() => {
        fetchMovies(debounceSearchTerm, page);
    }, [debounceSearchTerm, page]);

    const handlePageClick = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };


    // Generate page numbers to display
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
        <main>

            <div className="pattern" />

            <div className="wrapper">
                <header>
                    <img src="./hero.png" alt="Hero Banner" />
                    <h1>Find <span className="text-gradient">Movies</span> You will Enjoy Without The Hassle</h1>

                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                <section className="all-movies">
                    <h2 className="mt-[20px]">All Movies</h2>

                    { isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul>
                            {movieList
                                .map((movie) => (
                                    <Link to={`/movie/${movie.id}`} key={movie.id}> {/* Wrap MovieCard in Link */}
                                        <MovieCard movie={movie} />
                                    </Link>
                                ))}
                        </ul>
                    )}

                    {/* Pagination Controls */}
                    <div className="pagination">
                        <button
                            onClick={() => handlePageClick(page - 1)}
                            disabled={page === 1 || isLoading}
                            className="pagination-button"
                        >
                            Previous
                        </button>

                        {/* Page Numbers */}
                        {generatePageNumbers().map((pageNumber) => (
                            <button
                                key={pageNumber}
                                onClick={() => handlePageClick(pageNumber)}
                                disabled={pageNumber === page || isLoading}
                                className={`pagination-button ${pageNumber === page ? 'active' : ''}`}
                            >
                                {pageNumber}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageClick(page + 1)}
                            disabled={page === totalPages || isLoading}
                            className="pagination-button"
                        >
                            Next
                        </button>
                    </div>
                </section>
            </div>
        </main>
    )
};

export default Home;
