let socket = io();

class BATOGame{

    p1Grid;
    p2Grid;

    constructor() {
        socket.on("p1Grid", (grid)=>{
            this.p1Grid = grid;
        });
        socket.on("p2Grid", (grid)=>{
            this.p2Grid = grid;
        });

        socket.emit("getP1Grid");
        socket.emit("getP2Grid");
        console.log(this.p1Grid, this.p2Grid);
    }

}

game = new BATOGame;