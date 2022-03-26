let socket = io();

//pseudo
class User{
    constructor(){
        this.username = "";
        this.grid = [];
        this.room = "";
    }

    setUsername(newUsername){
        this.username = newUsername;
    }

    setGrid(newGrid){
        this.grid = newGrid;
    }
    setRoom(newRoom){
        this.room = newRoom;
    }
}
let test = 1;

let pseudo = document.querySelector("#pseudo");
pseudo.addEventListener('click', getPseudo);

var user = new User();

function getPseudo(event){
    event.preventDefault();
    user.setUsername(document.getElementById("inputPseudo").value);

}

//Room

let btnJoin = document.querySelector(".btnJoin");
//let btnStart = document.querySelector(".confirme");

btnJoin.addEventListener('click', btnJoinPushed);
//btnStart.addEventListener('click', btnStartPushed);

function btnJoinPushed(event){
    event.preventDefault();
    socket.emit("usernameRoom", user.username, "room1");
    //socket.emit("room", "room1");
    //socket.emit("user join", user.username);
    window.location.href="../html/make_grid.html"; 
}

socket.on("print user", (username)=>{
    let item = document.querySelector('.room');
    let newElement = document.createElement('p');
    newElement.innerHTML = username;
    item.appendChild(newElement);
});