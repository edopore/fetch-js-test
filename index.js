const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

const OPTIONS = {};
const QUERY_PARAMS = {
  limit: 10,
  offset: 0,
  pagesTotal: 0,
  pageCounter: 1,
  selector: [10, 20, 30, 50, 100],
};

const pokeList = document.getElementById("poke-list");
const previousButton = document.querySelector("button[previous-btn]");
const nextButton = document.querySelector("button[next-btn]");
const selectView = document.getElementById("view-selector");

QUERY_PARAMS.selector.map((value) => {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = value;
  selectView.append(option);
});

function checkBtnPage() {
  if (QUERY_PARAMS.offset === 0) {
    previousButton.setAttribute("disabled", "");
    nextButton.removeAttribute("disabled");
  } else if (QUERY_PARAMS.offset >= 1300) {
    nextButton.setAttribute("disabled", "");
  } else {
    nextButton.removeAttribute("disabled");
    previousButton.removeAttribute("disabled");
  }
}

function fetchPokemonInfo(url) {
  removePokemons();
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const pokeItem = document.createElement("li");
      const image = document.createElement("img");
      const pokemonName = document.createElement("p");
      pokeItem.setAttribute("class", "pokemon-item");
      image.src = data.sprites.front_default;
      pokemonName.textContent = data.name;
      pokeItem.append(image, pokemonName);
      pokeList.append(pokeItem);
    });
}

function fetchpokemons(limit, offset) {
  fetch(BASE_URL + `?limit=${limit}&offset=${offset}`, OPTIONS)
    .then((response) => response.json())
    .then((data) => {
      QUERY_PARAMS.pagesTotal = Math.ceil(
        parseInt(data.count) / QUERY_PARAMS.limit
      );
      checkBtnPage();
      data.results.forEach((element) => {
        fetchPokemonInfo(element.url);
      });
    })
    .catch((error) => console.error(error));
}

selectView.addEventListener("change", () => {
  QUERY_PARAMS.limit = parseInt(selectView.value);
  fetchpokemons(QUERY_PARAMS.limit, QUERY_PARAMS.offset);
});

nextButton.addEventListener("click", (event) => {
  event.preventDefault();
  QUERY_PARAMS.offset += QUERY_PARAMS.limit;
  fetchpokemons(QUERY_PARAMS.limit, QUERY_PARAMS.offset);
});
previousButton.addEventListener("click", (event) => {
  event.preventDefault();
  QUERY_PARAMS.offset -= QUERY_PARAMS.limit;
  fetchpokemons(QUERY_PARAMS.limit, QUERY_PARAMS.offset);
});

function removePokemons() {
  while (pokeList.firstChild) {
    pokeList.removeChild(pokeList.firstChild);
  }
}

fetchpokemons(QUERY_PARAMS.limit, QUERY_PARAMS.offset);
