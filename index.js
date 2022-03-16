const express = require('express');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
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
    res.sendFile(__dirname + '/Front/html/make_grid.html');
    /*
    let sessionData = req.session;

    if(!sessionData.username) // Si la session n'a pas d'username ca veut dire qu'on est pas co donc on envoie au login
    {
        res.sendFile(__dirname + 'Front/html/login.html');
    }
    else // Sinon on est co donc on envoie au menu
    {
        res.sendFile(__dirname + '/Front/html/index.html');
    }*/
});

app.get('/login', body('login').isLength({min: 3}).trim().escape(), (req, res) => {
    // C'est ici qu'on verifie la validite des username / password
});

let arrayUser = [];
let userConnected = [];
let sameUser = false;

io.on('connection', (socket) => {
    socket.on('message', (msg) =>{
        console.log(msg);
        io.emit('message', msg);
    });

    //Rooms
    socket.on("user join", (username)=>{
        for(const elt of arrayUser){
            if(elt == username){
                sameUser = true;
            }
        }
        if(arrayUser.length < 2 && sameUser == false){
            arrayUser.push(username);
            io.emit("print user", username);
        }
        console.log(arrayUser);
    });
    socket.on("room", (roomname)=>{
        
        if(arrayUser.length < 3 && sameUser == false){
            socket.join(roomname);
        }
        sameUser = false;
    });
    socket.on("new_user_grid", (grid)=>{
        let newUser = new User();
        newUser.setGrid(grid);
        newUser.setUsername(userConnected.length);
        console.log("User :", newUser.username, "has connected.")
        userConnected.push(newUser);
    })
    //socket.on("disconnect", () =>{
    //    console.log("User has disconnected.")
    //})
});

http.listen(4200, () => {
    console.log('Serveur lancé sur le port 4200');
});

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