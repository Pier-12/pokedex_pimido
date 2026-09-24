let allpokemon = [];

let filtreActif = "Tous";
let texteRecherche = "";

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

  clone.querySelector(".carte").dataset.id = pokemon.id;

  const img = clone.querySelector("img");
  img.src = pokemon.imageUrl;
  img.alt = pokemon.name;
  clone.querySelector("h2").textContent = pokemon.name;

  const badge = clone.querySelector(".type");
  if (pokemon.type) {
    badge.textContent = pokemon.type;
    badge.classList.add(`type-${pokemon.type}`);
  } else {
    badge.remove();
  }

  const imgPoke = clone.querySelector(".poke");
  imgPoke.src = estFavori(pokemon.name) ? "pokeball2.png" : "pokeball.png";

  imgPoke.addEventListener("click", (event) => {
    event.stopPropagation();
    const ajoute = toggleFavori(pokemon);
    if (favorisPage) {
      afficherFavoris();
    } else {
      imgPoke.src = ajoute ? "pokeball2.png" : "pokeball.png";
    }
  });

  return clone;
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

  if (!response) return;

  if (response.status < 300) {
    const data = await response.json();
    
    const details = await Promise.all(
      data.results.map((element) => fetch(element.url).then((r) => r.json())),
    );
    allpokemon.push(...details);

    afficherPokemons("Tous");
  }
  else{
    displayError("Une erreur est survenue")
  }
}

const TypesPouvoir = {
  "Normal":"normal",
  "Feu":"fire",
  "Eau":"water",
  "Plante":"grass",
  "Electrik":"electric",
  "Glace":"ice",
  "Combat":"fighting",
  "Poison":"poison",
  "Sol":"ground",
  "Vol":"flying",
  "Psy":"psychic",
  "Insecte":"bug",
  "Roche":"rock",
  "Spectre":"ghost",
  "Dragon":"dragon",
  "Fée":"fairy",
  "Acier":"steel"
};

const afficherPokemons=(filtre) => {
  filtreActif = filtre;
  let liste=allpokemon;

  if(filtre != "Tous") {
    const typeAnglais= TypesPouvoir[filtre];
    liste=allpokemon.filter(pokemon => pokemon.types.some(t => t.type.name === typeAnglais)
    );
  }

  liste = liste.filter(pokemon => pokemon.name.toLowerCase().includes(texteRecherche));

  const conteneur = document.getElementById("pokemon-list");
  conteneur.innerHTML = "";

  liste.forEach(element => {
    const imageUrl =`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${element.id}.png`

    const typeAnglais = element.types[0].type.name;
    const typeFrancais = Object.keys(TypesPouvoir).find(type => TypesPouvoir[type] === typeAnglais);

    conteneur.appendChild(creerCarte({ name: element.name, id: element.id, imageUrl, type: typeFrancais }, false));
  });
}

const boutons = document.querySelectorAll("#bouton-filtre button");
boutons.forEach(bouton => {
    bouton.addEventListener("click", () => {
        boutons.forEach(b => b.classList.remove("actif"));
        bouton.classList.add("actif");
        const filtre = bouton.getAttribute("data-filtre");
        afficherPokemons(filtre);
    });
});

const afficherDetails = (id) => {
  const pokemon = allpokemon.find(p => p.id == id);
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`

  const typesTexte = pokemon.types.map(t => t.type.name).join(",");
  const statsTexte = pokemon.stats.map(s => s.stat.name + " : " + s.base_stat).join("<br>");

  let texte =`
    <div class="details-contenu">

    <div class="details-image">
      <img src="${imageUrl}" alt="${pokemon.name}">
    </div>

    <div class="details-infos">
      <h2>${pokemon.name}</h2>

      <div class="details-type">
        ${typesTexte}
      </div>

        <p><strong>Taille :</strong> ${pokemon.height / 10} m</p>
        <p><strong>Poids :</strong> ${pokemon.weight / 10} kg</p>

        <h3>Statistique</h3>

        <p class="stats">${statsTexte}</p>

        <button id="fermer-details">Fermer</button>
      </div>
    </div>
  `;

    document.getElementById("details-pokemon").innerHTML = texte;
    document.getElementById("details-pokemon").classList.remove("details-cacher");
    document.getElementById("fermer-details").addEventListener("click", fermerDetails);
};

const fermerDetails = () => {
    document.getElementById("details-pokemon").classList.add("details-cacher");
};

document.getElementById("pokemon-list")?.addEventListener("click", (event) => {

    const carte = event.target.closest(".carte");

    if (carte) {

        const idClique = carte.getAttribute("data-id");

        afficherDetails(idClique);
    }
});


document.getElementById("recherche")?.addEventListener("input", (event) => {
  texteRecherche = event.target.value.toLowerCase();
  afficherPokemons(filtreActif);
});

if (document.getElementById("recherche")) {
  getData();
} else {
  afficherFavoris();
}