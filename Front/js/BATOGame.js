socket.emit("room", "room1");
socket.emit("askGrid");
var cmptG = 0;


// Class du jeu 
    // Particularité : La classe crée toutes les grilles de la page et réalise les échanges de tirs via sockets
class BATOGame {
    // Différentes variables utiles
    currentWeapon;
    torpilleAvailable = true;
    bombeAFragmentAvailable = true;
    radarAvailable = true;

    myTurn;

    //Système de score
    nbShot = 0;
    nbTouchedCase = 0;
    timeSpent = 0;

    t0 = 0;
    t1 = 0;

    // Constructeur
    constructor() {
        // Initialisation des deux grilles
        this.p1Grid = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.p2Grid = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        /**
         * 
         * GRILLE 1
         * 
         */
        let body = document.getElementById("GridAdversaire");
        let table = document.createElement("table");
        let tableBody = document.createElement("tbody");

        // Création des cases avec des id et data distinct
        let l = 0;
        for (let i = 0; i < 10; i++) {
            let row = document.createElement("tr");
            for (let j = 0; j < 10; j++) {
                let cell = document.createElement("td");
                cell.setAttribute('id', l);
                cell.setAttribute('data', l);
                row.appendChild(cell);
                l++;
            }
            tableBody.appendChild(row);
        }
        // Un peu de style
        table.setAttribute('class', "tableau");
        table.setAttribute("border", "1px");

        table.appendChild(tableBody);
        body.appendChild(table);


        /**
         * 
         * GRILLE 2
         * 
         */

        let bodyTab2 = document.getElementById("GridPlayer");
        let table2 = document.createElement("table");
        let tableBody2 = document.createElement("tbody");

        // Création des cases avec des id et data distinct
        l = 0;
        for (let i = 0; i < 10; i++) {
            let row = document.createElement("tr");
            for (let j = 0; j < 10; j++) {
                let cell = document.createElement("td");
                cell.setAttribute('id', l);
                cell.setAttribute('data', l);
                row.appendChild(cell);
                l++;
            }
            tableBody2.appendChild(row);
        }
        // Un peu de style
        table2.setAttribute('class', "tableau");
        table2.setAttribute("border", "1px");

        table2.appendChild(tableBody2);
        bodyTab2.appendChild(table2);

        // Bouton des Armes
        document.getElementById("missile").addEventListener("click", event => this.clickWeaponButton(0));
        document.getElementById("torpille").addEventListener("click", event => this.clickWeaponButton(1));
        document.getElementById("bombe_a_fragment").addEventListener("click", event => this.clickWeaponButton(2));
        document.getElementById("radar").addEventListener("click", event => this.clickWeaponButton(3));

        // On cache la box de résultat
        document.getElementById("boxResult").style.visibility = "hidden";

        // Bouton de la box de résultat
        document.getElementById("menuRedirect").addEventListener("click", event => {
            window.location.href="../html/matchmaking.html";
        });

        // Démarrage du temps (pour le calcul de résultat)
        this.t0 = performance.now();
    }

    // Setters de grille
    setGrid1(grid){
        this.p1Grid = grid;
    }

    setGrid2(grid){
        this.p2Grid = grid;
    }

    // Affichage des tableaux en console (debugage)
    printGrid(){
        console.log("p1 : ", this.p1Grid);
        console.log("p2 : ", this.p2Grid);
    }

    // Au tour du player
    setIsMyTurn(){
        this.myTurn = true;
        document.getElementById("ALL_BUTTONS").style.visibility = "visible"; // Afficher les boutons / texte
        document.getElementById("TEXT_SELECTION").style.visibility = "visible";
        document.getElementById("WAITING").style.visibility = "hidden";  // Cacher le texte d'attente
    }

    // Au tour de l'adversaire
    setIsNotMyTurn(){
        this.myTurn = false;
        document.getElementById("ALL_BUTTONS").style.visibility = "hidden"; // Cacher les boutons / texte
        document.getElementById("TEXT_SELECTION").style.visibility = "hidden";
        document.getElementById("WAITING").style.visibility = "visible"; // Afficher le texte d'attente
    }

