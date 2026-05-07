function ajoutListenerConnexion() {
   const formulaireConnexion = document.querySelector(".formulaire-connexion");
   if (formulaireConnexion) {
    formulaireConnexion.addEventListener("submit", function (event) {
        /* ... */
        event.preventDefault();
        console.log("envoyé");

        // Création de l’objet de l'user.
        const user = {
            email: "sophie.bluel@test.tld",
            password: "S0phie"
            //email: event.target.querySelector("[name=email]").value,
            //password: event.target.querySelector("[name=motdepasse]").value
        };
        // Création de la charge utile au format JSON
        const chargeUtile = JSON.stringify(user);

        // Appel de la fonction fetch avec toutes les informations nécessaires
            fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: chargeUtile
            });

     });
    }
}
ajoutListenerConnexion();