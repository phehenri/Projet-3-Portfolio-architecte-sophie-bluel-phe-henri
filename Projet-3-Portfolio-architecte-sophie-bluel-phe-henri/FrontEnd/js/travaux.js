const reponseTravaux = await fetch ('http://localhost:5678/api/works/');
const travaux = await reponseTravaux.json();

const reponseCategories = await fetch ('http://localhost:5678/api/categories/');
const categories = await reponseCategories.json();



function genererTravaux(travaux){
    for(let i=0; i < travaux.length;i++){
        const travail = travaux[i];

        // Récupération de l'élément du DOM div qui accueillera les travaux
        const blocTravaux = document.querySelector(".gallery");

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
    for(let i=0; i < categories.length;i++){
        //console.log("TEST " +categories[i].name);
        const categorie = categories[i];

        const blocFiltre = document.querySelector(".filtres-liste");

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

function afficherTout(){
    const btnToutAfficher = document.querySelector(".btnTous");
    btnToutAfficher.addEventListener("click", function () {
        //bloque le chargement de la page
        event.preventDefault();
        document.querySelector(".gallery").innerHTML = "";
        genererTravaux(travaux);
        //rendre le filtre coloré
        initialiseFiltre();
        activeFiltre(event.target);
    });
}
afficherTout();

function initialiseFiltre(){
    //mets la couleur de tous les filtres en couleur initial
    const filtres = document.querySelectorAll(".filtres-liste li a");
    filtres.forEach(el => el.classList.remove("btnFiltreOn"));
    document.querySelector(".btnTous").classList.remove("btnFiltreOn");
}
function activeFiltre(eventVar){
    eventVar.classList.add("btnFiltreOn");
    eventVar.classList.remove("btnFiltreOff");
}