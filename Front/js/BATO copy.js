class BATO {
    grid; // Grille du jeu
    event;  // Liste d'événements
    shipList = [0, 1, 2, 2, 3]; // Liste de bateau
    currentShip; // Bateau actuel
    currentDirection = 2; // Direction actuelle

    constructor() {

        let body = document.getElementsByTagName("body")[0];
        let table = document.createElement("table");
        let tableBody = document.createElement("tbody");

        this.grid = new Array(10);
        for (let k = 0; k < 10; k++) {
            this.grid[k] = new Array(10);
        }
        let l = 0;
        for (let i = 0; i < 10; i++) {
            let row = document.createElement("tr");
            for (let j = 0; j < 10; j++) {
                var cell = document.createElement("td");
                cell.setAttribute('id', "cell" + i + j);
                cell.setAttribute('data', l);
                //console.log(cell);
                row.appendChild(cell);
                this.grid[i][j] = 0;
                l++;
            }
            tableBody.appendChild(row);
        }
        console.log(this.grid);
        table.setAttribute("id", "tableau");
        table.setAttribute("width", "600px");
        table.setAttribute("height", "600px");
        table.setAttribute("border", "1");

        table.appendChild(tableBody);
        body.appendChild(table);
        
        // Puis on l'utilise lorsque l'une des cases du jeu est cliquée
        //document.querySelectorAll("td").forEach(e => e.addEventListener("click", () => this.click(e)));

        // Boutton de choix de bateau
        document.getElementById("porteAvion").addEventListener("click", event => this.clickShipButton(0));
        document.getElementById("croiseur").addEventListener("click", event => this.clickShipButton(1));
        document.getElementById("contreTorpilleur").addEventListener("click", event => this.clickShipButton(2));
        document.getElementById("torpilleur").addEventListener("click", event => this.clickShipButton(3));
    }

    logKey(key){
        if(key.code == "KeyR"){
            if(this.currentDirection == 1){
                this.currentDirection = 2;
                //console.log(this.currentDirection);
                console.log("Vertical");             
                document.getElementById("direction").textContent = "Vertical";
                //document.querySelectorAll("td").forEach(e => e.addEventListener("click", () => this.clickGrid(e)));
            }
            else{
                this.currentDirection = 1;
                //console.log(this.currentDirection);
                console.log("Horizontal");
                document.getElementById("direction").textContent = "Horizontal";
                //document.querySelectorAll("td").forEach(e => e.addEventListener("click", () => this.clickGrid(e)));
            }
        }
        
    }

    showCurrentShip(){
        if(this.currentShip == 0){
            console.log("Porte Avion");
            document.getElementById("currentShip").textContent = "Current ship : Porte Avion";
            document.getElementById("direction").textContent = "Vertical";  
        }
        else if(this.currentShip == 1){
            console.log("Croiseur V");
            document.getElementById("currentShip").textContent = "Current ship : Croiseur";
            document.getElementById("direction").textContent = "Vertical";
        }
        else if(this.currentShip == 2){
            console.log("Contre-Torpilleur V");
            document.getElementById("currentShip").textContent = "Current ship : Contre-Torpilleur";
            document.getElementById("direction").textContent = "Vertical";                
        }
        else if(this.currentShip == 3){
            console.log("Torpilleur V");
            document.getElementById("currentShip").textContent = "Current ship : Torpilleur";
            document.getElementById("direction").textContent = "Vertical";
        }
    }

    clickGrid(element){
        let x = Math.floor((element.getAttribute("data")) / 10);
        let y = Math.floor((element.getAttribute("data")) % 10);
        //console.log(x , y);
        this.updateGrid(x,y);
    }

    updateGrid(x, y){
        console.log(this.currentDirection());
        if(this.currentDirection == 1){
            if(this.currentShip == 0){
                this.grid[x][y-1] = 1;
                this.grid[x][y-2] = 1;
                this.grid[x][y+1] = 1;
                this.grid[x][y+2] = 1;
            }
            else if(this.currentShip == 1){
                this.grid[x][y-2] = 1;
                this.grid[x][y-1] = 1;
                this.grid[x][y+1] = 1;
            }
            else if(this.currentShip == 2){
                this.grid[x][y-1] = 1;
                this.grid[x][y+1] = 1;
            }
            else if(this.currentShip == 3){
                this.grid[x][y-1] = 1;
            }

        }
        else{
            if(this.currentShip == 0){
                this.grid[x-1][y] = 1;
                this.grid[x-2][y] = 1;
                this.grid[x+1][y] = 1;
                this.grid[x+2][y] = 1;
            }
            else if(this.currentShip == 1){
                this.grid[x-2][y] = 1;
                this.grid[x-1][y] = 1;
                this.grid[x+1][y] = 1;
            }
            else if(this.currentShip == 2){
                this.grid[x-1][y] = 1;
                this.grid[x+1][y] = 1;
            }
            else if(this.currentShip == 3){
                this.grid[x-1][y] = 1;
            }
        }

        this.grid[x][y] = 1;
        console.log(this.grid);
        this.showGrid();
    }

    clickShipButton(data){
        if(data == 0){
            //this.currentDirection = 2;
            this.currentShip = 0;
            this.showCurrentShip();
        }
        else if(data == 1){
            //this.currentDirection = 2;
            this.currentShip = 1;
            this.showCurrentShip();
        }
        else if(data == 2){
            //this.currentDirection = 2;
            this.currentShip = 2;
            this.showCurrentShip();
        }
        else if(data == 3){
            //this.currentDirection = 2;
            this.currentShip = 3;
            this.showCurrentShip();
        }

        //console.log(this.currentDirection);

        document.addEventListener('keydown', this.logKey);
        document.querySelectorAll("td").forEach(e => e.addEventListener("click", () => this.clickGrid(e)));
    }

    showGrid(){

        for(let i = 0; i < 10; i++){
            for(let j = 0; j < 10; j++){

                let id = i * 10 + j; // Transformation des coordonnées en fonction du tableau dans le html
                let currentElement;

                // Récupération de la case
                document.querySelectorAll("td").forEach(e => e.getAttribute("data") === id.toString() ? currentElement = e : '');
                if(this.grid[i][j] === 1){
                    currentElement.setAttribute("class", "shipCase");
                }
            }
        }
    }




};



game = new BATO;