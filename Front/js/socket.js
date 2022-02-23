let socket = io();
let inputMessage = "test";//document.getElementById('input');

//Envoi message

function send(tir){
    //tir.preventDefault();
    socket.emit('message', tir.getAttribute("data"));
}

//RÃ©cuperer case du tir
document.querySelectorAll("td").forEach(tir => tir.addEventListener("click", () => send(tir)));

// Affichage d'un message

socket.on('message', msg => {
    let item = document.getElementById('messages');
    let newElement = document.createElement('p');
    newElement.innerHTML = msg;
    item.appendChild(newElement);
});