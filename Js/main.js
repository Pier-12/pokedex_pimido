let pokemons = [];
const displayError = (message) => {
  const error = document.createElement("p");
  error.classList.add("red");
  error.textContent = message;
  document.body.appendChild(error);
};

const afficherPokemon = (liste) => {
  let elements = document.querySelector("main");
  if (!elements) {
    elements = document.createElement("main");
    document.body.appendChild(elements);
  }
  elements.innerHTML = "";

  const template = document.getElementById("carte-pokemon");

  liste.forEach((element) => {
    const id = element.url.split("/").filter(Boolean).pop();
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    const clone = template.content.cloneNode(true);
    const img = clone.querySelector("img");
    img.src = imageUrl;
    img.alt = element.name;
    clone.querySelector("h2").textContent = element.name;

    elements.appendChild(clone);
  });
};

// Création d'une fonction qui appel l'API
const getData = async () => {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=151",
  ).catch((error) => {
    console.error("Error:", error);
    displayError("Une erreur est survenue");
  });

  if (response.status < 300) {
    const data = await response.json();
    pokemons = data.results;

    afficherPokemon(pokemons);

    let recherche = document.getElementById("recherche");
    recherche.addEventListener("input", (event) => {
      const texte = event.target.value.toLowerCase();
      const filtres = pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(texte),
      );
      afficherPokemon(filtres);
    });
  } else {
    displayError("Une erreur est survenue");
  }
};

getData();
