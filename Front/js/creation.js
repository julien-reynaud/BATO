let creationForm = document.getElementById("creationForm");
let pseudo = document.getElementById("username");
let pwd = document.getElementById("pwd");

creationForm.addEventListener("submit", event => {
    event.preventDefault();
    // Quand on submit on envoie les id et mdp a logFunc() en utilisant une autre fonction du module
    console.log("submit");
    logFunc.sendNewLog(pseudo.value, pwd.value);
});