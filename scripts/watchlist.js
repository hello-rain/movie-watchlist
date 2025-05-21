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
    // Fetch film details
    const filmDetails = await Promise.all(
      watchlist.map((imdbID) => fetchFilmDetail(imdbID))
    );

    filmsContainer.innerHTML = filmDetails
      .map((film) => generateFilmCardHTML(film))
      .join("");

    console.log(filmDetails);
    // Render film details
  }
}

init();
