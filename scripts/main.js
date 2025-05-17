document
  .querySelector("#film-form")
  .addEventListener("submit", handleFilmSearch);

// Fetch film data from OMDB API
async function fetchFilmResults(filmInput) {
  try {
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=efde29a&s=${filmInput}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    console.log(data);
    renderFilmResults();
  } catch (error) {
    const message =
      "Unable to find what you’re looking for. Please try another search.";
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
