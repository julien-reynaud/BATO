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

/*** Initialisation de la BDD ***/

const fs = require('fs');
const mysql = require('mysql');

/*const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "toto",
    database: "batodb",
});*/

const {body, validationResult} = require('express-validator');
const sharedsession = require('express-socket.io-session');
const bodyParser = require('body-parser'); // Pour traiter la requête ajax. Permet d'utiliser req.body dans le app.post('/login')
const { Console } = require('console');
const { captureRejections } = require('events');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

io.use(sharedsession(session, {
    // Session automatiquement sauvegardée en cas de modification
    autoSave: true
}));

// Détection de si nous sommes en production, pour sécuriser en https
if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    session.cookie.secure = true // serve secure cookies
}

app.use(express.static(__dirname + '/Front/'))
app.use(urlencodedParser);
app.use(session);

app.get('/', (req, res) => {

    let sessionData = req.session;
    console.log(sessionData);

    if(!sessionData.username) // Si la session n'a pas d'username ca veut dire qu'on est pas co donc on envoie au login
    {
        console.log('On envoie l\'user se co');
        res.sendFile(__dirname + '/Front/html/login.html');
    }
    else if(sessionData.username == -1)
    {
        res.sendFile(__dirname + '/Front/html/newAccount.html');
    }
    else // Sinon on est co donc on envoie au menu
    {
        console.log('Infos ok, on passe à la suite');
        res.sendFile(__dirname + '/Front/html/index.html');

        const con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "toto",
            database: "batodb",
        });

        con.connect(err => {
            if(err) throw err;

            con.query("SELECT * FROM users ORDER BY score LIMIT 5", (err, result) => {
                if (err) throw err;

                //console.log(result);
                io.on('connection', (socket) => {
                    socket.emit("leaderboard", result);
                });
            });
        });
    }
});

app.post('/login', body('login').isLength({min: 3}).trim().escape(), (req, res) => {

    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "toto",
        database: "batodb",
    });

    console.log("On check les infos");

    console.log(req.body);
    const login = req.body.login;
    const password = req.body.password;
    
    // C'est ici qu'on verifie la validite des username / password

    let isOke = true;
    //let verifDone = false;

    con.connect(err => {
        if (err) throw err;
        else console.log('Connexion effectuée');

        con.query("SELECT * FROM users WHERE username = '" + login + "' AND pwd = '" + password + "'", (err, result) => {
            if(err) throw err;
            console.log(result);
            console.log(result[0]);

            if(result[0] == undefined){
                isOke = false;
            }

            console.log(isOke);
        //verifDone = true; // Comme ça on a un moyen de vérifier que le serveur a bien communiqué la réponse

        if(isOke)
        {
            req.session.username = login; // el famoso username dont on teste la presence juste au-dessus
            // Le mot de passe est pas stocké dans les infos de la session, on vérifie seulement s'il est bon avec la bdd
            req.session.save(); // ctrl + s
            res.redirect('/');
        }
        });
    });
});

app.post('/create', body('login').isLength({min: 3}).trim().escape(), (req, res) => {

    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "toto",
        database: "batodb",
    });

    console.log("Creation de compte");

    console.log(req.body);
    const login = req.body.login;
    const password = req.body.password;

    verif = "SELECT * FROM users WHERE username = '" + login + "'";

    con.query(verif, (err, result) => {
        if(err) throw err;

        console.log(verif);

        if(result[0] != undefined){
            let msgError = document.getElementByID("titre");
            msgError.innerHTML("Pseudo déjà utilisé !")
        }
        else{
            console.log("tentative d'insertion");
            let sql = "INSERT INTO users (username, pwd) VALUES ('" + login + "', '" + password + "')";

            con.query(sql, (err, result2)=>{
                if (err) throw err;
                console.log("One username inserted");
                console.log(result2);
            });
        }
    });

    req.session.username = login;
    req.session.save();
    res.redirect('/');
});

app.post("/goToCreation", (req, res) => { //Oui, c'est dégueu désolé monsieur
    res.sendFile(__dirname + '/Front/html/newAccount.html');
    req.session.username = -1;
});


    /********************************/
    /*                              */
    /* --------  Sockets  --------  */
    /*                              */
    /********************************/


/*io.on('connection', (socket) => {
    console.log('A user connected');
    console.log(user.handshake);

    socket.on('login', () => {
        let srvSockets = io.sockets.sockets;
        srvSockets.forEach(user => {
            console.log(user.handshake.session.username);
        })
    });
})*/


let arrayUser = [];
let arrayGrid = [];
let sameUser = false;
let cmptSendG = 0;

const rooms = {};

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