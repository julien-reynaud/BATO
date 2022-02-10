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
    let sessionData = req.session;

    if(!sessionData.username) // Si la session n'a pas d'username ca veut dire qu'on est pas co donc on envoie au login
    {
        res.sendFile(__dirname + 'Front/html/login.html');
    }
    else // Sinon on est co donc on envoie au menu
    {
        res.sendFile(__dirname + '/Front/html/index.html');
    }
});

app.get('/login', body('login').isLength({min: 3}).trim().escape(), (req, res) => {
    // C'est ici qu'on verifie la validite des username / password
});

io.on('connection', (socket) => {
    console.log('A user connected');
})

http.listen(4200, () => {
    console.log('Serveur lancé sur le port 4200');
});