    // Fonction pour avoir un random entre 0 et max
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    // Fonction de l'affichage de la grille
    showGridP2(){
        for(let i = 0; i < 10; i++){
            for(let j = 0; j < 10; j++){

                let id = i * 10 + j; // Transformation des coordonnées en fonction du tableau dans le html
                let currentElement;

                // Récupération de la case
                document.getElementById("GridPlayer").querySelectorAll("td").forEach(e => e.getAttribute("data") === id.toString() ? currentElement = e : '');
                if(this.p1Grid[i][j] !== 0){
                    let rand = this.getRandomInt(3);
                    if(rand === 0){
                        currentElement.setAttribute("class", "ship1");
                    }
                    else if(rand === 1){
                        currentElement.setAttribute("class", "ship2");
                    }
                    else{
                        currentElement.setAttribute("class", "ship3");
                    }
                }
            }
        }
    }

    // Fonction pour la selection de tir (par bouton)
    clickWeaponButton(data){
        //Retrait du hover
        $('#GridAdversaire td').mouseover(function(){
            const col = $(this).index();
            const row = $(this).closest('tr').index();

            // Reset
            for (let $i = row - 2; $i <= row + 2; $i++){
                for(let $j = col -2; $j<= col + 2; $j++){
                    $('tr:eq('+ $i +') td:eq('+ $j +')').css('background-color', '');
                }
            }
        })
        //Vérification de si l'arme est disponible
        this.currentWeapon = null;
        if(data == 0 || (data == 1 && this.torpilleAvailable == true) || (data == 2 && this.bombeAFragmentAvailable == true) || (data == 3 && this.radarAvailable == true)){
            if(data == 0){
                this.currentWeapon = 0;
            }
            else if(data == 1){
                this.currentWeapon = 1;
            }
            else if(data == 2){
                this.currentWeapon = 2;
            }
            else if(data == 3){
                this.currentWeapon = 3;
            }

            this.setHoverEffects(data);
            
            document.getElementById("GridAdversaire").querySelectorAll("td").forEach(e => e.addEventListener("click", () => this.updateGrid(e)));
        }

        
    }

    // Effet de hover des différentes armes
    setHoverEffects(data){
        // Tir simple / torpille
        if(data == 0 || data == 1){
            $('#GridAdversaire td').mouseover(function(){
                const col = $(this).index();
                const row = $(this).closest('tr').index();
                // Reset
                $('tr:eq('+ row +') td:eq('+ col +')').css('background-color', '');

                $('tr:eq('+ row +') td:eq('+ col +')').css('background-color', '#530f1e');
            })
            $('#GridAdversaire td').mouseleave(function(){
                $('td').css('background-color', '');
            })
        }
        // Bombe à fragment
        else if(data == 2){
            $('#GridAdversaire td').mouseover(function(){
                const col = $(this).index();
                const row = $(this).closest('tr').index();
                // Reset
                $('tr:eq('+ row +') td:eq('+ col +')').css('background-color', '');
                $('tr:eq('+ (row - 1) +') td:eq('+ (col - 1) +')').css('background-color', '');
                $('tr:eq('+ (row - 1) +') td:eq('+ (col + 1) +')').css('background-color', '');
                $('tr:eq('+ (row + 1) +') td:eq('+ (col - 1) +')').css('background-color', '');
                $('tr:eq('+ (row + 1) +') td:eq('+ (col + 1) +')').css('background-color', '');

                $('tr:eq('+ row +') td:eq('+ col +')').css('background-color', '#530f1e');
                if(row - 1 != -1){
                    $('tr:eq('+ (row - 1) +') td:eq('+ (col + 1) +')').css('background-color', '#530f1e');
                }
                if(col - 1 != -1){
                    if(row + 1 != 10){
                        $('tr:eq('+ (row + 1) +') td:eq('+ (col - 1) +')').css('background-color', '#530f1e');
                    }
                    if(row - 1 != -1){
                        $('tr:eq('+ (row - 1) +') td:eq('+ (col - 1) +')').css('background-color', '#530f1e');
                    }
                }
                if(row + 1 != 10){
                    $('tr:eq('+ (row + 1) +') td:eq('+ (col + 1) +')').css('background-color', '#530f1e');
                }
            })
            $('#GridAdversaire td').mouseleave(function(){
                $('td').css('background-color', '');
            })
        }
        // Radar
        else if(data == 3){
            $('#GridAdversaire td').mouseover(function(){
                const col = $(this).index();
                const row = $(this).closest('tr').index();
                // Reset
                $('tr:eq('+ row +') td:eq('+ col +')').css('background-color', '');
                $('tr:eq('+ (row - 1) +') td:eq('+ (col - 1) +')').css('background-color', '');
                $('tr:eq('+ (row - 1) +') td:eq('+ (col + 1) +')').css('background-color', '');
                $('tr:eq('+ (row + 1) +') td:eq('+ (col - 1) +')').css('background-color', '');
                $('tr:eq('+ (row + 1) +') td:eq('+ (col + 1) +')').css('background-color', '');
                $('tr:eq('+ (row + 1) +') td:eq('+ (col) +')').css('background-color', '');
                $('tr:eq('+ (row - 1) +') td:eq('+ (col) +')').css('background-color', '');
                $('tr:eq('+ (row) +') td:eq('+ (col + 1) +')').css('background-color', '');
                $('tr:eq('+ (row) +') td:eq('+ (col - 1) +')').css('background-color', '');



                $('tr:eq('+ row +') td:eq('+ col +')').css('background-color', '#a44322');
                if(col - 1 != -1){
                    if(row - 1 != -1){
                        $('tr:eq('+ (row - 1) +') td:eq('+ (col - 1) +')').css('background-color', '#a44322');
                    }
                    if(row + 1 != 10){    
                        $('tr:eq('+ (row + 1) +') td:eq('+ (col - 1) +')').css('background-color', '#a44322');
                    }
                    $('tr:eq('+ (row) +') td:eq('+ (col - 1) +')').css('background-color', '#a44322');
                }
                if(row + 1 != 10){    
                    $('tr:eq('+ (row + 1) +') td:eq('+ (col + 1) +')').css('background-color', '#a44322');
                    $('tr:eq('+ (row + 1) +') td:eq('+ (col) +')').css('background-color', '#a44322');
                }
                if(row - 1 != -1){    
                    $('tr:eq('+ (row - 1) +') td:eq('+ (col + 1) +')').css('background-color', '#a44322');
                    $('tr:eq('+ (row - 1) +') td:eq('+ (col) +')').css('background-color', '#a44322');
                }
                $('tr:eq('+ (row) +') td:eq('+ (col + 1) +')').css('background-color', '#a44322');
            })
            $('#GridAdversaire td').mouseleave(function(){
                $('td').css('background-color', '');
            })
        }
    }

