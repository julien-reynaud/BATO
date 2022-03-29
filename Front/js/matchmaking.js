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

/*
let pseudo = document.querySelector("#pseudo");
pseudo.addEventListener('click', getPseudo);
*/

let user = new User();

socket.on("receivePseudo", (result) => {
    user.setUsername(result);
});

/*
function getPseudo(event){
    event.preventDefault();
    user.setUsername(document.getElementById("inputPseudo").value);

}
*/

//Room

let btnJoin = document.querySelector(".btnJoin");

btnJoin.addEventListener('click', btnJoinPushed);


function btnJoinPushed(event){
    event.preventDefault();
    socket.emit("usernameRoom", user.username);
    window.location.href="../html/make_grid.html"; 
}

socket.on("print user", (username)=>{ // Affiche les joueurs dans la room
    let item = document.querySelector('.room');
    let newElement = document.createElement('p');
    newElement.innerHTML = username;
    item.appendChild(newElement);
});

socket.on("leaderboard", (result) => {
    console.log(result);
    let linesToAdd = "";

    result.forEach((item, index, arr) => {
        linesToAdd = "<tr><td>" + (result.length - index) + "</td><td>" + item["username"] + "</td><td>" + item["score"] +"</td></tr>" + linesToAdd;
    });
    document.getElementById("leaderboard").innerHTML = linesToAdd;
});