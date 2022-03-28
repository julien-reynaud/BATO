const express = require('express');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { v4: uuidv4 } = require('uuid');

const session = require('express-session')({
    secret: "eb8fcc253281389225b4f7872f2336918ddc7f689e1fc41b64d5c4f378cdc438",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 60 * 1000,
        secure: false
    }
});
const {body, validationResult} = require('express-validator');

app.use(express.static(__dirname + '/Front/'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Front/html/matchmaking.html');
});

app.get('/login', body('login').isLength({min: 3}).trim().escape(), (req, res) => {
    // C'est ici qu'on verifie la validite des username / password
});

let arrayUser = [];
let arrayGrid = [];
let sameUser = false;
let cmptSendG = 0;


io.on('connection', (socket) => {

    //Room et personnes dans la room
    socket.on("usernameRoom", (username)=>{//Enregistrer username dans tableau pour l'utiliser dans une autre page
        arrayUser.push(username);
    });

    //Pour afficher les joueurs d'une room sur la page html
    let newUser = new User();
    socket.on("user join", (username)=>{
        newUser.setId(socket.id);
        console.log(username);
        if(username != ''){
            for(let j = 0; j < arrayUser.length; j++){
               if(arrayUser[j] == username){
                   sameUser = true;
               }
            }
            if(arrayUser.length < 2 && sameUser == false){

                newUser.setUsername(username);

                console.log(username);
                io.emit("print user", username); //matchmaking.js
                arrayUser.push(newUser);
            }

        }
    });
    socket.on("room", (roomname)=>{// Crée une room
        if(arrayUser.length < 3 && sameUser == false){
            socket.join(roomname);
        }
        sameUser = false;
    });

    // Tout est dans le nom, p1 veut la grille, il va l'avoir
    socket.on("p1WantsGrid", (grid)=>{
        socket.broadcast.to("room1").emit('hereItIs', grid);
    });
    // Idem
    socket.on("p2WantsGrid", (grid)=>{
        socket.broadcast.to("room1").emit('getShot', grid);
    });


    /////////////////    /////////////////  Passage des grilles à travers les sockets  /////////////////    /////////////////
    // Enregistre les grilles des joueurs qui ont fini de les remplir sur page make_grid.html
    socket.on("saveGrid", (grid)=>{
        if(arrayGrid.length == 0){
            arrayGrid[0] = grid;//p1
        }
        else{
            arrayGrid[1] = grid;//p2
        }
    });
    socket.on("askGrid", ()=>{
        socket.emit("sendGrid", arrayGrid, cmptSendG);
        cmptSendG += 1;
    });
    socket.on("new_user_grid", (grid)=>{

        for(let i = 0; i < arrayUser.length; i++){
            if(arrayUser[i].id == socket.id){
                arrayUser[i].setGrid(grid);
                console.log("user", arrayUser[i].username, "has lock his grid.")
            }
        }
    });

    socket.on("getP1Grid", ()=>{
        io.emit("p1Grid", arrayUser[0].getGrid());
    });

    socket.on("getP2Grid", ()=>{
        io.emit("p2Grid", arrayUser[1].getGrid());
    });  
});


http.listen(4200, () => {
    console.log('Serveur lancé sur le port 4200');
});

function startGame(){
    window.location.href = "../html/game.html";
}

class User{
    constructor(){
        this.id;
        this.username = "";
        this.grid = [];
        this.room = "";
    }

    setUsername(newUsername){
        this.username = newUsername;
    }

    setId(newId){
        this.id = newId;
    }
    setRoom(newRoom){
        this.room = newRoom;
    }

    setGrid(newGrid){
        this.grid = newGrid;
    }

    isUsername(){
        if(this.username == ""){
            return false;
        }
        return true;
    }

    getGrid(){
        return this.grid;
    }
}