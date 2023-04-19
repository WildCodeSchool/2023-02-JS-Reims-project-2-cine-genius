import React, { useState, useEffect } from "react";
import "./Quiz.css";

function Quiz() {
  const [fetchedData, setFetchedData] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [randomMovie, setRandomMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5001/questions")
      .then((response) => response.json())
      .then((data) => {
        setFetchedData(data);
      });
  }, []);

  const fetchRandomMovie = async () => {
    const maxPages = 500;
    const randomPage = Math.floor(Math.random() * maxPages) + 1;

    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=4376a0d52370c8fe44da849d510c9a86&language=fr-FR&page=${randomPage}`
    );
    const data = await response.json();
    const randomIndex = Math.floor(Math.random() * data.results.length);
    const movie = data.results[randomIndex];

    setRandomMovie(movie);

    const trailerResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=4376a0d52370c8fe44da849d510c9a86&language=fr-FR`
    );
    const trailerData = await trailerResponse.json();

    const movieTrailer = trailerData.results.find(
      (video) => video.type === "Trailer"
    );

    setTrailer(movieTrailer);
  };

  const currentQuestion = fetchedData.find(
    (question) => question.id === currentQuestionId
  );

  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      if (currentQuestionId === 3) {
        fetchRandomMovie();
      } else {
        setCurrentQuestionId(currentQuestionId + 1);
      }
      setSelectedOption(null);
    }
  };

  return (
    <>
      <form className="questionaire">
        {currentQuestion != null && (
          <>
            <h2 className="Question">{currentQuestion.name}</h2>
            <ul>
              {currentQuestion.options.map((option) => (
                <li key={option.id}>
                  <input
                    type="radio"
                    id={`${option.id}`}
                    name={`${currentQuestion.id}`}
                    value={option.value}
                    onChange={() => setSelectedOption(option.value)}
                  />
                  <label htmlFor={`${option.id}`}>{option.value}</label>
                </li>
              ))}
            </ul>
            {currentQuestionId === 3 ? (
              <button
                type="button"
                className="button"
                onClick={handleNextQuestion}
              >
                Valider
              </button>
            ) : (
              <button
                type="button"
                className="button"
                onClick={handleNextQuestion}
              >
                Question suivante
              </button>
            )}
          </>
        )}
      </form>
      {randomMovie && (
        <div className="movie-details">
          <h2 className="tittle">{randomMovie.title}</h2>
          <img
            className="img"
            src={`https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`}
            alt={randomMovie.title}
          />
          <p className="synopsis">{randomMovie.overview}</p>
        </div>
      )}
      {trailer && (
        <div>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${trailer.key}`}
            title={`${randomMovie.title} Trailer`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </>
  );
}

export default Quiz;
