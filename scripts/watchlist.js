// 1. Event listeners / entry point

function init() {
  renderWatchlist();
}

// 2. Main handler/controller functions

// 3. Rendering/UI functions

async function renderWatchlist() {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const filmsContainer = document.querySelector(".films-container");

  //   Render empty state when watchlist is empty
  if (watchlist.length === 0) {
    filmsContainer.innerHTML = `
        <p class="state-message">Your watchlist is looking a little empty...</p>
        <a href="index.html" class="redirect-to-movies">
            <img src="assets/icons/watchlist-add.svg" alt="" aria-hidden="true" />
            <span>Browse Movies</span>
        </a>
    `;
  } else {
    // Fetch details for all films in the watchlist
    const filmDetails = await Promise.all(
      watchlist.map((imdbID) => fetchFilmDetail(imdbID))
    );

    // Generate HTML for each film in the watchlist
    filmsContainer.innerHTML = filmDetails
      .map((film) => generateFilmCardHTML(film))
      .join("");

    // Render film details
  }
}

// 4. Helper/utility functions
// Fetch full details for a single film by IMDb ID
async function fetchFilmDetail(imdbID) {
  try {
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=efde29a&i&i=${imdbID}`
    );
    if (!response.ok) {
      const message = "Network response was not ok";
      renderError(message);
      throw new Error(message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const message = "Error fetching data";
    renderError(message);
    console.log(error);
  }
}

init();
