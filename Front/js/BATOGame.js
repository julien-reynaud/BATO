//let socket = io();

/*window.onload = socket.emit("room", "room2");
window.onload = socket.emit("askGrid");
if(p1Grid.length == 0){
    socket.on("sendGrid", (grid)=>{
        p1Grid = grid;
    })
}
else{
    socket.on("sendGrid", (grid)=>{
        p2Grid = grid;
    })
}*/
socket.emit("room", "room1");
socket.emit("askGrid");
var cmptG = 0;

class BATOGame {

    /*p1Grid = [
        [0, 0, 0, 0, 2, 2, 2, 2, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 3, 3, 3, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 4, 4, 0, 0],
        [0, 0, 0, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 3, 0, 0, 0, 0, 0, 0]
    ];
    p2Grid = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 0, 0, 3, 3, 3, 0, 0],
        [0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 0, 3, 0, 0, 0, 0, 0],
        [0, 2, 0, 0, 3, 0, 0, 4, 4, 0],
        [0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ];*/

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

    constructor() {
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
        //socket.on("p1Grid", (grid) => {
        //    this.p1Grid = grid;
        //});
        //socket.on("p2Grid", (grid) => {
        //    this.p2Grid = grid;
        //});
//
        //socket.emit("getP1Grid");
        //socket.emit("getP2Grid");
        //console.log(this.p1Grid, this.p2Grid);

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
                //cell.setAttribute('id', "cell" + i + j);
                cell.setAttribute('id', l);
                cell.setAttribute('data', l);
                //cell.textContent = cell.getAttribute('data');
                //console.log(cell);
                row.appendChild(cell);
                l++;
            }
            tableBody.appendChild(row);
        }
        //console.log(this.grid);
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
                //cell.setAttribute('id', "cell" + i + j);
                cell.setAttribute('id', l);
                cell.setAttribute('data', l);
                //cell.textContent = cell.getAttribute('data');
                //console.log(cell);
                row.appendChild(cell);
                l++;
            }
            tableBody2.appendChild(row);
        }
        //console.log(this.grid);
        // Un peu de style
        table2.setAttribute('class', "tableau");
        table2.setAttribute("border", "1px");

        table2.appendChild(tableBody2);
        bodyTab2.appendChild(table2);

        //Bouton des Armes
        document.getElementById("missile").addEventListener("click", event => this.clickWeaponButton(0));
        document.getElementById("torpille").addEventListener("click", event => this.clickWeaponButton(1));
        document.getElementById("bombe_a_fragment").addEventListener("click", event => this.clickWeaponButton(2));
        document.getElementById("radar").addEventListener("click", event => this.clickWeaponButton(3));

        //this.showGridP2();

        this.t0 = performance.now();
    }

    setGrid1(grid){
        //if(cmptG == 0){
        this.p1Grid = grid;
            //cmptG += 1;
        //}
        //else{
            //this.p2Grid = grid;
        //}
    }
    setGrid2(grid){
        //if(cmptG == 0){
        this.p2Grid = grid;
            //cmptG += 1;
        //}
        //else{
            //this.p2Grid = grid;
        //}
    }
    printGrid(){
        console.log("p1 : ", this.p1Grid);
        console.log("p2 : ", this.p2Grid);
    }

    setIsMyTurn(){
        this.myTurn = true;
        document.getElementById("ALL_BUTTONS").style.visibility = "visible";
        document.getElementById("TEXT_SELECTION").style.visibility = "visible";
        document.getElementById("WAITING").style.visibility = "hidden";
        document.getElementById("WAITING").style.visibility = "hidden";
    }

    setIsNotMyTurn(){
        this.myTurn = false;
        document.getElementById("ALL_BUTTONS").style.visibility = "hidden";
        document.getElementById("TEXT_SELECTION").style.visibility = "hidden";
        document.getElementById("WAITING").style.visibility = "visible";
        document.getElementById("WAITING").style.visibility = "visible";
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
        //Vérification de si l'arme est
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

    setHoverEffects(data){
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

        let x = Math.floor((element.getAttribute("data")) / 10);
        let y = Math.floor((element.getAttribute("data")) % 10);

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

        // TIR SIMPLE
        if(this.currentWeapon == 0){
            this.nbShot++;//Calcul du temps
            this.t1 = performance.now();
            this.timeSpent += this.t1 - this.t0;
            this.t0 = performance.now();
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
            else{
                document.getElementById("GridAdversaire").querySelectorAll("td").forEach(e => e.getAttribute("data") === id.toString() ? currentElement = e : '');
                currentElement.setAttribute("class", "caseTouched");
                this.p2Grid[x][y] = -1
            }
            this.currentWeapon = null;
        }
        else if(this.currentWeapon == 1){
            this.nbShot++;//Calcul du temps
            this.t1 = performance.now();
            this.timeSpent += this.t1 - this.t0;
            this.t0 = performance.now();
            if(this.p2Grid[x][y] !== 0 && this.p2Grid[x][y] !== -1){
                let typeOfBoat = this.p2Grid[x][y];
                let count = 0;
                for(let i = 0; i < 10; i++){
                    for(let j = 0; j < 10; j++){
                        if(this.p2Grid[i][j] == typeOfBoat){
                            count++;
                        }
                    }
                }
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
                    else if(this.p2Grid[x][y] === 3){
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
            else{
                document.getElementById("GridAdversaire").querySelectorAll("td").forEach(e => e.getAttribute("data") === id.toString() ? currentElement = e : '');
                currentElement.setAttribute("class", "caseTouched");
                this.p2Grid[x][y] = -1
            }
            this.torpilleAvailable = false;
            document.getElementById("torpille").setAttribute("class", "custom-btn btn-use");
            this.currentWeapon = null;
        }
        else if(this.currentWeapon == 2){
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
                    if((x != x0-2 && x != x0+2 && x != x0) || (x == x0 && i == 0)){
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
                        else{
                            document.getElementById("GridAdversaire").querySelectorAll("td").forEach(e => e.getAttribute("data") === id[i].toString() ? currentElement = e : '');
                            currentElement.setAttribute("class", "caseTouched");
                            this.p2Grid[x][y] = -1
                        }
                    }
                }
            }
            this.bombeAFragmentAvailable = false;
            document.getElementById("bombe_a_fragment").setAttribute("class", "custom-btn btn-use");
            this.currentWeapon = null;
        }
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
                    if((x != x0-2 && x != x0+2 && x != x0 && x != x0-1 && x != x0+1) || (x == x0 && (i == 0 || i == 7 || i == 8)) || (x == x0-1 && (i == 3 || i == 4 || i == 6)) || (x == x0+1 && (i == 1 || i == 2 || i == 5))){
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
                        else{
                            document.getElementById("GridAdversaire").querySelectorAll("td").forEach(e => e.getAttribute("data") === id[i].toString() ? currentElement = e : '');
                            currentElement.setAttribute("class", "caseTouchedRadar");
                        }
                    }
                }
            }
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

            this.radarAvailable = false;
            document.getElementById("radar").setAttribute("class", "custom-btn btn-use");
            this.currentWeapon = null;
        }
        socket.emit("p2WantsGrid", this.p2Grid);
        this.setIsNotMyTurn();
        if(this.isGameWin()){
            let finalScore = this.calculateScore(500)
            document.getElementById("Result").textContent = "You win ! Your score is " + finalScore;
        }
        else if(this.isGameLoose()){
            let finalScore = this.calculateScore(-500)
            document.getElementById("Result").textContent = "You loose ! Your score is " + finalScore;
        }
    }

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
        if(this.isGameWin()){
            let finalScore = this.calculateScore()
            document.getElementById("Result").textContent = "You win ! Your score is " + finalScore;
        }
        else if(this.isGameLoose()){
            let finalScore = this.calculateScore()
            document.getElementById("Result").textContent = "You loose ! Your score is " + finalScore;
        }
    }

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

    calculateScore(bonus){
        let score = 0;
        let touchedRatio = this.nbTouchedCase/this.nbShot;
        let timeRatio = (this.timeSpent / 1000) / this.nbShot;
        let timeBonus = 0;
        let touchedBonus = 0
        let weaponRemaining = 0;
        let weaponBonus = 0;
        //console.log("nbShot :", this.nbShot, "nbTouchedCase :", this.nbTouchedCase, "Ratio Touched/Shot :", touchedRatio);
        //console.log("Available weapon :");
        if(this.torpilleAvailable){
            weaponRemaining++;
            //console.log("    Torpille");
        }
        if(this.bombeAFragmentAvailable){
            weaponRemaining++;
            //console.log("    Bombe à fragment");
        }
        if(this.radarAvailable){
            weaponRemaining++;
            //console.log("    Radar");
        }

        timeBonus = this.getTimeBonus(timeRatio);
        touchedBonus = this.getTouchedBonus(touchedRatio);
        weaponBonus = this.getWeaponBonus(weaponRemaining);

        //console.log("Bonus :   time -", timeBonus, "   touched -", touchedBonus, "   weapon -", weaponBonus)

        score = timeBonus + touchedBonus + weaponBonus + bonus;

        return score;
    }

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
socket.on("sendGrid", (grid, i)=>{
    game.setIsNotMyTurn()
    game.setGrid1(grid[i]);
    if(i == 1){//Si 2e joueur a rejoint
        game.setIsMyTurn();
        game.setGrid2(grid[i-1]);
        socket.emit("p1WantsGrid", grid[i]);
        game.printGrid();   
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
    //game.printGrid();
})