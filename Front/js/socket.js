let socket = io();

//Envoi message

function send(tir){
    //tir.preventDefault();
    socket.emit('message', tir.getAttribute("data"));
}

//Recuperer case du tir
document.querySelectorAll("td").forEach(tir => tir.addEventListener("click", () => send(tir)));

// Affichage d'un message

socket.on('message', msg => {
    //let item = document.getElementById('messages');
    //let newElement = document.createElement('p');
    //newElement.innerHTML = msg;
    //item.appendChild(newElement);
});


//Recuperer case bato
//document.querySelectorAll("td").forEach();

//Armes
//let canon = document.querySelector("#canon");

//canon.addEventListener("click", console.log("niu"));