    // Update de la grille après un tir
    updateGrid(element){
        //Retrait du hover
        $('#GridAdversaire td').mouseover(function(){
            const col = $(this).index();
            const row = $(this).closest('tr').index();

            // Reset
            for (let $i = row - 2; $i <= row + 2; $i++){
                for(let $j = col -2; $j<= col + 2; $j++){
                    $('tr:eq('+ $i +') td:eq('+ $j +')').css('background-color', '');
                }
            }
        })

        // Calcul des coordonnées x et y
        let x = Math.floor((element.getAttribute("data")) / 10);
        let y = Math.floor((element.getAttribute("data")) % 10);

        // Calcul des différentes id de case à update selon le type de tir
        let id;
        if(this.currentWeapon == 0 || this.currentWeapon == 1){
            id = x * 10 + y;
        }
        else if(this.currentWeapon == 2){
            id = [x * 10 + y, 
                (x + 1) * 10 + y + 1, 
                (x + 1) * 10 + y - 1,
                (x - 1) * 10 + y - 1,
                (x - 1) * 10 + y + 1]
        }
        else if(this.currentWeapon == 3){
            id = [x * 10 + y, 
                (x + 1) * 10 + y + 1, 
                (x + 1) * 10 + y - 1,
                (x - 1) * 10 + y - 1,
                (x - 1) * 10 + y + 1,
                (x + 1) * 10 + y,
                (x - 1) * 10 + y,
                (x) * 10 + y + 1,
                (x) * 10 + y - 1]
        }
        let currentElement;
        let currentElementPlayer;

        // Tir simple
        if(this.currentWeapon == 0){
            this.nbShot++;
            this.t1 = performance.now();
            this.timeSpent += this.t1 - this.t0; //Calcul du temps
            this.t0 = performance.now(); // Redemarrage du temps
            // Si un bateau est touché
            if(this.p2Grid[x][y] !== 0 && this.p2Grid[x][y] !== -1){
                document.getElementById("GridAdversaire").querySelectorAll("td").forEach(e => e.getAttribute("data") === id.toString() ? currentElement = e : '');
                let rand = this.getRandomInt(3);
                if(rand === 0){
                    currentElement.setAttribute("class", "ship1");
                }
                else if(rand === 1){
                    currentElement.setAttribute("class", "ship2");
                }
                else{
                    currentElement.setAttribute("class", "ship3");
                }
                this.p2Grid[x][y] = 10;
                this.nbTouchedCase++;
            }
            // Si un bateau n'est pas touché
            else{
                document.getElementById("GridAdversaire").querySelectorAll("td").forEach(e => e.getAttribute("data") === id.toString() ? currentElement = e : '');
                currentElement.setAttribute("class", "caseTouched");
                this.p2Grid[x][y] = -1
            }
            // Reset de l'arme
            this.currentWeapon = null;
        }
        // Torpille (assez tricky à comprendre)
            // Le pb rencontré est que dans la grille nous avons différents bateaux caractèrisés par des chiffres différents. 
            // Par contre, nous avons 2 fois le bateau de 3 cases;
            // Donc pour le bateau de 3 cases il a fallu de faire pas mal de tests assez chiants (cf ligne 458)
        else if(this.currentWeapon == 1){
            this.nbShot++;//Calcul du temps
            this.t1 = performance.now();
            this.timeSpent += this.t1 - this.t0;
            this.t0 = performance.now();
            if(this.p2Grid[x][y] !== 0 && this.p2Grid[x][y] !== -1){
                let typeOfBoat = this.p2Grid[x][y];
                let count = 0;
                // Calcul du nombre de cases restantes du bateau tiré
                for(let i = 0; i < 10; i++){
                    for(let j = 0; j < 10; j++){
                        if(this.p2Grid[i][j] == typeOfBoat){
                            count++;
                        }
                    }
                }
                // Cas où ce n'est pas un bateau de 3 et que le nombre de cases restantes est inférieur à 3
                if(count > 3 && this.p2Grid[x][y] !== 3){
                    document.getElementById("GridAdversaire").querySelectorAll("td").forEach(e => e.getAttribute("data") === id.toString() ? currentElement = e : '');
                    let rand = this.getRandomInt(3);
                    if(rand === 0){
                        currentElement.setAttribute("class", "ship1");
                    }
                    else if(rand === 1){
                        currentElement.setAttribute("class", "ship2");
                    }
                    else{
                        currentElement.setAttribute("class", "ship3");
                    }
                    this.p2Grid[x][y] = 10;
                    this.nbTouchedCase++;
                }
                // Cas où ce n'est pas un bateau de 3 et que le nombre de cases restantes est supérieur à 3
                else{
                    if(this.p2Grid[x][y] !== 3){
                        for(let i = 0; i < 10; i++){
                            for(let j = 0; j < 10; j++){
                                if(this.p2Grid[i][j] == typeOfBoat){
                                    let newId = i * 10 + j;
                                    document.getElementById("GridAdversaire").querySelectorAll("td").forEach(e => e.getAttribute("data") === newId.toString() ? currentElement = e : '');
                                    let rand = this.getRandomInt(3);
                                    if(rand === 0){
                                        currentElement.setAttribute("class", "ship1");
                                    }
                                    else if(rand === 1){
                                        currentElement.setAttribute("class", "ship2");
                                    }
                                    else{
                                        currentElement.setAttribute("class", "ship3");
                                    }
                                    this.p2Grid[i][j] = 10;
                                    this.nbTouchedCase++;
                                }
                            }
                        }
                    }
                    // Cas où c'est un bateau de 3 
                    else if(this.p2Grid[x][y] === 3){
                        // Si il y a moins de 3 cases avec 3
                        if(count <= 3){
                            for(let i = 0; i < 10; i++){
                                for(let j = 0; j < 10; j++){
                                    if(this.p2Grid[i][j] == typeOfBoat){
                                        let newId = i * 10 + j;
                                        document.getElementById("GridAdversaire").querySelectorAll("td").forEach(e => e.getAttribute("data") === newId.toString() ? currentElement = e : '');
                                        let rand = this.getRandomInt(3);
                                        if(rand === 0){
                                            currentElement.setAttribute("class", "ship1");
                                        }
                                        else if(rand === 1){
                                            currentElement.setAttribute("class", "ship2");
                                        }
                                        else{
                                            currentElement.setAttribute("class", "ship3");
                                        }
                                        this.p2Grid[i][j] = 10;
                                        this.nbTouchedCase++;
                                    }
                                }
                            }
                        }
                        // Cas où c'est un bateau de 3 et qu'il reste plus de 3 cases avec ce type de bateau
                            // Explication : on parcourt 5 cases autour du tir et on détruit les cases dans cet zones 
                            // EASTER EGG : si deux bateaux de 3 sont collés ils sont tous les deux détruits (easter egg non voulu initialement)  
                        else{
                            for(let i = x-2; i < x+2 ; i++){
                                for(let j = y-2; j < y+2; j++){
                                    if(this.p2Grid[i][j] === 3){
                                        let newId = i * 10 + j;
                                        document.getElementById("GridAdversaire").querySelectorAll("td").forEach(e => e.getAttribute("data") === newId.toString() ? currentElement = e : '');
                                        let rand = this.getRandomInt(3);
                                        if(rand === 0){
                                            currentElement.setAttribute("class", "ship1");
                                        }
                                        else if(rand === 1){
                                            currentElement.setAttribute("class", "ship2");
                                        }
                                        else{
                                            currentElement.setAttribute("class", "ship3");
                                        }
                                        this.p2Grid[i][j] = 10;
                                        this.nbTouchedCase++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            // SINON case vide (tir râté)
            else{
                document.getElementById("GridAdversaire").querySelectorAll("td").forEach(e => e.getAttribute("data") === id.toString() ? currentElement = e : '');
                currentElement.setAttribute("class", "caseTouched");
                this.p2Grid[x][y] = -1
            }
            this.torpilleAvailable = false; // Torpille plus dispo
            document.getElementById("torpille").setAttribute("class", "custom-btn btn-use");
            this.currentWeapon = null;
        }
        // Bombe à fragment
        else if(this.currentWeapon == 2){
            this.nbShot++;
            //Calcul du temps
            this.t1 = performance.now();
            this.timeSpent += this.t1 - this.t0;
            this.t0 = performance.now();
            let x0 = Math.floor(id[0] / 10);
            // Parcours des différents ID à traiter
            for(let i = 0; i < id.length; i++){
                if(id[i] >= 0 && id[i] <= 99){
                    let x = Math.floor(id[i] / 10);
                    let y = Math.floor(id[i] % 10);
                    // If pour eviter les problèmes de type sortie de grille
                    if((x != x0-2 && x != x0+2 && x != x0) || (x == x0 && i == 0)){
                        // Case touchée
                        if(this.p2Grid[x][y] !== 0 && this.p2Grid[x][y] !== -1){
                            document.getElementById("GridAdversaire").querySelectorAll("td").forEach(e => e.getAttribute("data") === id[i].toString() ? currentElement = e : '');
                            let rand = this.getRandomInt(3);
                            if(rand === 0){
                                currentElement.setAttribute("class", "ship1");
                            }
                            else if(rand === 1){
                                currentElement.setAttribute("class", "ship2");
                            }
                            else{
                                currentElement.setAttribute("class", "ship3");
                            }
                            this.p2Grid[x][y] = 10;
                            this.nbTouchedCase++;
                        }
                        // Case non touchée
                        else{
                            document.getElementById("GridAdversaire").querySelectorAll("td").forEach(e => e.getAttribute("data") === id[i].toString() ? currentElement = e : '');
                            currentElement.setAttribute("class", "caseTouched");
                            this.p2Grid[x][y] = -1
                        }
                    }
                }
            }
            this.bombeAFragmentAvailable = false; // Bombe à fragment plus dispo
            document.getElementById("bombe_a_fragment").setAttribute("class", "custom-btn btn-use");
            this.currentWeapon = null;
        }
        // Radar (Concept : faire apparaître les cases pendant 5 secondes)
        else if(this.currentWeapon == 3){
            this.nbShot++;
            //Calcul du temps
            this.t1 = performance.now();
            this.timeSpent += this.t1 - this.t0;
            this.t0 = performance.now();
            let x0 = Math.floor(id[0] / 10);
            for(let i = 0; i < id.length; i++){
                if(id[i] >= 0 && id[i] <= 99){
                    let x = Math.floor(id[i] / 10);
                    let y = Math.floor(id[i] % 10);
                    // LE IF DE L'INFINI : If pour eviter les problèmes de type sortie de grille
                    if((x != x0-2 && x != x0+2 && x != x0 && x != x0-1 && x != x0+1) || (x == x0 && (i == 0 || i == 7 || i == 8)) || (x == x0-1 && (i == 3 || i == 4 || i == 6)) || (x == x0+1 && (i == 1 || i == 2 || i == 5))){
                        // Case touchée
                        if(this.p2Grid[x][y] !== 0 && this.p2Grid[x][y] !== -1){
                            document.getElementById("GridAdversaire").querySelectorAll("td").forEach(e => e.getAttribute("data") === id[i].toString() ? currentElement = e : '');
                            let rand = this.getRandomInt(3);
                            if(rand === 0){
                                currentElement.setAttribute("class", "ship1Radar");
                            }
                            else if(rand === 1){
                                currentElement.setAttribute("class", "ship2Radar");
                            }
                            else{
                                currentElement.setAttribute("class", "ship3Radar");
                            }
                        }
                        // Case non touchée
                        else{
                            document.getElementById("GridAdversaire").querySelectorAll("td").forEach(e => e.getAttribute("data") === id[i].toString() ? currentElement = e : '');
                            currentElement.setAttribute("class", "caseTouchedRadar");
                        }
                    }
                }
            }
            // Pause de 5 secondes puis on fait disparaître (sans faire disparaître les cases déjà découvertent)
            setTimeout(() => {
                for(let i = 0; i < id.length; i++){
                    if(id[i] >= 0 && id[i] <= 99){
                        let x = Math.floor(id[i] / 10);
                        let y = Math.floor(id[i] % 10);
                        if(this.p2Grid[x][y] === 10){
                            document.getElementById("GridAdversaire").querySelectorAll("td").forEach(e => e.getAttribute("data") === id[i].toString() ? currentElement = e : '');
                            let rand = this.getRandomInt(3);
                            if(rand === 0){
                                currentElement.setAttribute("class", "ship1");
                            }
                            else if(rand === 1){
                                currentElement.setAttribute("class", "ship2");
                            }
                            else{
                                currentElement.setAttribute("class", "ship3");
                            }
                        }
                        else if(this.p2Grid[x][y] === -1){
                            document.getElementById("GridAdversaire").querySelectorAll("td").forEach(e => e.getAttribute("data") === id[i].toString() ? currentElement = e : '');
                            currentElement.setAttribute("class", "caseTouched");
                        }
                        else{
                            document.getElementById("GridAdversaire").querySelectorAll("td").forEach(e => e.getAttribute("data") === id[i].toString() ? currentElement = e : '');
                            currentElement.setAttribute("class", "");
                        }
                    }
                }

            }, 5000);

            this.radarAvailable = false; // Radar plus disponible
            document.getElementById("radar").setAttribute("class", "custom-btn btn-use");
            this.currentWeapon = null;
        }
        // Après le tir on envoie la grille modifiée à l'adversaire
        socket.emit("p2WantsGrid", this.p2Grid);
        // Au tour de l'adversaire
        this.setIsNotMyTurn();
        // Vérification de si la partie est terminée (victoire ou défaite)
        if(this.isGameWin()){
            let finalScore = this.calculateScore(500);
            document.getElementById("boxResult").style.visibility = "visible";
            document.getElementById("Result").textContent = "You win ! Your score is " + finalScore;
        }
        else if(this.isGameLoose()){
            let finalScore = this.calculateScore(-500);
            document.getElementById("boxResult").style.visibility = "visible";
            document.getElementById("Result").textContent = "You loose ! Your score is " + finalScore;
        }
    }

    // Update de la grille après reception du tir de l'adversaire
    updatePlayerGrid(){
        for(let i = 0; i < 10; i++){
            for(let j = 0; j < 10; j++){
                if(this.p1Grid[i][j] == 10){
                    let id = i * 10 + j;
                    let currentElementPlayer;
                    document.getElementById("GridPlayer").querySelectorAll("td").forEach(e => e.getAttribute("data") === id.toString() ? currentElementPlayer = e : '');
                    currentElementPlayer.setAttribute("class", "caseTouched");
                }
                else if(this.p1Grid[i][j] == -1){
                    let id = i * 10 + j;
                    let currentElementPlayer;
                    document.getElementById("GridPlayer").querySelectorAll("td").forEach(e => e.getAttribute("data") === id.toString() ? currentElementPlayer = e : '');
                    currentElementPlayer.setAttribute("class", "caseNotTouched");
                }
            }
        }
        // Vérification de si la partie est terminée (victoire ou défaite)
        if(this.isGameWin()){
            let finalScore = this.calculateScore(500);
            document.getElementById("boxResult").style.visibility = "visible";
            document.getElementById("Result").textContent = "You win ! Your score is " + finalScore;
        }
        else if(this.isGameLoose()){
            let finalScore = this.calculateScore(-500);
            document.getElementById("boxResult").style.visibility = "visible";
            document.getElementById("Result").textContent = "You loose ! Your score is " + finalScore;
        }
    }

    // Fonction de vérification de victoire
    isGameWin(){
        for(let i = 0; i < 10; i++){
            for(let j = 0; j < 10; j++){
                if(this.p2Grid[i][j] != 0 && this.p2Grid[i][j] != -1 && this.p2Grid[i][j] != 10){
                    return(false);
                }
            }
        }
        return(true);
    }

    // Fonction de vérification de défaite
    isGameLoose(){
        for(let i = 0; i < 10; i++){
            for(let j = 0; j < 10; j++){
                if(this.p1Grid[i][j] != 0 && this.p1Grid[i][j] != -1 && this.p1Grid[i][j] != 10){
                    return(false);
                }
            }
        }
        return(true);
    }

    // Calcul du score
    calculateScore(bonus){
        let score = 0;
        let touchedRatio = this.nbTouchedCase/this.nbShot;
        let timeRatio = (this.timeSpent / 1000) / this.nbShot;
        let timeBonus = 0;
        let touchedBonus = 0
        let weaponRemaining = 0;
        let weaponBonus = 0;
        if(this.torpilleAvailable){
            weaponRemaining++;
        }
        if(this.bombeAFragmentAvailable){
            weaponRemaining++;
        }
        if(this.radarAvailable){
            weaponRemaining++;
        }

        timeBonus = this.getTimeBonus(timeRatio);
        touchedBonus = this.getTouchedBonus(touchedRatio);
        weaponBonus = this.getWeaponBonus(weaponRemaining);

        score = timeBonus + touchedBonus + weaponBonus + bonus;

        return score;
    }

    // Calcul du bonus d'armes restantes
    getWeaponBonus(data){
        if(data == 3){
            return 1500;
        }
        else if(data = 2){
            return 750;
        }
        else if(data = 1){
            return 400;
        }
        else if(data = 0){
            return 100;
        }
    }

    // Calcul du bonus ratio touché/tir
    getTouchedBonus(data){
        if(data >= 2){
            return 1000;
        }
        else if(data < 2 && data >= 1){
            return 750;
        }
        else if(data < 1 && data >= 0.5){
            return 500;
        }
        else if(data < 0.5 && data >= 0.25){
            return 275;
        }
        else if(data < 0.25){
            return 100;
        }
    }

    // Calcul du bonus du temps pour faire un coup moyen
    getTimeBonus(data){
        if(data <= 5){
            return 1000;
        }
        else if(data > 5 && data <= 8){
            return 700;
        }
        else if(data > 8 && data <= 12){
            return 450;
        }
        else if(data > 12 && data <= 20){
            return 275;
        }
        else if(data > 20){
            return 100;
        }
    }
}


game = new BATOGame;

// Différentes récepetions d'informations côté back 
socket.on("sendGrid", (grid, i)=>{
    game.setIsNotMyTurn()
    game.setGrid1(grid[i]);
    if(i == 1){//Si 2e joueur a rejoint
        game.setIsMyTurn();
        game.setGrid2(grid[i-1]);
        socket.emit("p1WantsGrid", grid[i]);
        //game.printGrid();   
        game.showGridP2();
    }
    
})

socket.on("hereItIs", (grid)=>{
    game.setGrid2(grid);
    game.showGridP2();
    game.updatePlayerGrid();
    //game.printGrid();
})

socket.on("getShot", (grid) =>{
    game.setGrid1(grid);
    game.updatePlayerGrid();
    game.setIsMyTurn();
    if(game.isGameLoose()){
        let finalScore = game.calculateScore(-500)
        document.getElementById("Result").textContent = "You loose ! Your score is " + finalScore;
    }   
    //game.printGrid();
})