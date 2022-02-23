class BATOGame extends BATOGrid{
    
    
    constructor() {
        super();

        document.getElementById("start").addEventListener("click", event => this.clickStart());
    }

    clickStart(){
        if(this.isGridFull()){
            
        }
    }
}

game = new BATOGame;