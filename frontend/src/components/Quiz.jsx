import React, { useState } from "react";
import "./Quiz.css";

function Quiz() {
  // Définir les questions et les réponses possibles
  const questions = [
    {
      id: 1,
      text: "Quelle occasion ?",
      options: ["Entre famille", "Entre amis", "Date", "Solo"],
    },
    {
      id: 2,
      text: "Quel genre de film ?",
      options: ["Action", "Comédie", "Horreur", "Romance"],
    },
    {
      id: 3,
      text: "Date de publication",
      options: ["-3 ans", "-5 ans", "-10 ans", "-20 ans", "+20 ans"],
    },
  ];

  const [quizFinished, setQuizFinished] = useState(false);
  const [randomMovie, setRandomMovie] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const fetchRandomMovie = async () => {
    const maxPages = 200;
    const randomPage = Math.floor(Math.random() * maxPages) + 1;
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=4376a0d52370c8fe44da849d510c9a86&language=fr-FR&page=${randomPage}`
    );
    const data = await response.json();
    const randomIndex = Math.floor(Math.random() * data.results.length);
    const movie = data.results[randomIndex];

    // Synopsis
    const detailsResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}?api_key=4376a0d52370c8fe44da849d510c9a86&language=fr-FR`
    );
    const details = await detailsResponse.json();

    // Trailer
    const videosResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=4376a0d52370c8fe44da849d510c9a86&language=fr-FR`
    );
    const videosData = await videosResponse.json();
    const trailer = videosData.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );

    return {
      ...details,
      trailer,
    };
  };

  const handleNextClick = async () => {
    if (selectedOption !== null) {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        setQuizFinished(true);
        const movie = await fetchRandomMovie();
        setRandomMovie(movie);
      }
    }
  };
  const { text, options } = questions[currentQuestion];

  return quizFinished && randomMovie ? (
    <div className="random-movie">
      <h2 className="tittle">{randomMovie.title}</h2>
      <img
        className="img"
        src={`https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`}
        alt={`${randomMovie.title} poster`}
      />
      <div className="movie-details">
        <p className="synopsis">{randomMovie.overview}</p>
        {randomMovie.trailer && (
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${randomMovie.trailer.key}`}
            title={`${randomMovie.title} Trailer`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  ) : (
    <form className="questionaire">
      <h2 className="Question">{text}</h2>
      <ul>
        {options.map((option) => (
          <li key={option}>
            <input
              type="radio"
              id={option}
              name="option"
              value={option}
              checked={selectedOption === option}
              onChange={() => handleOptionChange(option)}
            />
            <label htmlFor={option}>{option}</label>
          </li>
        ))}
      </ul>
      {currentQuestion === questions.length - 1 ? (
        <button type="button" className="button" onClick={handleNextClick}>
          Valider
        </button>
      ) : (
        <button type="button" className="button" onClick={handleNextClick}>
          Question suivante
        </button>
      )}
    </form>
  );
}

export default Quiz;
