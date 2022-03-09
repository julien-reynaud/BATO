let form = document.getElementById("logForm");
let pseudo = document.getElementById("username");
let pwd = document.getElementById("pwd");

form.addEventListener("submit", event => {
    event.preventDefault();
    // Quand on submit on envoie les id et mdp a logFunc()
    console.log("submit");
    logFunc.sendLogin(pseudo.value, pwd.value);
});

let creationForm = document.getElementById("creationForm");

creationForm.addEventListener("submit", event => {
    event.preventDefault();
    // Quand on submit on envoie les id et mdp a logFunc() en utilisant une autre fonction du module
    console.log("submit");
    logFunc.sendNewLog(pseudo.value, pwd.value);
});