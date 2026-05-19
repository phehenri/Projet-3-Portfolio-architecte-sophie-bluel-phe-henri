import { genererTravaux } from "./travaux.js";

const reponseTravaux = await fetch ('http://localhost:5678/api/works/');
const travaux = await reponseTravaux.json();
const blocModal = document.querySelector(".bloc-modale-overlay");

const reponseCategories = await fetch ('http://localhost:5678/api/categories/');
const categories = await reponseCategories.json();

//fonction afficher modale
document.querySelector(".btn-modifier").addEventListener("click", function (event) {
    //bloque le chargement de la page
    event.preventDefault();
    blocModal.style.display="flex";
    afficherGalleryModalBloc();
    // initialise le bloc text qui va nous servir plus tard pour le bloc ajouter nouveau travaux
    document.querySelector(".output-text").innerText="";
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
     // initialise le bloc text qui va nous servir plus tard pour le bloc ajouter nouveau travaux
    document.querySelector(".output-text").innerText="";
};

function stopPropagation (e){
    // pour eviter que au clic de la modale elle se ferme. juste au clic du overlay, on doit fermer. ou bouton dédié.
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
     // initialise le bloc text qui va nous servir plus tard pour le bloc ajouter nouveau travaux
    document.querySelector(".output-text").innerText="";
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
    blocTravaux.innerHTML = "";

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
        corbeille.dataset.id = travail.id;

        // Création des balises informations d'un travail
        const imageTravaux = document.createElement("img");
        imageTravaux.classList.add("imageTravauxModal");
        imageTravaux.src = travail.imageUrl;

        // Rattache balise elementTr
        elementTravaux.appendChild(corbeille);
        elementTravaux.appendChild(imageTravaux);
        
        //elementTravaux.appendChild(titreTravaux);
        blocTravaux.appendChild(elementTravaux);

    }
}
genererTravauxModal(travaux);

async function supprimerTravaux(event){
    const idTravauxClic = event.target.dataset.id;
    const token = localStorage.getItem("token");

    console.log("log"+`http://localhost:5678/api/works/${idTravauxClic}`);

     try {
        const response = await fetch(`http://localhost:5678/api/works/${idTravauxClic}`, {
            method: "DELETE",
            headers: {
            "Authorization": `Bearer ${token}`
        }
        });
        if(response.ok){
            console.log("Travail supprimé");
            const reponse = await fetch('http://localhost:5678/api/works/');
            const nouveauxTravaux = await reponse.json();
            //lancer fonction pour mettre à jour les travaux
            genererTravaux(nouveauxTravaux);
            genererTravauxModal(nouveauxTravaux);


        } else {
            console.log("Erreur suppression");
        }

    } catch(error) {
        console.error("error.message "+error.message);
    }
}

function listeCategorieForm(){
    const inputSelect = document.querySelector("#category");

    console.log(inputSelect.value);
        for(let i=0; i < categories.length;i++){
            //const qui va contenir le tableau de toute les categories recupérer avec le fetch
            const categorie = categories[i];

            // pour chaque element du tableau on va créer une balise option et attribuer les valeurs name
            const optionCategories = document.createElement("option");
            optionCategories.value=categorie.id;
            optionCategories.innerText=categorie.name;
            inputSelect.appendChild(optionCategories);
    }
}
listeCategorieForm();


document.querySelector(".input-ajouter-photo").addEventListener("change", afficherUploadPhoto);
function afficherUploadPhoto(event){

    const file = event.target.files[0];
    if (!file) return;

    const bloc_img_onload = document.querySelector(".image-onload");

    // nettoyer ancienne image
    bloc_img_onload.innerHTML = "";

    // créer img
    const img_onload = document.createElement("img");

    // source preview
    img_onload.src = URL.createObjectURL(file);

    // style optionnel
    img_onload.style.height = "100%";
    img_onload.style.position = "absolute";
    img_onload.style.top = "0";
    img_onload.style.left = "0";

    // ajouter au DOM
    bloc_img_onload.appendChild(img_onload);

    //Cacher les boutons
    document.querySelector(".bloc-upload-fields").style.visibility = "hidden";
}

const form = document.forms.namedItem("form-ajout-photo");
form.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();
    //on récupère la balise qui va afficher le message erreur
    const output = document.querySelector("#output");
    const token = localStorage.getItem("token");
    const formData = new FormData(form);

     try {
        const response = await fetch(`http://localhost:5678/api/works`, {
            method: "POST",
            headers: {
            "Authorization": `Bearer ${token}`
            },
            body: formData,
        });
        if(response.ok){
            console.log("OK");
            form.reset();
            document.querySelector(".bloc-upload-fields").style.visibility = "visible";
            document.querySelector(".image-onload").innerHTML="";
            document.querySelector(".output-text").innerText="Le travail a été envoyé correctement !";
            const reponse = await fetch('http://localhost:5678/api/works/');
            const nouveauxTravaux = await reponse.json();
            //lancer fonction pour mettre à jour les travaux
            genererTravaux(nouveauxTravaux);
            genererTravauxModal(nouveauxTravaux);
        } else {
            console.log("Erreur ajout");
            document.querySelector(".output-text").innerText="Erreur lors de l'envoi.";

        }

    } catch(error) {
        console.error("error.message "+error.message);
    }
  },
  false,
);