import { useState, useEffect } from "react";
import search from "./assets/search.svg";
import MovieCard from "./MovieCard.jsx";
import RightButton from "./assets/right.svg";
import LeftButton from "./assets/left.svg";

function MovieHome() {
  const [movies, setMovies] = useState([]);
  const [displayValue, setDisplayValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const API_Url = "https://www.omdbapi.com?apikey=b6003d8a";

  const searchMovie = async (title, page) => {
    const response = await fetch(`${API_Url}&s=${title}&page=${page}`);
    const data = await response.json();
    console.log(data, `${API_Url}&s=${title}&page=${page}`);
    setMovies(data.Search || []);
    setTotalResults(data.totalResults || 0);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const sanitizedValue = inputValue.replace(/\s/g, "%20");
    setSearchTerm(sanitizedValue);
    setDisplayValue(inputValue);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    searchMovie(searchTerm, newPage); // Use searchTerm instead of trimmedSearchTerm
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage * 10 < totalResults) {
      handlePageChange(currentPage + 1);
    }
  };

  useEffect(() => {
    searchMovie("superman", currentPage);
  }, [currentPage]); // Trigger API call when currentPage changes

  return (
    <>
      <div className="app">
        <h1>Movie World</h1>

        <div className="search">
          <input
            type="text"
            placeholder="Search For Movie"
            value={displayValue}
            onChange={handleInputChange}
          />
          <img
            src={search}
            alt="search"
            onClick={() => handlePageChange(1)} // Reset to page 1 on new search
          />
        </div>
        {movies?.length > 0 ? (
          <div className="container">
            {movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h2>No Movies found</h2>
          </div>
        )}

        {totalResults > 10 && (
          <div className="pagination">
            <img
              src={LeftButton}
              alt="Previous"
              onClick={handlePreviousPage}
              className={currentPage === 1 ? "disabled" : ""}
            />
            <span>{`Page ${currentPage}`}</span>
            <img
              src={RightButton}
              alt="Next"
              onClick={handleNextPage}
              className={currentPage * 10 >= totalResults ? "disabled" : ""}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default MovieHome;
