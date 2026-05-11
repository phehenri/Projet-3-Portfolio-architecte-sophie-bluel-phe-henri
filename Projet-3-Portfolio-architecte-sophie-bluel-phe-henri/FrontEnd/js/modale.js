const reponseTravaux = await fetch ('http://localhost:5678/api/works/');
const travaux = await reponseTravaux.json();
const blocModal = document.querySelector(".bloc-modale-overlay");

//fonction afficher modale
document.querySelector(".btn-modifier").addEventListener("click", function (event) {
    //bloque le chargement de la page
    event.preventDefault();
    blocModal.style.display="flex";
    afficherGalleryModalBloc();
});

document.querySelector(".btn-retour").addEventListener("click", afficherGalleryModalBloc);

//fonction cacher modale 
document.querySelector(".bloc-modale-overlay").addEventListener("click", closeModal);
document.querySelector(".btn-croix-fermer-modal").addEventListener("click", closeModal);
document.querySelector(".btn-croix-fermer-modal2").addEventListener("click", closeModal);

document.querySelector(".stop-propagation").addEventListener("click", stopPropagation);

function closeModal(event) {
    //bloque le chargement de la page
    event.preventDefault();
    blocModal.style.display="none";
};

function stopPropagation (e){
    e.stopPropagation();
}

//fonction ajouter photo
document.querySelector(".btn-modal-ajouter-photo").addEventListener("click", afficherAjouterPhotoBloc);
function afficherAjouterPhotoBloc() {
    afficherBloc(document.querySelector(".bloc-ajouter-photo"));
    cacherBloc(document.querySelector(".galerie-modal"));
};

function afficherGalleryModalBloc() {
    afficherBloc(document.querySelector(".galerie-modal"));
    cacherBloc(document.querySelector(".bloc-ajouter-photo"));
};

function afficherBloc(bloc){
    bloc.classList.add("visible");
    bloc.classList.remove("hidden");
}

function cacherBloc(bloc){
    bloc.classList.add("hidden");
    bloc.classList.remove("visible");
}

function genererTravauxModal(travaux){
    // Récupération de l'élément du DOM div qui accueillera les travaux
    const blocTravaux = document.querySelector(".bloc-travaux-modale");

    for(let i=0; i < travaux.length;i++){
        const travail = travaux[i];

        // Création d’une balise "figure" dédiée à un travail
        const elementTravaux = document.createElement("figure");
        elementTravaux.classList.add("figure-travaux-modal");


        //création balise corbeille
        const corbeille = document.createElement("img");
        corbeille.classList.add("corbeille");
        corbeille.src = "img/corbeille.png";
        corbeille.addEventListener("click",supprimerTravaux);

        // Création des balises informations d'un travail
        const imageTravaux = document.createElement("img");
        imageTravaux.classList.add("imageTravauxModal");
        imageTravaux.src = travail.imageUrl;

       // const titreTravaux = document.createElement("figcaption");
        //titreTravaux.innerText = travail.title;

        // Rattache balise elementTr
        elementTravaux.appendChild(corbeille);
        elementTravaux.appendChild(imageTravaux);
        
        //elementTravaux.appendChild(titreTravaux);
        blocTravaux.appendChild(elementTravaux);

        
    }
}
genererTravauxModal(travaux);

function supprimerTravaux(event){

}