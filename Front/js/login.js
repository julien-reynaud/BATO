//const res = require("express/lib/response");

let form = document.getElementById("logForm");
let pseudo = document.getElementById("username");
let pwd = document.getElementById("pwd");

form.addEventListener("submit", event => {
    event.preventDefault();
    // Quand on submit on envoie les id et mdp a logFunc()
    console.log("submit");
    logFunc.sendLogin(pseudo.value, pwd.value);
});

let lien = document.getElementById("pasDeCompte");

lien.addEventListener("click", event => {
    event.preventDefault();
    //window.location.href(__dirname + '../html/newAccount.html');
    goToCreate.goToCreationPage();
});