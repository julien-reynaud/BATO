//let socket = io();

class BATOGame {

    p1Grid = [
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
      ];

    currentWeapon;
    torpilleAvailable = true;
    bombeAFragmentAvailable = true;
    radarAvailable = true;

    constructor() {
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
                var cell = document.createElement("td");
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
                var cell = document.createElement("td");
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

        this.showGridP2();
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
                $('tr:eq('+ (row - 1) +') td:eq('+ (col - 1) +')').css('background-color', '#530f1e');
                $('tr:eq('+ (row - 1) +') td:eq('+ (col + 1) +')').css('background-color', '#530f1e');
                $('tr:eq('+ (row + 1) +') td:eq('+ (col - 1) +')').css('background-color', '#530f1e');
                $('tr:eq('+ (row + 1) +') td:eq('+ (col + 1) +')').css('background-color', '#530f1e');
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
                $('tr:eq('+ (row - 1) +') td:eq('+ (col - 1) +')').css('background-color', '#a44322');
                $('tr:eq('+ (row - 1) +') td:eq('+ (col + 1) +')').css('background-color', '#a44322');
                $('tr:eq('+ (row + 1) +') td:eq('+ (col - 1) +')').css('background-color', '#a44322');
                $('tr:eq('+ (row + 1) +') td:eq('+ (col + 1) +')').css('background-color', '#a44322');
                $('tr:eq('+ (row + 1) +') td:eq('+ (col) +')').css('background-color', '#a44322');
                $('tr:eq('+ (row - 1) +') td:eq('+ (col) +')').css('background-color', '#a44322');
                $('tr:eq('+ (row) +') td:eq('+ (col + 1) +')').css('background-color', '#a44322');
                $('tr:eq('+ (row) +') td:eq('+ (col - 1) +')').css('background-color', '#a44322');
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

        // TIR SIMPLE
        if(this.currentWeapon == 0){
            if(this.p1Grid[x][y] !== 0 && this.p1Grid[x][y] !== -1){
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
                this.p1Grid[x][y] = 10;
            }
            else{
                document.getElementById("GridAdversaire").querySelectorAll("td").forEach(e => e.getAttribute("data") === id.toString() ? currentElement = e : '');
                currentElement.setAttribute("class", "caseTouched");
                this.p1Grid[x][y] = -1
            }
            this.currentWeapon = null;
        }
        else if(this.currentWeapon == 1){
            this.torpilleAvailable = false;
            document.getElementById("torpille").setAttribute("class", "custom-btn btn-use");
            this.currentWeapon = null;
        }
        else if(this.currentWeapon == 2){
            for(let i = 0; i < id.length; i++){
                let x = Math.floor(id[i] / 10);
                let y = Math.floor(id[i] % 10);
                if(this.p1Grid[x][y] !== 0 && this.p1Grid[x][y] !== -1){
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
                    this.p1Grid[x][y] = 10;
                }
                else{
                    document.getElementById("GridAdversaire").querySelectorAll("td").forEach(e => e.getAttribute("data") === id[i].toString() ? currentElement = e : '');
                    currentElement.setAttribute("class", "caseTouched");
                    this.p1Grid[x][y] = -1
                }
            }
            this.bombeAFragmentAvailable = false;
            document.getElementById("bombe_a_fragment").setAttribute("class", "custom-btn btn-use");
            this.currentWeapon = null;
        }
        else if(this.currentWeapon == 3){
            for(let i = 0; i < id.length; i++){
                let x = Math.floor(id[i] / 10);
                let y = Math.floor(id[i] % 10);
                if(this.p1Grid[x][y] !== 0 && this.p1Grid[x][y] !== -1){
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
            setTimeout(() => {
                for(let i = 0; i < id.length; i++){
                    let x = Math.floor(id[i] / 10);
                    let y = Math.floor(id[i] % 10);
                    if(this.p1Grid[x][y] === 10){
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
                    else if(this.p1Grid[x][y] === -1){
                        document.getElementById("GridAdversaire").querySelectorAll("td").forEach(e => e.getAttribute("data") === id[i].toString() ? currentElement = e : '');
                        currentElement.setAttribute("class", "caseTouched");
                    }
                    else{
                        document.getElementById("GridAdversaire").querySelectorAll("td").forEach(e => e.getAttribute("data") === id[i].toString() ? currentElement = e : '');
                        currentElement.setAttribute("class", "");
                    }
                }

            }, 5000);

            this.radarAvailable = false;
            document.getElementById("radar").setAttribute("class", "custom-btn btn-use");
            this.currentWeapon = null;
        }
    }

}

game = new BATOGame;