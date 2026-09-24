const displayError = (message) => {
  const error = document.createElement('p')
  error.classList.add('red')
  error.textContent = message
  document.body.appendChild(error)
}
 
let allpokemon=[];

// Création d'une fonction qui appel l'API
const getData = async () => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    .catch(error => {
      console.error("Error:", error)
      displayError("Une erreur est survenue")
    });
 
  // Si la réponse est correcte
  if(response.status < 300){
    // On récupère le corps de la requête
    const data = await response.json();
    
    for (const element of data.results) {
      const detailResponse = await fetch(element.url);
      const detailData = await detailResponse.json();
      allpokemon.push(detailData);
    }

    afficherPokemons("Tous");
  }
  else{
    // Status code >= 300
    displayError("Une erreur est survenue")
  }
}
 
// On lance au chargement de la page l'appel API
getData()

// Traduction des types de l'api (Français < - > Anglais)
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
  "Dragon":"dragon"
};

//fonction qui filtre allpokemon et affiche les résultats
const afficherPokemons=(filtre) => {
  let liste=allpokemon;

  if(filtre != "Tous") {
    const typeAnglais= TypesPouvoir[filtre];
    liste=allpokemon.filter(pokemon => pokemon.types.some(t => t.type.name === typeAnglais)
    );
  }

  let content ="";
  
  liste.forEach(element => {
    const imageUrl =`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${element.id}.png`
    
    const typeAnglais = element.types[0].type.name;
    const typeFrancais = Object.keys(TypesPouvoir).find(type => TypesPouvoir[type] === typeAnglais);
    content += `
      <div class="carte" data-id="${element.id}">
        <div class="fond-image">
          <img src="${imageUrl}" alt="${element.name}">
        </div>
        <h2>${element.name}</h2>
        <div class="type type-${typeFrancais}">${typeFrancais}</div>
      </div>
      `
  });

  document.getElementById("pokemon-list").innerHTML= content;
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

document.getElementById("pokemon-list").addEventListener("click", (event) => {

    const carte = event.target.closest(".carte");

    if (carte) {

        const idClique = carte.getAttribute("data-id");

        afficherDetails(idClique);
    }
});