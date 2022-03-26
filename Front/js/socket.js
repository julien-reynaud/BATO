let socket = io();

//Envoi message

function send(tir){
    //tir.preventDefault();
    //socket.emit('message', tir.getAttribute("data"));
    socket.emit("espion", tir.getAttribute("data"));
}

//Recuperer case du tir
document.querySelectorAll("td").forEach(tir => tir.addEventListener("click", () => send(tir)));

// Affichage d'un message

socket.on('message', msg => {
    console.log(msg);
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


//Room

window.onload = socket.emit("room", "room1");