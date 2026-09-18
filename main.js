let pokemons = [];
const displayError = (message) => {
  const error = document.createElement("p");
  error.classList.add("red");
  error.textContent = message;
  document.body.appendChild(error);
};

const afficherPokemon = (liste) => {
  let content = "";
  liste.forEach((element) => {
    const id = element.url.split("/").filter(Boolean).pop();
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    content += `
    <div class ="carte">
      <img src="${imageUrl}" alt="${element.name}">
      <h2>${element.name}</h2>
    </div>
  `;
  });

  let elements = document.querySelector("main");
  if (!elements) {
    elements = document.createElement("main");
    document.body.appendChild(elements);
  }
  elements.innerHTML = content;
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
