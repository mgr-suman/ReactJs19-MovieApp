import React from 'react'
import Search from './components/Search.jsx'
import { useEffect, useState } from 'react';
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import { useDebounce } from 'react-use';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [movieList, setMovieList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [debounceSearchTerm, setdebounceSearchTerm] = useState("");
//install the dependencies using npm -i reaact-use
  //Debounce the search term to prevent making too many API requests
  //by waiting for the user to stop typing for 1 second
  useDebounce(() => setdebounceSearchTerm(searchTerm), 1000, [searchTerm]);

  /**
   * Fetches a list of movies from the external API.
   * Uses the API base URL and authorization token set in the environment.
   * Handles any errors that occur during the fetch operation.
   * 
   * 

This code fetches a list of movies from an external API, either by searching with a query or by retrieving popular movies. It handles errors, updates the UI with loading and error states, and sets the movie list in the component's state.
   * 
   */
  const fetchMovies = async (query = '') => {

    setIsLoading(true);
    setErrorMessage('');


    /**
     * Fetches a list of movies from the external API.
     * Handles any errors that occur during the fetch operation.
     */
    try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${query}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);


      if (!response.ok) {
        throw new Error('Failed to fetch movies.');
      }
      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'faild to fetch movies');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || [])

    } catch (error) {
      // Handle any errors that occur
      console.log(`Error featching movies: ${error}`);
      setErrorMessage('Error featching movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
    fetchMovies(debounceSearchTerm);

  }, [debounceSearchTerm]);
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header className="">
          <img src="./hero.png" alt="Heor Banner" />
          <h1>Find <span className="text-gradient">Movies</span>You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className='mt-[40px]'>All Movies</h2>

          {isLoading ? (
            <p className='text-white'><Spinner /></p>
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard  key={movie.id} movie={movie}/>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App