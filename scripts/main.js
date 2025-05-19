// 1. Event listeners / entry point

document
  .querySelector("#film-form")
  .addEventListener("submit", handleFilmSearch);

// 2. Main handler/controller functions

// Handle form submission for searching films
function handleFilmSearch(e) {
  e.preventDefault(); // Prevent default form submission
  const filmInput = document.querySelector("#film-input").value.trim();
  if (filmInput) {
    console.log(filmInput);
    fetchFilms(filmInput);
  }
}

// 3. Rendering/UI functions
// Display detailed film information
async function renderFilms(films) {
  //   (10) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]0: {Title: 'Hello, My Name Is Doris', Year: '2015', imdbID: 'tt3766394', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BNDYwMmEwNm…TlmMmQtM2M3NTFmODQyOTAyXkEyXkFqcGc@._V1_SX300.jpg'}1: {Title: 'Hello, Dolly!', Year: '1969', imdbID: 'tt0064418', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BODk3MmYzOW…WJjM2EtMDEzZjc3NDYxYWI4XkEyXkFqcGc@._V1_SX300.jpg'}2: {Title: 'Hello Mini', Year: '2019–', imdbID: 'tt9454892', Type: 'series', Poster: 'https://m.media-amazon.com/images/M/MV5BNWMyNGRhZW…WFmNGUtMmJjYzExZWE3YTk2XkEyXkFqcGc@._V1_SX300.jpg'}3: {Title: 'Hello Ladies', Year: '2013–2014', imdbID: 'tt2378794', Type: 'series', Poster: 'https://m.media-amazon.com/images/M/MV5BNjYxMjI3MzY3NF5BMl5BanBnXkFtZTgwMTgyNzg3MDE@._V1_SX300.jpg'}4: {Title: 'Hello Mary Lou: Prom Night II', Year: '1987', imdbID: 'tt0093176', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BMWQxZjMwOD…WI2ZjYtZmZiNzE5NTEwOWFlXkEyXkFqcGc@._V1_SX300.jpg'}5: {Title: 'Hello Ladies: The Movie', Year: '2014', imdbID: 'tt3762944', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BNzc5MDE0MD…Tg0MGEtYjk4ODI5NWNkZmNmXkEyXkFqcGc@._V1_SX300.jpg'}6: {Title: 'Hello Tomorrow!', Year: '2023', imdbID: 'tt14596212', Type: 'series', Poster: 'https://m.media-amazon.com/images/M/MV5BODRjNDllYT…TgxYzctYzZlOTIzNjkxODRiXkEyXkFqcGc@._V1_SX300.jpg'}7: {Title: 'Hello I Must Be Going', Year: '2012', imdbID: 'tt2063666', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BMTRhNDY5Ym…WE5YjktNDdmOWI2Mzg1OTQwXkEyXkFqcGc@._V1_SX300.jpg'}8: {Title: 'Hello Ghost', Year: '2010', imdbID: 'tt1848926', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BZjkyNjZmMj…Tg3N2ItZDhmNTk2ZmUxMjMyXkEyXkFqcGc@._V1_SX300.jpg'}9: {Title: 'Hello Brother', Year: '1999', imdbID: 'tt0233856', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BNzZiZjZhY2…Tg2MDgtYmE2Mzk4Y2U5NDY2XkEyXkFqcGc@._V1_SX300.jpg'}length: 10[[Prototype]]: Array(0)

  // Fetch details for all films
  const filmDetails = await Promise.all(
    films.map((film) => fetchFilmDetail(film.imdbID))
  );

  // Generate HTML for each film
  const filmCardsHTML = filmDetails
    .map((film) => generateFilmCardHTML(film))
    .join("");

  document.querySelector(".film-results-container").innerHTML = filmCardsHTML;
}

function renderError(message) {
  document.querySelector(".film-results-container").innerHTML = `
  <p class="state-message">${message}</p>`;
}

// 4. Helper/utility functions

// Fetch a list of films from OMDb API based on user search input
async function fetchFilms(filmInput) {
  try {
    // Make a request to the OMDB API with the search query
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=efde29a&s=${filmInput}`
    );
    if (!response.ok) {
      const message = "Network response was not ok";
      renderError(message);
      throw new Error(message);
    }
    const data = await response.json();

    // If the API returns no results, show an error message and exit
    if (data.Response === "False") {
      const message =
        "Unable to find what you’re looking for. Please try another search.";
      renderError(message);
      return;
    }
    // Render the list of films if results are found
    renderFilms(data.Search);
  } catch (error) {
    const message = "Error fetching data.";
    renderError(message);
    console.error(error);
  }
}

// Fetch full details for a single film by IMDb ID
async function fetchFilmDetail(filmID) {
  try {
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=efde29a&i=${filmID}`
    );
    if (!response.ok) {
      const message = "Network response was not ok";
      renderError(message);
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    const message = "Error fetching data.";
    renderError(message);
    console.log(error);
  }
}
