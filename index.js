const express = require('express');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { v4: uuidv4 } = require('uuid');
//const uuid = require('uuid');
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
let arrayGrid = [];
let userConnected = [];
let sameUser = false;
let cmptRoom = 1;
let waitingUser = [];
let cmptReady = 0;
let cmptSendG = 0;
//let room2 = "room1";
//room2 = "room" +String(Number(room2[4]) + cmptRoom);


const rooms = {};

io.on('connection', (socket) => {

    //socket.id = uuidv4();
    //console.log('A user connected');
    socket.on("p1WantsGrid", (grid)=>{
        socket.broadcast.to("room1").emit('hereItIs', grid);
    })

    socket.on("p2WantsGrid", (grid)=>{
        socket.broadcast.to("room1").emit('getShot', grid);
    })

    socket.on("saveGrid", (grid)=>{
        if(arrayGrid.length == 0){
            arrayGrid[0] = grid;//p1
        }
        else{
            arrayGrid[1] = grid;//p2
        }
    })
    socket.on("askGrid", ()=>{
        socket.emit("sendGrid", arrayGrid, cmptSendG);
        cmptSendG += 1;
    })
    socket.on("ready", (username)=>{
        let isReady = false;
        for (i in arrayUser){
            if (i == username){
                isReady = true;
            }
        }
        if(isReady == false){
            cmptReady += 1;
        }
        if(cmptReady == 2){
            socket.to("room1").emit("go");
        }
    })

    socket.on('message1', (msg) =>{
        console.log(msg);
        //io.emit('message', msg);
    });
    socket.on("espion", (tir)=>{
        socket.broadcast.to("room1").emit('message', tir);
    })

    //Rooms
    socket.on("usernameRoom", (username)=>{
        arrayUser.push(username);
    })
    /*socket.on("createRoom", (roomname)=>{
        console.log(socket.id);
        socket.emit("room", roomname);
    })*/


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
                //Temporaire
                //for(let i = 0; i < userConnected.length; i++){
                //    if(!userConnected[i].isUsername()){
                //        userConnected[i].setUsername(username);
                //        arrayUser.push(userConnected[i]);
                //        io.emit("print user", username);
                //        console.log(userConnected[i]);
                //    }
                //}
                newUser.setUsername(username);

                console.log(username);
                io.emit("print user", username)
                arrayUser.push(newUser);
            }
            /*else{
                waitingUser.push(newUser);
            }*/
            //if(arrayUser.length == 2){
            //    startGame();
            //}
        }
    });
    socket.on("room", (roomname)=>{
        //console.log(arrayUser.length);
        /*if(arrayUser.length >= 2){//Si room pleine
            arrayUser.pop();
            arrayUser.pop();
            arrayUser.push(waitingUser[0]);
            console.log(waitingUser[0], arrayUser[0]);
            waitingUser.pop();
            roomname = "room" +String(Number(roomname[4]) + cmptRoom);
            cmptRoom += 1;
        }*/
        if(arrayUser.length < 3 && sameUser == false){
            socket.join(roomname);
        }
        //console.log("Room actuelle : ", roomname);
        sameUser = false;
    });
    socket.on("new_user_grid", (grid)=>{
        //let newUser = new User();
        //newUser.setGrid(grid);
        ////newUser.setUsername(userConnected.length);
        //console.log("User :", /*newUser.username,*/ "has connected.")
        //userConnected.push(newUser);
        for(let i = 0; i < arrayUser.length; i++){
            //console.log(arrayUser[i].id, socket.id);
            if(arrayUser[i].id == socket.id){
                arrayUser[i].setGrid(grid);
                console.log("user", arrayUser[i].username, "has lock his grid.")
            }
        }
    })
    //socket.on("disconnect", () =>{
    //    console.log("User has disconnected.")
    //})

    socket.on("getP1Grid", ()=>{
        io.emit("p1Grid", arrayUser[0].getGrid());
    })

    socket.on("getP2Grid", ()=>{
        io.emit("p2Grid", arrayUser[1].getGrid());
    })    
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

/**
 * Will connect a socket to a specified room
 * @param socket A connected socket.io socket
 * @param room An object that represents a room from the `rooms` instance variable object
 */
const joinRoom = (socket, room) => {
  room.sockets.push(socket);
  socket.join(room.id, () => {
    // store the room id in the socket for future use
    socket.roomId = room.id;
    console.log(socket.id, "Joined", room.id);
  });
};

/**
 * Will make the socket leave any rooms that it is a part of
 * @param socket A connected socket.io socket
 */
 const leaveRooms = (socket) => {
    const roomsToDelete = [];
    for (const id in rooms) {
      const room = rooms[id];
      // check to see if the socket is in the current room
      if (room.sockets.includes(socket)) {
        socket.leave(id);
        // remove the socket from the room object
        room.sockets = room.sockets.filter((item) => item !== socket);
      }
      // Prepare to delete any rooms that are now empty
      if (room.sockets.length == 0) {
        roomsToDelete.push(room);
      }
    }
  
    // Delete all the empty rooms that we found earlier
    for (const room of roomsToDelete) {
      delete rooms[room.id];
    }
  };