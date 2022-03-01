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

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "testBato",
});

const {body, validationResult} = require('express-validator');
const sharedsession = require('express-socket.io-session');
const bodyParser = require('body-parser'); // Pour traiter la requête ajax. Permet d'utiliser req.body dans le app.post('/login')

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
    else // Sinon on est co donc on envoie au menu
    {
        console.log('Infos ok, on passe à la suite');
        res.sendFile(__dirname + '/Front/html/index.html');

        /*con.connect(err => {
            if (err) throw err;
            else console.log('Connexion effectuée');
        
        /*    //Insérer une ligne dans la table
            let test = sessionData.username;
        
            let sql = "INSERT INTO stockage (username) VALUES ('test')";
            con.query(sql, (err, result)=>{
                if (err) throw err;
                console.log("One username inserted");
                console.log(result);
            });
        
        });*/
        
    }
});

app.post('/login', body('login').isLength({min: 3}).trim().escape(), (req, res) => {
    console.log("On check les infos");

    console.log(req.body);
    const login = req.body.login;
    const pwd = req.body.pwd;
    
    // C'est ici qu'on verifie la validite des username / password
    // Pour l'instant on considere qu'il est tjrs bon
    req.session.username = login; // el famoso username dont on teste la presence juste au-dessus
    // Le mot de passe est pas stocké dans les infos de la session, on vérifie seulement s'il est bon avec la bdd
    req.session.save(); // ctrl + s
    res.redirect('/'); // Et on renvoie la-haut pour passer a la suite
});

io.on('connection', (socket) => {
    console.log('A user connected');
    console.log(user.handshake);

    socket.on('login', () => {
        let srvSockets = io.sockets.sockets;
        srvSockets.forEach(user => {
            console.log(user.handshake.session.username);
        })
    });
})

http.listen(4200, () => {
    console.log('Serveur lancé sur le port 4200');
});
