const token = localStorage.getItem("token");
if (token) {
    console.log("Utilisateur connecté");
    userConnecter();

} else {
    console.log("Utilisateur non connecté");
}

function ajoutListenerConnexion() {
   const formulaireConnexion = document.querySelector(".formulaire-connexion");
   if (formulaireConnexion) {
    formulaireConnexion.addEventListener("submit", function (event) {
        /* ... */
        event.preventDefault();
        //console.log("envoyé");

        // Création de l’objet de l'user.
        const user = {
            email: "sophie.bluel@test.tld",
            password: "S0phie"
           // email: event.target.querySelector("[name=email]").value,
            //password: event.target.querySelector("[name=motdepasse]").value
        };
        // Création de la charge utile au format JSON
        const chargeUtile = JSON.stringify(user);

        // Appel de la fonction fetch avec toutes les informations nécessaires
            fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: chargeUtile
            }).then(response => {
    if (response.status === 200) {
        return response.json(); // Lit le corps de la réponse en JSON
    } else {
        document.querySelector(".message-error").innerText= "Erreur dans l’identifiant ou le mot de passe";
        throw new Error("Erreur dans l’identifiant ou le mot de passe");
    }
})
.then(data => {
    const token = data.token; // récupérer le token
    console.log("data "+ data+ " token :"+token);
    // Stockage des informations dans le localStorage
    window.localStorage.setItem("token", token);
    window.location = "index.html";
})
.catch(error => {
    console.error(error.message);
});

     });
    }
}
ajoutListenerConnexion();


function userConnecter(){
    //ajoute la class admin-mode qui affiche le bloc dans le css admin
    document.querySelector(".bloc-admin").classList.add("admin-mode");

    //cible dans le menu : menu-nav > login et remplace par logout
    const menuBtnLogin = document.querySelector('.menu-nav a[href="login.html"]');
    menuBtnLogin.innerText = "logout";
    //au clic du bouton logout
    menuBtnLogin.addEventListener("click", function(event) {
        event.preventDefault();
        localStorage.removeItem("token");
        window.location = "index.html";
    });
}