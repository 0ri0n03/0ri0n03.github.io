function validerNom (nom) {
    if (nom.length < 2) {
        throw new Error("Le nom doit contenir au moins 2 caractères")
    } 
}

function validerEmail (email) {
    let regexEmail = new RegExp("^[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+$");
    if (!regexEmail.test(email)) {
        throw new Error("L'adresse email n'est pas valide")
} 
}

function afficherResultat(score, i){
    let AfficherScore = document.querySelector(".zoneScore span")
    let AffichageScore = `
${score + " / " +i}
`
AfficherScore.innerText = AffichageScore
}

function afficherPropositon (proposition){
        let AfficheMotPropose = document.querySelector(".zoneProposition");
        AfficheMotPropose.innerText = proposition
        }

function afficherEmail(nom, email, scoreEmail) {

    let mailto = `mailto:${email}?subject=Partage du score Azertype&body=Salut, je suis ${nom} et je viens de réaliser le score ${scoreEmail} sur le site d'Azertype !`
    location.href = mailto
}

function GererFormulaire (scoreEmail) {

    try{
    let baliseNom = document.getElementById("nom");
    let nom = baliseNom.value;
    validerNom(nom);
    let baliseEmail = document.getElementById("email");
    let email = baliseEmail.value;
    validerEmail(email);
    AfficherMessageErreur("")
    afficherEmail(nom, email, scoreEmail)
    } catch (erreur) {
        AfficherMessageErreur(erreur.message)
    }
}

function AfficherMessageErreur(message) {
   

    let spanErreurMessage = document.getElementById("ErreurMessage")

    if (!spanErreurMessage){
         let popup = document.querySelector(".popup")
         spanErreurMessage = document.createElement("span")
    spanErreurMessage.id = "ErreurMessage"
    popup.append(spanErreurMessage)
    }
    spanErreurMessage.innerText = message
}

function lancerJeu (){
    initAddEventListenerPopup()
    let score = 0
    let i = 0;
    let BoutonsChoix = document.querySelectorAll(".optionSource input");
    let zonesaisie = document.getElementById("InputEcriture");
    let BoutonValider = document.getElementById("btnValidermot");
    let listechoisie = listeMots;

   
    afficherPropositon(listechoisie[i])
    BoutonValider.addEventListener("click", () =>{
         if (zonesaisie.value === listechoisie[i]) {
            score++;
        }
        i++;
        afficherResultat(score, i)
        zonesaisie.value = ''

        if (listechoisie[i] === undefined) {
            afficherPropositon("Jeu Terminé")
            BoutonValider.disabled = true
            
        } else {
            afficherPropositon(listechoisie[i])
        }
    })
    
    let form = document.querySelector("form");
    form.addEventListener("submit", (event) => {
    event.preventDefault();
    let scoreEmail = `${score} / ${i}`;
    GererFormulaire(scoreEmail);
});

    afficherResultat(score, i)

    for (let j = 0; j < BoutonsChoix.length; j++) {
        BoutonsChoix[j].addEventListener("change", (event) => {
            score = 0;
            i = 0;
            if (event.target.value === "1") {
                listechoisie = listeMots;
            } else {
                listechoisie = listephrases;
            }
         afficherPropositon(listechoisie[i])
        }); 
    }

}



 

 
 


 





