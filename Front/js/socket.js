let socket = io();

let Form = document.getElementById("chatForm");
let inputMessage = document.getElementById('input');

// Gestion de l'envoi d'un message
chatForm.addEventListener('submit', event => {
    event.preventDefault();
    if (input.value) {
        socket.emit('message', inputMessage.value);
        inputMessage.value = '';
    }
});

// Affichage d'un message
socket.on('message', msg => {
    console.log('test');
    let item = document.getElementById('messages');
    let newElement = document.createElement('p');
    newElement.innerHTML = msg;
    item.appendChild(newElement);
    
    //console.log(msg);
    //messages.appendChild(item);
});