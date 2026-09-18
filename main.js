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
    content += `
      <div class="carte">
        <img src="${imageUrl}" alt="${element.name}">
        <h2>${element.name}</h2>
      </div>
      `
  })

  document.getElementById("pokemon-list").innerHTML= content;
}

const boutons = document.querySelectorAll("#bouton-filtre button");
boutons.forEach(bouton => {
  bouton.addEventListener("click", () => {
    const filtre = bouton.getAttribute("data-filtre");
    afficherPokemons(filtre);
  });
});