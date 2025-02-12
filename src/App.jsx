import React, {useEffect, useState} from 'react';
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import {useDebounce} from "react-use";


const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        authorization: `Bearer ${API_KEY}`,
    }
}

const App = () => {

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
                                <MovieCard key={movie.id} movie={movie}/>
                            ))}
                        </ul>
                    )}

                    <div className="pagination">
                        <button
                            onClick={ () => {
                                if(page > 1) {
                                    setPage( prev => prev - 1);
                                }
                            }}
                            disabled={page === 1 || isLoading}
                            className="pagination-button"
                        >
                            Previous
                        </button>
                        <span className="page-number">Page {page} of {totalPages}</span>
                        <button
                            onClick={ () => {
                                if(page < totalPages) {
                                    setPage( prev => prev + 1);
                                }
                            }}
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

export default App;