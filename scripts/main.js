document
  .querySelector("#film-form")
  .addEventListener("submit", handleFilmSearch);

// Handle form submission for searching films
function handleFilmSearch(e) {
  e.preventDefault(); // Prevent default form submission
  const filmInput = document.querySelector("#film-input").value.trim(); 
  if (filmInput) {
    console.log(filmInput);
    fetchFilmResults(filmInput);
  }
}
