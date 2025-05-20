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
  // Fetch details for all films
  const filmDetails = await Promise.all(
    films.map((film) => fetchFilmDetail(film.imdbID))
  );

  // Generate HTML for each film
  const filmCardsHTML = filmDetails
    .map((film) => generateFilmCardHTML(film))
    .join("");

  document.querySelector(".films-container").innerHTML = `
  <div class="films">${filmCardsHTML}</div>
  `;
}

function renderError(message) {
  document.querySelector(".films-container").innerHTML = `
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
    return data;
  } catch (error) {
    const message = "Error fetching data.";
    renderError(message);
    console.log(error);
  }
}

function generateFilmCardHTML(film) {
  return `
  <div class="film">
    <img src="${film.Poster}" alt="${film.Title} poster" class="film-poster"/>
    <div class="film-details">
      <div class="film-header">
        <h3 class="film-title">${film.Title}</h3>
        <span class="film-meta">
        <img src="assets/icons/rating.svg">
        ${film.imdbRating}
        </span>
      </div>
      <div class="film-meta-group">
        <span class="film-meta">${film.Runtime}</span>
        <span class="film-meta">${film.Genre}</span>
        <button
          type="button"
          class="add-to-watchlist-btn"
          aria-label="Add ${film.Title} to watchlist"
          data-imdbid="${film.imdbID}"
        >
          <span class="add-to-watchlist-icon" aria-hidden="true">
            <img src="assets/icons/watchlist-add.svg">
          </span>
          Watchlist
        </button>
      </div>
      <p class="film-plot">${film.Plot}</p>
    </div>
  </div>
`;
}
