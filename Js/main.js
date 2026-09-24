let pokemons = [];

const displayError = (message) => {
  const error = document.createElement("p");
  error.classList.add("red");
  error.textContent = message;
  document.body.appendChild(error);
};

const getFavoris = () => {
  return JSON.parse(localStorage.getItem("favoris")) || [];
};

const estFavori = (nom) => {
  return getFavoris().some((favori) => favori.name === nom);
};

const toggleFavori = (pokemon) => {
  let favoris = getFavoris();
  if (estFavori(pokemon.name)) {
    favoris = favoris.filter((favori) => favori.name !== pokemon.name);
  } else {
    favoris.push(pokemon);
  }
  localStorage.setItem("favoris", JSON.stringify(favoris));
  return estFavori(pokemon.name);
};

const creerCarte = (pokemon, favorisPage) => {
  const template = document.getElementById("carte-pokemon");
  const clone = template.content.cloneNode(true);

  const img = clone.querySelector("img");
  img.src = pokemon.imageUrl;
  img.alt = pokemon.name;
  clone.querySelector("h2").textContent = pokemon.name;

  const imgPoke = clone.querySelector(".poke");
  imgPoke.src = estFavori(pokemon.name)
    ? "../Images/pokeball2.png"
    : "../Images/pokeball.png";

  imgPoke.addEventListener("click", () => {
    const ajoute = toggleFavori(pokemon);
    if (favorisPage) {
      afficherFavoris();
    } else {
      imgPoke.src = ajoute
        ? "../Images/pokeball2.png"
        : "../Images/pokeball.png";
    }
  });

  return clone;
};

const afficherPokemon = (liste) => {
  let elements = document.querySelector("main");
  if (!elements) {
    elements = document.createElement("main");
    document.body.appendChild(elements);
  }
  elements.innerHTML = "";

  liste.forEach((element) => {
    const id = element.url.split("/").filter(Boolean).pop();
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    const pokemon = { name: element.name, id, imageUrl };
    elements.appendChild(creerCarte(pokemon, false));
  });
};

const afficherFavoris = () => {
  let elements = document.querySelector("main");
  if (!elements) {
    elements = document.createElement("main");
    document.body.appendChild(elements);
  }
  elements.innerHTML = "";

  const favoris = getFavoris();

  if (favoris.length === 0) {
    const message = document.createElement("p");
    message.textContent = "Tu n'as pas encore de favoris.";
    elements.appendChild(message);
    return;
  }

  favoris.forEach((pokemon) => {
    elements.appendChild(creerCarte(pokemon, true));
  });
};

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

if (document.getElementById("recherche")) {
  getData();
} else {
  afficherFavoris();
}