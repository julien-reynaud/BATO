class BATOGrid{
    grid; // Grille du jeu
    event;  // Liste d'événements
    shipList = [0, 1, 2, 2, 3]; // Liste de bateau
    currentShip; // Bateau actuel
    currentDirection = 2; // Direction actuelle

    constructor() {
        // Récupération et création d'élements html
        //let body = document.getElementsByTagName("body")[0];
        let body = document.getElementById("grid");
        let table = document.createElement("table");
        let tableBody = document.createElement("tbody");

        // Création de la grille de 10x10
        this.grid = new Array(10);
        for (let k = 0; k < 10; k++) {
            this.grid[k] = new Array(10);
        }

        // Création des cases avec des id et data distinct + remplissage de la grille
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
                this.grid[i][j] = 0;
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
        
        // Puis on l'utilise lorsque l'une des cases du jeu est cliquée
        //document.querySelectorAll("td").forEach(e => e.addEventListener("click", () => this.click(e)));

        // Boutton de choix de bateau
        document.getElementById("porteAvionV").addEventListener("click", event => this.clickShipButton(0));
        document.getElementById("croiseurV").addEventListener("click", event => this.clickShipButton(1));
        document.getElementById("contreTorpilleurV").addEventListener("click", event => this.clickShipButton(2));
        document.getElementById("torpilleurV").addEventListener("click", event => this.clickShipButton(3));

        document.getElementById("porteAvionH").addEventListener("click", event => this.clickShipButton(4));
        document.getElementById("croiseurH").addEventListener("click", event => this.clickShipButton(5));
        document.getElementById("contreTorpilleurH").addEventListener("click", event => this.clickShipButton(6));
        document.getElementById("torpilleurH").addEventListener("click", event => this.clickShipButton(7));

        document.getElementById("start").addEventListener("click", event => this.clickStart());
    }

    //logKey(key){
    //    if(key.code == "KeyR"){
    //        if(this.currentDirection == 1){
    //            this.currentDirection = 2;
    //            //console.log(this.currentDirection);
    //            console.log("Vertical");             
    //            document.getElementById("direction").textContent = "Vertical";
    //            //document.querySelectorAll("td").forEach(e => e.addEventListener("click", () => this.clickGrid(e)));
    //        }
    //        else{
    //            this.currentDirection = 1;
    //            //console.log(this.currentDirection);
    //            console.log("Horizontal");
    //            document.getElementById("direction").textContent = "Horizontal";
    //            //document.querySelectorAll("td").forEach(e => e.addEventListener("click", () => this.clickGrid(e)));
    //        }
    //    }
    //    
    //}

    // Fonction pour avoir un random entre 0 et max
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    // Fonction d'affichage du bateau sélectionné
    showCurrentShip(){
        if(this.currentShip == 0 && this.currentDirection == 2){
            console.log("Porte Avion V");
            document.getElementById("currentShip").textContent = "Current ship : Porte Avion";
            document.getElementById("direction").textContent = "Direction : Vertical";  
        }
        else if(this.currentShip == 1 && this.currentDirection == 2){
            console.log("Croiseur V");
            document.getElementById("currentShip").textContent = "Current ship : Croiseur";
            document.getElementById("direction").textContent = "Direction : Vertical";
        }
        else if(this.currentShip == 2 && this.currentDirection == 2){
            console.log("Contre-Torpilleur V");
            document.getElementById("currentShip").textContent = "Current ship : Contre-Torpilleur";
            document.getElementById("direction").textContent = "Direction : Vertical";                
        }
        else if(this.currentShip == 3 && this.currentDirection == 2){
            console.log("Torpilleur V");
            document.getElementById("currentShip").textContent = "Current ship : Torpilleur";
            document.getElementById("direction").textContent = "Direction : Vertical";
        }
        else if(this.currentShip == 0 && this.currentDirection == 1){
            console.log("Porte Avion H");
            document.getElementById("currentShip").textContent = "Current ship : Porte Avion";
            document.getElementById("direction").textContent = "Direction : Horizontal";  
        }
        else if(this.currentShip == 1 && this.currentDirection == 1){
            console.log("Croiseur H");
            document.getElementById("currentShip").textContent = "Current ship : Croiseur";
            document.getElementById("direction").textContent = "Direction : Horizontal";
        }
        else if(this.currentShip == 2 && this.currentDirection == 1){
            console.log("Contre-Torpilleur H");
            document.getElementById("currentShip").textContent = "Current ship : Contre-Torpilleur";
            document.getElementById("direction").textContent = "Direction : Horizontal";                
        }
        else if(this.currentShip == 3 && this.currentDirection == 1){
            console.log("Torpilleur H");
            document.getElementById("currentShip").textContent = "Current ship : Torpilleur";
            document.getElementById("direction").textContent = "Direction : Horizontal";
        }
        else{
            console.log("No ship selected");
            document.getElementById("currentShip").textContent = "Select a boat";
            document.getElementById("direction").textContent = "Direction : N/A";
        }
    }

    // Fonction appelée lors du click sur la grille
    clickGrid(element){
        let x = Math.floor((element.getAttribute("data")) / 10);
        let y = Math.floor((element.getAttribute("data")) % 10);
        //console.log(x , y);
        this.updateGrid(x,y);
    }

    // Modification de la grille après le click
    updateGrid(x, y){
        //console.log(this.currentDirection);
        if(this.currentDirection == 1){
            if(this.currentShip == 0){
                if(y-2 >= 0 && y+2 < 10 && this.grid[x][y-1] == 0 && this.grid[x][y-2] == 0 && this.grid[x][y] == 0 && this.grid[x][y+1] == 0 && this.grid[x][y+2] == 0){
                    this.grid[x][y-1] = 1;
                    this.grid[x][y-2] = 1;
                    this.grid[x][y] = 1;
                    this.grid[x][y+1] = 1;
                    this.grid[x][y+2] = 1;
                    this.shipList[this.shipList.findIndex(element => element == 0)] = -1;
                }
                else{
                    console.log("Impossible");
                }
            }
            else if(this.currentShip == 1){
                if(y-2 >= 0 && y+1 < 10 && this.grid[x][y-1] == 0 && this.grid[x][y-2] == 0 && this.grid[x][y] == 0 && this.grid[x][y+1] == 0){
                    this.grid[x][y-1] = 2;
                    this.grid[x][y-2] = 2;
                    this.grid[x][y] = 2;
                    this.grid[x][y+1] = 2;
                    this.shipList[this.shipList.findIndex(element => element == 1)] = -1;
                }
                else{
                    console.log("Impossible");
                }
            }
            else if(this.currentShip == 2){
                if(y-1 >= 0 && y+1 < 10 && this.grid[x][y-1] == 0 && this.grid[x][y] == 0 && this.grid[x][y+1] == 0){
                    this.grid[x][y-1] = 3;
                    this.grid[x][y] = 3;
                    this.grid[x][y+1] = 3;
                    this.shipList[this.shipList.findIndex(element => element == 2)] = -1;
                }
                else{
                    console.log("Impossible");
                }
            }
            else if(this.currentShip == 3){
                if(y-1 >= 0 && this.grid[x][y-1] == 0 && this.grid[x][y] == 0){
                    this.grid[x][y-1] = 4;
                    this.grid[x][y] = 4;
                    this.shipList[this.shipList.findIndex(element => element == 3)] = -1;
                }
                else{
                    console.log("Impossible");
                }
            }

        }
        else{
            if(this.currentShip == 0){
                if(x-2 >= 0 && x+2 < 10 && this.grid[x-1][y] == 0 && this.grid[x-2][y] == 0 && this.grid[x][y] == 0 && this.grid[x+1][y] == 0 && this.grid[x+2][y] == 0){
                    this.grid[x-1][y] = 1;
                    this.grid[x-2][y] = 1;
                    this.grid[x][y] = 1;
                    this.grid[x+1][y] = 1;
                    this.grid[x+2][y] = 1;
                    this.shipList[this.shipList.findIndex(element => element == 0)] = -1;
                }
                else{
                    console.log("Impossible");
                }
            }
            else if(this.currentShip == 1){
                if(x-2 >= 0 && x+1 < 10 && this.grid[x-1][y] == 0 && this.grid[x-2][y] == 0 && this.grid[x][y] == 0 && this.grid[x+1][y] == 0){
                    this.grid[x-1][y] = 2;
                    this.grid[x-2][y] = 2;
                    this.grid[x][y] = 2;
                    this.grid[x+1][y] = 2;
                    this.shipList[this.shipList.findIndex(element => element == 1)] = -1;
                }
                else{
                    console.log("Impossible");
                }
            }
            else if(this.currentShip == 2){
                if(x-1 >= 0 && x+1 < 10 && this.grid[x-1][y] == 0 && this.grid[x][y] == 0 && this.grid[x+1][y] == 0){
                    this.grid[x-1][y] = 3;
                    this.grid[x][y] = 3;
                    this.grid[x+1][y] = 3;
                    this.shipList[this.shipList.findIndex(element => element == 2)] = -1;
                }
                else{
                    console.log("Impossible");
                }
            }
            else if(this.currentShip == 3){
                if(x-1 >= 0 && this.grid[x-1][y] == 0 && this.grid[x][y] == 0){
                    this.grid[x-1][y] = 4;
                    this.grid[x][y] = 4;
                    this.shipList[this.shipList.findIndex(element => element == 3)] = -1;
                }
                else{
                    console.log("Impossible");
                }
            }
            //console.log(this.shipList);
        }

        // Retrait du hover

        $('td').mouseover(function(){
            const col = $(this).index();
            const row = $(this).closest('tr').index();

            // Reset
            for (let $i = row - 2; $i <= row + 2; $i++){
                for(let $j = col -2; $j<= col + 2; $j++){
                    $('tr:eq('+ $i +') td:eq('+ $j +')').css('background-color', '');
                }
            }
        })

        // Initialistion à 0
        this.currentShip = -1;
        //this.showCurrentShip();

        // Update Buttons

        for(let ind = 0; ind < this.shipList.length; ind++){
            if(this.shipList[ind] == -1 && ind != 2 || this.shipList[ind] == -1 && ind == 2 && this.shipList[ind + 1] == -1){
                if(ind == 0){
                    document.getElementById("porteAvionV").setAttribute("class", "custom-btn btn-use");
                    document.getElementById("porteAvionH").setAttribute("class", "custom-btn btn-use");
                }
                else if(ind == 1){
                    document.getElementById("croiseurV").setAttribute("class", "custom-btn btn-use");
                    document.getElementById("croiseurH").setAttribute("class", "custom-btn btn-use");
                }
                else if(ind == 2){
                    document.getElementById("contreTorpilleurV").setAttribute("class", "custom-btn btn-use");
                    document.getElementById("contreTorpilleurH").setAttribute("class", "custom-btn btn-use");
                }
                else if(ind == 3){
                    document.getElementById("contreTorpilleurV").setAttribute("class", "custom-btn btn-use");
                    document.getElementById("contreTorpilleurH").setAttribute("class", "custom-btn btn-use");
                }
                else if(ind == 4){
                    document.getElementById("torpilleurV").setAttribute("class", "custom-btn btn-use");
                    document.getElementById("torpilleurH").setAttribute("class", "custom-btn btn-use");
                }
            }
        }

        //console.log(this.grid);
        this.showGrid();
    }

    // Fonction de sélection de bateau
    clickShipButton(data){
        // Vérification de si le bateau est disponible
        if(this.shipList.find(element => element == data) != undefined || data > 3 && this.shipList.find(element => element == data - 4) != undefined){
            if(data == 0){
                this.currentDirection = 2;
                this.currentShip = 0;
                //this.showCurrentShip();
            }
            else if(data == 1){
                this.currentDirection = 2;
                this.currentShip = 1;
                //this.showCurrentShip();
            }
            else if(data == 2){
                this.currentDirection = 2;
                this.currentShip = 2;
                //this.showCurrentShip();
            }
            else if(data == 3){
                this.currentDirection = 2;
                this.currentShip = 3;
                //this.showCurrentShip();
            }
            else if(data == 4){
                this.currentDirection = 1;
                this.currentShip = 0;
                //this.showCurrentShip();
            }
            else if(data == 5){
                this.currentDirection = 1;
                this.currentShip = 1;
                //this.showCurrentShip();
            }
            else if(data == 6){
                this.currentDirection = 1;
                this.currentShip = 2;
                //this.showCurrentShip();
            }
            else if(data == 7){
                this.currentDirection = 1;
                this.currentShip = 3;
                //this.showCurrentShip();
            }

            this.setHoverEffects(data);
            //console.log(this.currentDirection);

            //document.addEventListener('keydown', this.logKey);
            document.querySelectorAll("td").forEach(e => e.addEventListener("click", () => this.clickGrid(e)));
        }
        else{
            console.log("This type of ship isn't available !");
        }
    }

    // Fonction pour l'effet de survol des cases
    setHoverEffects(data){
        if(data == 0){
            $('td').mouseover(function(){
                const col = $(this).index();
                const row = $(this).closest('tr').index();
                // Reset
                for (let $i = row - 2; $i <= row + 2; $i++){
                    for(let $j = col -2; $j<= col + 2; $j++){
                        $('tr:eq('+ $i +') td:eq('+ $j +')').css('background-color', '');
                    }
                }
                //console.log($(this).grid[row-2][col])
                if(row-2 >= 0 && row-1 >= 0 && row+1 <= 9 && row+2 <= 9 /*&& this.grid[row-2][col] == 0*/){
                    for (let $i = row - 2; $i <= row + 2; $i++){
                        $('tr:eq('+ $i +') td:eq('+ col +')').css('background-color', '#530f1e');
                    }
                }
            })
            $('td').mouseleave(function(){
                $('td').css('background-color', '');
            })
            //document.querySelectorAll("td").forEach(e => e.className = "hoverEffect");
        }
        else if(data == 1){
            $('td').mouseover(function(){
                const col = $(this).index();
                const row = $(this).closest('tr').index();

                // Reset
                for (let $i = row - 2; $i <= row + 2; $i++){
                    for(let $j = col -2; $j<= col + 2; $j++){
                        $('tr:eq('+ $i +') td:eq('+ $j +')').css('background-color', '');
                    }
                }
                if(row-2 >= 0 && row-1 >= 0 && row+1 <= 9){
                    for (let $i = row - 2; $i <= row + 1; $i++){
                        $('tr:eq('+ $i +') td:eq('+ col +')').css('background-color', '#530f1e');
                    }
                }
            })
            $('td').mouseleave(function(){
                $('td').css('background-color', '');
            })
            //document.querySelectorAll("td").forEach(e => e.className = "hoverEffect");
        }
        else if(data == 2){
            $('td').mouseover(function(){
                const col = $(this).index();
                const row = $(this).closest('tr').index();

                // Reset
                for (let $i = row - 2; $i <= row + 2; $i++){
                    for(let $j = col -2; $j<= col + 2; $j++){
                        $('tr:eq('+ $i +') td:eq('+ $j +')').css('background-color', '');
                    }
                }
                if(row-1 >= 0 && row+1 <= 9){
                    for (let $i = row - 1; $i <= row + 1; $i++){
                        $('tr:eq('+ $i +') td:eq('+ col +')').css('background-color', '#530f1e');
                    }
                }

            })
            $('td').mouseleave(function(){
                $('td').css('background-color', '');
            })
            //document.querySelectorAll("td").forEach(e => e.className = "hoverEffect");
        }
        else if(data == 3){
            $('td').mouseover(function(){
                const col = $(this).index();
                const row = $(this).closest('tr').index();

                // Reset
                for (let $i = row - 2; $i <= row + 2; $i++){
                    for(let $j = col -2; $j<= col + 2; $j++){
                        $('tr:eq('+ $i +') td:eq('+ $j +')').css('background-color', '');
                    }
                }
                if(row-1 >= 0){
                    for (let $i = row - 1; $i <= row; $i++){
                        $('tr:eq('+ $i +') td:eq('+ col +')').css('background-color', '#530f1e');
                    }
                }
            })
            $('td').mouseleave(function(){
                $('td').css('background-color', '');
            })
            //document.querySelectorAll("td").forEach(e => e.className = "hoverEffect");
        }
        else if(data == 4){
            $('td').mouseover(function(){
                const col = $(this).index();
                const row = $(this).closest('tr').index();

                // Reset
                for (let $i = row - 2; $i <= row + 2; $i++){
                    for(let $j = col -2; $j<= col + 2; $j++){
                        $('tr:eq('+ $i +') td:eq('+ $j +')').css('background-color', '');
                    }
                }
                if(col-2 >= 0 && col-1 >= 0 && col+1 <= 9 && col+2 <= 9){
                    for (let $i = col - 2; $i <= col + 2; $i++){
                        $('tr:eq('+ row +') td:eq('+ $i +')').css('background-color', '#530f1e');
                    }
                }
            })
            $('td').mouseleave(function(){
                $('td').css('background-color', '');
            })
            //document.querySelectorAll("td").forEach(e => e.className = "hoverEffect");
        }
        else if(data == 5){
            $('td').mouseover(function(){
                const col = $(this).index();
                const row = $(this).closest('tr').index();

                // Reset
                for (let $i = row - 2; $i <= row + 2; $i++){
                    for(let $j = col -2; $j<= col + 2; $j++){
                        $('tr:eq('+ $i +') td:eq('+ $j +')').css('background-color', '');
                    }
                }
                if(col-2 >= 0 && col-1 >= 0 && col+1 <= 9){
                    for (let $i = col - 2; $i <= col + 1; $i++){
                        $('tr:eq('+ row +') td:eq('+ $i +')').css('background-color', '#530f1e');
                    }
                }
            })
            $('td').mouseleave(function(){
                $('td').css('background-color', '');
            })
            //document.querySelectorAll("td").forEach(e => e.className = "hoverEffect");
        }
        else if(data == 6){
            $('td').mouseover(function(){
                const col = $(this).index();
                const row = $(this).closest('tr').index();

                // Reset
                for (let $i = row - 2; $i <= row + 2; $i++){
                    for(let $j = col -2; $j<= col + 2; $j++){
                        $('tr:eq('+ $i +') td:eq('+ $j +')').css('background-color', '');
                    }
                }
                if(col-1 >= 0 && col+1 <= 9){
                    for (let $i = col - 1; $i <= col + 1; $i++){
                        $('tr:eq('+ row +') td:eq('+ $i +')').css('background-color', '#530f1e');
                    }
                }
            })
            $('td').mouseleave(function(){
                $('td').css('background-color', '');
            })
            //document.querySelectorAll("td").forEach(e => e.className = "hoverEffect");
        }
        else if(data == 7){
            $('td').mouseover(function(){
                const col = $(this).index();
                const row = $(this).closest('tr').index();

                // Reset
                for (let $i = row - 2; $i <= row + 2; $i++){
                    for(let $j = col -2; $j<= col + 2; $j++){
                        $('tr:eq('+ $i +') td:eq('+ $j +')').css('background-color', '');
                    }
                }
                if(col-1 >= 0){
                    for (let $i = col - 1; $i <= col; $i++){
                        $('tr:eq('+ row +') td:eq('+ $i +')').css('background-color', '#530f1e');
                    }
                }
            })
            $('td').mouseleave(function(){
                $('td').css('background-color', '');
            })
            //document.querySelectorAll("td").forEach(e => e.className = "hoverEffect");
        }
    }

    isGridFull(){
        for(let i = 0; i < this.shipList.length - 1; i++){
            if(this.shipList[i] != -1){
                return false;
            }
        }
        return true;
    }

    // Fonction de l'affichage de la grille
    showGrid(){

        for(let i = 0; i < 10; i++){
            for(let j = 0; j < 10; j++){

                let id = i * 10 + j; // Transformation des coordonnées en fonction du tableau dans le html
                let currentElement;

                // Récupération de la case
                document.querySelectorAll("td").forEach(e => e.getAttribute("data") === id.toString() ? currentElement = e : '');
                if(this.grid[i][j] !== 0){
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

        if(this.isGridFull()){
            console.log("Grid is full");
        }
    }

    clickStart(){
        if(this.isGridFull()){
            console.log("redirection");
            // TMP ____________________________________________
            // Récupération et création d'élements html
            //let body = document.getElementsByTagName("body")[0];
            //let body = document.getElementById("grid");
            //let table = document.createElement("table");
            //let tableBody = document.createElement("tbody");
//
            //// Création des cases avec des id et data distinct + remplissage de la grille
            //let l = 0;
            //for (let i = 0; i < 10; i++) {
            //    let row = document.createElement("tr");
            //    for (let j = 0; j < 10; j++) {
            //        var cell = document.createElement("td");
            //        //cell.setAttribute('id', "cell" + i + j);
            //        cell.setAttribute('id', l);
            //        cell.setAttribute('data', l);
            //        //cell.textContent = cell.getAttribute('data');
            //        //console.log(cell);
            //        row.appendChild(cell);
            //        this.grid[i][j] = 0;
            //        l++;
            //    }
            //    tableBody.appendChild(row);
            //}
            //console.log(this.grid);
            // Un peu de style
            //table.setAttribute('class', "tableau");
            //table.setAttribute("border", "10px");
//
            //table.appendChild(tableBody);
            //body.appendChild(table);
            // ________________________________________________

            window.location.href="../html/matchmaking.html";
        }
        else{
            console.log("Grid is not completed");
        }
    }

    getGrid(){
        return(this.grid);
    }


};



game = new BATOGrid;