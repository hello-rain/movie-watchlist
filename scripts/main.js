document
  .querySelector("#film-form")
  .addEventListener("submit", handleFilmSearch);

function renderError(message) {
  document.querySelector(".film-results-container").innerHTML = `
  <p class="state-message">${message}</p>`;
}

// Fetch film data from OMDB API based on user input
async function fetchFilmResults(filmInput) {
  try {
    // Make a request to the OMDB API with the search query
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=efde29a&s=${filmInput}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();

    // If the API returns no results, show an error message and exit
    if (data.Response === "False") {
      const message =
        "Unable to find what you’re looking for. Please try another search.";
      renderError(message);
      return;
    }
    // Render the list of films if results are found
    renderFilmResults(data.Search);
  } catch (error) {
    console.error(error);
    const message = "Error fetching data.";
    renderError(message);
  }
}

// Handle form submission for searching films
function handleFilmSearch(e) {
  e.preventDefault(); // Prevent default form submission
  const filmInput = document.querySelector("#film-input").value.trim();
  if (filmInput) {
    console.log(filmInput);
    fetchFilmResults(filmInput);
  }
}
