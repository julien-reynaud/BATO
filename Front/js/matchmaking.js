let socket = io();

//pseudo

class User{
    constructor(){
        this.username = "";
        this.grid = [];
    }

    setUsername(newUsername){
        this.username = newUsername;
    }

    setGrid(newGrid){
        this.grid = newGrid;
    }
}

/*let pseudo = document.querySelector("#pseudo");
pseudo.addEventListener('click', getPseudo);*/

var user = new User();
user.setUsername(pseudo);
/*function getPseudo(event){
    event.preventDefault();
    user.setUsername(document.getElementById("inputPseudo").value);

}*/

//Room
let btnJoin = document.querySelector(".btnJoin");

btnJoin.addEventListener('click', btnJoinPushed);

function btnJoinPushed(event){
    event.preventDefault();

    socket.emit("user join", user.username);
    socket.emit("room", "room1");
    
}

socket.on("print user", (username)=>{
    let item = document.querySelector('.room');
    let newElement = document.createElement('p');
    newElement.innerHTML = username;
    item.appendChild(newElement);
});