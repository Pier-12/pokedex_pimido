const displayError = (message) => {
  const error = document.createElement('p')
  error.classList.add('red')
  error.textContent = message
  document.body.appendChild(error)
}
 
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
    // On prépare une chaine de caractère vide
    let content = "";
    // On parcours tout ce que l'API a retourné
data.results.forEach(element => {
  const id = element.url.split("/").filter(Boolean).pop()
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
  content += `
    <div class ="carte">
      <img src="${imageUrl}" alt="${element.name}">
      <h2>${element.name}</h2>
    </div>
  `
})
    // On crée puis affiche le contenu retourné par l'API
    const elements = document.createElement('main')
    elements.innerHTML = content
    document.body.appendChild(elements)
  }
  else{
    // Status code >= 300
    displayError("Une erreur est survenue")
  }
}
 
// On lance au chargement de la page l'appel API
getData()