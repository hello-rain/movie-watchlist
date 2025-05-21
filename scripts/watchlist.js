// 1. Event listeners / entry point

function init() {
  renderWatchlist();

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("read-more-btn")) {
      renderFullPlot(e);
    } else if (e.target.classList.contains("remove-from-watchlist-btn")) {
      removeFromWatchlist(e);
    }
  });
}

// 2. Main handler/controller functions
function removeFromWatchlist(e) {
  const imdbID = e.target.getAttribute("data-imdbid");
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  watchlist = watchlist.filter((id) => id != imdbID);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  renderWatchlist();
}

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
  }
}

function renderFullPlot(e) {
  const plotEl = e.target.closest(".film-plot");
  if (plotEl) {
    plotEl.textContent = plotEl.getAttribute("data-fullplot");
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

function generateFilmCardHTML(film) {
  const charLimit = 130;
  const isLong = film.Plot.length > charLimit;
  const shortPlot = isLong ? film.Plot.slice(0, charLimit) + "..." : film.Plot;

  return `
  <div class="film">
    <img src="${film.Poster}" alt="${film.Title} poster" class="film-poster"/>
    <div class="film-details">
      <div class="film-header">
        <h3 class="film-title">${film.Title}</h3>
        <span>
        <img src="assets/icons/rating.svg">
        ${film.imdbRating}
        </span>
      </div>
      <div class="film-meta-group">
        <span>${film.Runtime}</span>
        <span>${film.Genre}</span>
        <button
          type="button"
          class="watchlist-btn remove-from-watchlist-btn"
          aria-label="Remove ${film.Title} to watchlist"
          data-imdbid="${film.imdbID}"
        >
          <span aria-hidden="true">
            <img src="assets/icons/watchlist-remove.svg">
          </span>
          Remove
        </button>
      </div>
      <p class="film-plot" data-fullplot="${film.Plot.replace(/"/g, "&quot;")}">
      ${shortPlot}
      ${
        isLong
          ? `<button class="read-more-btn" type="button">Read more</button> `
          : ""
      }
      </p>
    </div>
  </div>
`;
}
init();
