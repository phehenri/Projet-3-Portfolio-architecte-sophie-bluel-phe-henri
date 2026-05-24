const token = localStorage.getItem("token");
if (token) {
    console.log("Utilisateur connecté");
    cacherFiltres();
    afficherBtnModifier();

} else {
    console.log("Utilisateur non connecté");
}

// promise.all pour lancer les deux fetch en parallele
const responses = await Promise.all([
  fetch('http://localhost:5678/api/works/'),
  fetch('http://localhost:5678/api/categories/')
]);

const reponseTravaux = responses[0];
const reponseCategories = responses[1];

// transformation en JSON
export const travaux = await reponseTravaux.json();
export const categories = await reponseCategories.json();


export function genererTravaux(travaux){
    // Récupération de l'élément du DOM div qui accueillera les travaux
    const blocTravaux = document.querySelector(".gallery");
    blocTravaux.innerHTML = "";

    for(let i=0; i < travaux.length;i++){
        const travail = travaux[i];

        // Création d’une balise "figure" dédiée à un travail
        const elementTravaux = document.createElement("figure");

        // Création des balises informations d'un travail
        const imageTravaux = document.createElement("img");
        imageTravaux.src = travail.imageUrl;

        const titreTravaux = document.createElement("figcaption");
        titreTravaux.innerText = travail.title;

        // Rattache balise elementTr
        elementTravaux.appendChild(imageTravaux);
        elementTravaux.appendChild(titreTravaux);
        blocTravaux.appendChild(elementTravaux);
    }
}
genererTravaux(travaux);

function genererCategories(categories){
    const blocFiltre = document.querySelector(".filtres-liste");

    //bouton Tous
    const elementBtnTous = document.createElement("li");
    blocFiltre.appendChild(elementBtnTous);
    const lienBtnTous = document.createElement("a");
    lienBtnTous.innerText = "Tous";
    lienBtnTous.href = "#";
    lienBtnTous.classList.add("btnFiltreOn");
    elementBtnTous.appendChild(lienBtnTous);

    elementBtnTous.addEventListener("click", function (event) {
        //bloque le chargement de la page
        event.preventDefault();
        document.querySelector(".gallery").innerHTML = "";
        genererTravaux(travaux);
        //rendre le filtre coloré
        initialiseFiltre();
        activeFiltre(event.target);
    })

    for(let i=0; i < categories.length;i++){
        //const qui va contenir le tableau de toute les categories recupérer avec le fetch
        const categorie = categories[i];

        // pour chaque element du tableau on va créer un li, un a
        const elementCategories = document.createElement("li");
        blocFiltre.appendChild(elementCategories);

        const lienCategories = document.createElement("a");
        lienCategories.classList.add("btnFiltreOff");
        elementCategories.appendChild(lienCategories);
        
        // contenu de la balise "a" du filtre
        lienCategories.innerText = categorie.name;
        lienCategories.href = "#";
        //attribuer l'id correspondant pour pouvoir plus tard au clic le retrouver
        lienCategories.dataset.id = categorie.id;

        // Fonction pour ajouter au clic le filtrage selon categories
        lienCategories.addEventListener("click", async function (event) {
            //bloque le chargement de la page
            event.preventDefault();
            // au clic on va filter les travaux qui possede la meme id de categorie et le stocker dans le nouveau tableau travauxFiltrees
            // on recupére l'id du filtre cliqué
            const id = event.target.dataset.id;
            const travauxFiltrees = travaux.filter(function(travail) {
                return travail.categoryId == id;
            });
            document.querySelector(".gallery").innerHTML = "";
            genererTravaux(travauxFiltrees);

            //On met d'abord tout les filtres en couleur initial puis rendre le filtre cliqué coloré
            initialiseFiltre();
            activeFiltre(event.target);

        });

    }
}

genererCategories(categories);


function initialiseFiltre(){
    //mets la couleur de tous les filtres en couleur initial
    const filtres = document.querySelectorAll(".filtres-liste li a");
    filtres.forEach(el => el.classList.remove("btnFiltreOn"));

    const btnTous = document.querySelector(".btnTous");
    // vérifier que le bouton btnTous est créer avant de lui retirer le filtre
    if (btnTous) {
        btnTous.classList.remove("btnFiltreOn");
    }
}
function activeFiltre(eventVar){
    eventVar.classList.add("btnFiltreOn");
    eventVar.classList.remove("btnFiltreOff");
}

function cacherFiltres(){
   document.querySelector(".filtres").style.display = "none";
}
function afficherBtnModifier(){
   document.querySelector(".btn-modifier").style.display = "block";
}

