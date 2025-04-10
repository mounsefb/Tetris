/* global paper */
const cellSize = 40 // number of pixels representing a cell
// const size = 30

const width = 10; // number of width cells
const height = 19; // number of height cells

var fallSpeed; // speed of shape falling
var paused = 0;
var pauseOverlay = null;
var gameOverOverlay = null;
var gameOverVar = 0;

const gamearea = {
    // A compléter
    board : [],
    falling : 0, // is a shape currently falling ?
    fallingShape: [], // which shape is falling ?

    borderX : function() {return (paper.view.size.width - width * cellSize) / 2;}, // centered board in width
    borderY : function() {return (paper.view.size.height - height * cellSize) / 2;}, // centered board in height
    coords : function(i, j) {return [this.borderX() + i*cellSize, this.borderY() + j*cellSize];}, // get the coords of a cell in the board
    init : function() {for(let i=0; i<width; i++){ this.board[i]=[]; for(let j=0; j<height; j++){this.board[i][j]=new Cell(i,j);}}}, // initiate the board visualy
    rotation : 0, // is the shape rotated from its initial rotation ?
    // saveState : function() {
    //     for(let i=0; i<size; i++){ 
    //         for(let j=0; j<size; j++){
    //             this.board[i][j].previousState = this.board[i][j].state;
    //         }
    //     }
    // },
    // getPreviousState : function(i, j) {
    //     if (i<0 || i>=30 || j>=30 || j<0){
    //         return 0;
    //     }
    //     return this.board[i][j].previousState;
    // },

    pausedGame : function(){
        paused = (paused+1) % 2 
        shape = null
        if(paused === 0) {
            if (pauseOverlay) {
                pauseOverlay.remove();
                pauseOverlay = null;
            }
            // this.init()
            clearInterval(fallSpeed);
            fallSpeed = setInterval(function(){ gamearea.iterate(); }, 500);
        }  
        else{
            // alert("the game is paused, click on escape to resume")
            // shape = new paper.Path.Rectangle(this.borderX(), this.borderY(),cellSize*width, cellSize*height)
            // shape.fillColor = 'white'
            let overlay = new paper.Path.Rectangle({
                point: [0, 0],
                size: paper.view.size,
                fillColor: 'rgba(0, 0, 0, 0.7)'
            });
        
            // Create the "Paused" text
            let text = new paper.PointText({
                point: paper.view.center,
                justification: 'center',
                fillColor: 'white',
                fontSize: 30,
                content: 'Paused - Press Escape to Resume'
            });
        
            // Move text slightly up to center visually better
            text.position.y -= 20;
        
            // Group the rectangle and text so they can be removed together
            pauseOverlay = new paper.Group([overlay, text]);
            clearInterval(fallSpeed);
        }
    },

    gameOver : function(){
        let overlay = new paper.Path.Rectangle({
            point: [0, 0],
            size: paper.view.size,
            fillColor: 'rgba(0, 0, 0, 0.7)'
        });
    
        // Create the "Paused" text
        let text = new paper.PointText({
            point: paper.view.center,
            justification: 'center',
            fillColor: 'white',
            fontSize: 30,
            content: 'Game Over - Press Escape to Restart'
        });
    
        // Move text slightly up to center visually better
        text.position.y -= 20;

        // Group the rectangle and text so they can be removed together
        gameOverOverlay = new paper.Group([overlay, text]);
        clearInterval(fallSpeed);
        gameOverVar = 1;
    },

    iterate : function() {
        // this.saveState();
        if(this.falling === 0 ){
            // if no shape is falling, create a new one by randomly choosing from all possible shapes
            
            this.fallingShape = getShape(getRandomInt(7));
            // this.fallingShape = getShape(1);
            // console.log(this.fallingShape.title);
            this.drawInitial();
            this.falling = 1;
        }
        else{
            if(this.verifyMovement() === 1){
                //if a shape is falling and still can fall iterate a step 
                this.eraseFallingShape();
                this.drawFallingShape(0);
            }
        }
    },


    drawInitial : function(){
        if(this.fallingShape.title === 'baton'){
            this.fallingShape.coord = [];
            // gamearea.board[0][0].live();
            for(let i=0; i<this.fallingShape.items.length; i++){
                if(gamearea.board[3+i][0].state === 1){
                    this.gameOver();
                    return;
                }
                this.fallingShape.coord[i] = [3+i, 0];
                gamearea.board[3+i][0].live();
            }
        }
        else{
            this.fallingShape.coord = [];
            this.fallingShape.coord[0] = [];
            this.fallingShape.coord[1] = [];
            for(let i=0; i<this.fallingShape.items.length; i++){
                for (let j=0; j<this.fallingShape.items[i].length; j++){
                    if (this.fallingShape.items[i][j] === 1) {
                        if(gamearea.board[4+j][i].state === 1){
                            this.gameOver()
                            return;
                        }
                        gamearea.board[4+j][i].live();
                    }
                    this.fallingShape.coord[i][j] = [4+j, i];
                }
            }
        }
    },

    verifyMovement : function(inter) {
        // console.log(this.fallingShape.items);
        // console.log(this.fallingShape.coord);
        
        if(this.fallingShape.title === 'baton'){
            if (this.rotation === 0){
                for(let i=0; i<this.fallingShape.items.length; i++){
                    let coord = this.fallingShape.coord[i];
                    // console.log(coord[1], this.board[coord[0]][coord[1]+1].state)
                    if(coord[1] === height-1 || this.board[coord[0]][coord[1]+1].state === 1){
                        this.checkFullLine();
                        this.falling = 0;
                        clearInterval(fallSpeed);
                        fallSpeed = setInterval(function(){ gamearea.iterate(); }, 500);
                        return 0;
                    }
                    else if((inter === 1 && coord[0] === 0) || (inter === 2 && coord[0] === 9)){
                        return 0;
                    }
                }
                return 1;
            }
            else if(this.rotation === 1){
                if(this.fallingShape.coord[3][1] === height-1 || this.board[this.fallingShape.coord[3][0]][this.fallingShape.coord[3][1]+1].state === 1){
                    this.checkFullLine();
                    this.falling = 0;
                    clearInterval(fallSpeed);
                    fallSpeed = setInterval(function(){ gamearea.iterate(); }, 500);
                    return 0;
                }
                else if((inter === 1 && this.fallingShape.coord[3][0] === 0) || (inter === 2 && this.fallingShape.coord[3][0] === 9)){
                    console.log(this.fallingShape.coord[3][0]);
                    return 0;
                }
                console.log("verif ok");
                return 1;
            }
        }
        else{
            console.log(this.fallingShape.items, this.fallingShape.coord)
            for(let i=0; i<this.fallingShape.items.length; i++){
                for (let j=0; j<this.fallingShape.items[i].length; j++){
                    // console.log(i + " " + j + " " + this.fallingShape.coord[i][j]);
                    // console.log(i)
                    console.log(i, j)
                    let coord = this.fallingShape.coord[i][j];
                    // console.log(coord)
                    if(coord[1] === height-1 || (i===1 && this.board[coord[0]][coord[1]+1].state + this.board[coord[0]][coord[1]].state===2)){
                        this.checkFullLine();
                        this.falling = 0;
                        clearInterval(fallSpeed);
                        fallSpeed = setInterval(function(){ gamearea.iterate(); }, 500);
                        return 0;
                    }
                    else if((inter === 1 && coord[0] === 0) || (inter === 2 && coord[0] === 9)){
                        return 0;
                    }
                }
            }
            return 1;
        }
    },

    eraseFallingShape : function(){
        if(this.fallingShape.title === 'baton'){
            for(let i=0; i<this.fallingShape.items.length; i++){
                let coord = this.fallingShape.coord[i];
                if (this.fallingShape.items[i] === 1) {
                    gamearea.board[coord[0]][coord[1]].die();
                }
            }
        }
        else{
            for(let i=0; i<this.fallingShape.items.length; i++){
                for (let j=0; j<this.fallingShape.items[i].length; j++){
                    let coord = this.fallingShape.coord[i][j];
                    if (this.fallingShape.items[i][j] === 1) {
                        gamearea.board[coord[0]][coord[1]].die();
                    }
                }
            }
        }
    },

    drawFallingShape : function(inter){
        let x=0, y=0; 
        switch(inter){
            case 0 :
                y=1;
                break;
            case 1 :
                x=-1;
                break;
            case 2 :
                x=1;
                break;                       
        }
        if(this.fallingShape.title === 'baton'){
            for(let i=0; i<this.fallingShape.items.length; i++){
                let coord = this.fallingShape.coord[i];
                if (this.fallingShape.items[i] === 1) {
                    // console.log(coord[0] + " " + coord[1] + " x = " + x+ " y = " + y);
                    gamearea.board[coord[0]+x][coord[1]+y].live();
                }
                this.fallingShape.coord[i] = [coord[0]+x, coord[1]+y];
            }
        }
        else{
            for(let i=0; i<this.fallingShape.items.length; i++){
                for (let j=0; j<this.fallingShape.items[i].length; j++){
                    let coord = this.fallingShape.coord[i][j];
                    if (this.fallingShape.items[i][j] === 1) {
                        gamearea.board[coord[0]+x][coord[1]+y].live();
                    }
                    this.fallingShape.coord[i][j] = [coord[0]+x, coord[1]+y];
                }
            }
        }
    },

    isInBoard : function(coord){
        if (coord.length !== 2){
            alert("verfie sur coord de non 2");
            return 0;
        }
        if (coord[0]<0 || width<coord[0] || coord[1]<0 || height<coord[0]) return 0;
        return 1;
    },

    turnFallingShape : function(){
        this.rotation = (this.rotation + 1)%this.fallingShape.rotation.length;
        console.log("fallingShape", this.fallingShape.items)
        this.fallingShape.items = this.fallingShape.rotation[this.rotation];
        console.log("fallingShape",  this.fallingShape.items)


        // console.log(this.rotation);
        if (this.fallingShape.title === "baton"){
            let oldCoord = this.fallingShape.coord;
            let x = oldCoord[1][0], y = oldCoord[1][1];
            if (this.rotation === 1){
                for (let i = -1; i < 3; i++){
                    if(this.board[x][y+i].state === 1){
                        return;
                    }
                }
                for (let i = -1; i < 3; i++){
                    this.board[x][y+i].live();
                    this.fallingShape.coord[i+1] = [x, y+i];
                }
                // console.log(this.fallingShape.coord);
            }
            else{
                for (let i = -1; i < 3; i++){
                    if(this.board[x+i][y].state === 1){
                        return;
                    } 
                }
                for (let i = -1; i < 3; i++){
                    this.board[x+i][y].live();
                    this.fallingShape.coord[i+1] = [x+i, y];
                }
                // console.log(this.fallingShape.coord);
            }
        }
        else{
            let oldCoord = this.fallingShape.coord;
            
            if (this.rotation % 2 === 1){
                this.fallingShape.coord = [];
                this.fallingShape.coord[0] = [];
                this.fallingShape.coord[1] = [];
                this.fallingShape.coord[2] = [];
                this.fallingShape.coord[0][0] = oldCoord[0][0];
                this.fallingShape.coord[0][1] = oldCoord[0][1];
                this.fallingShape.coord[1][0] = oldCoord[1][0];
                this.fallingShape.coord[1][1] = oldCoord[1][1];
                this.fallingShape.coord[2][0] = [oldCoord[1][0][0], oldCoord[1][0][1]+1];
                this.fallingShape.coord[2][1] = [oldCoord[1][1][0], oldCoord[1][1][1]+1];
            }
            else {
                this.fallingShape.coord = [];
                this.fallingShape.coord[0] = [];
                this.fallingShape.coord[1] = [];
                this.fallingShape.coord[0][0] = oldCoord[0][0];
                this.fallingShape.coord[0][1] = oldCoord[0][1];
                this.fallingShape.coord[0][2] = [oldCoord[0][1][0]+1, oldCoord[0][1][1]];
                this.fallingShape.coord[1][0] = oldCoord[1][0];
                this.fallingShape.coord[1][1] = oldCoord[1][1];
                this.fallingShape.coord[1][2] = [oldCoord[1][1][0]+1, oldCoord[1][1][1]];
            }
            console.log("fallingshape after turn" , this.fallingShape.coord);
        }
    },

    interupt: function(direction) {
        if (direction <= 2 && this.verifyMovement(direction) === 1) {
            this.eraseFallingShape();
            this.drawFallingShape(direction);
        } else if (direction === 3 && this.fallingShape.title !== "cube") {
            this.eraseFallingShape();
            this.turnFallingShape();
        }
    },

    checkFullLine : function(){
        if(this.fallingShape.title === 'baton'){
            // console.log(this.fallingShape.coord[0]);
            if(this.rotation === 0){
                let y = this.fallingShape.coord[0][1];
                let count = 0;
                for(let i=0; i<10; i++){
                    if(this.board[i][y].state === 1) count++
                }
                console.log(count);
                if(count === 10){
                    for(let i=0; i<10; i++){
                        this.board[i][y].die();
                    }
                    for(let j=1; j<(y+1); j++){
                        for(let i=0; i<10; i++){
                            if (this.board[i][y-j].state === 1){
                                this.board[i][y-j].die();
                                this.board[i][y-j+1].live();
                            }
                        }
                    }
                }
            }
            else{
                for(let k=0; k<4; k++){
                    let y = this.fallingShape.coord[k][1];
                    let count = 0;
                    for(let i=0; i<10; i++){
                        if(this.board[i][y].state === 1) count++
                    }
                    console.log(count);
                    if(count === 10){
                        for(let i=0; i<10; i++){
                            this.board[i][y].die();
                        }
                        for(let j=1; j<(y+1); j++){
                            for(let i=0; i<10; i++){
                                if (this.board[i][y-j].state === 1){
                                    this.board[i][y-j].die();
                                    this.board[i][y-j+1].live();
                                }
                            }
                        }
                    }
                }
            }
        }
        else{
            let y0 = this.fallingShape.coord[0][0][1], y1 = this.fallingShape.coord[1][0][1];
            let count0 = 0, count1 = 0;
            for(let i=0; i<10; i++){
                if(this.board[i][y0].state === 1) count0++;
                if(this.board[i][y1].state === 1) count1++;
            }
            console.log("count0 = " + count0 + " count1 = " + count1);
            if(count0 === 9 && count1 === 9){
                for(let i=0; i<10; i++){
                    this.board[i][y0].die();
                    this.board[i][y1].die();
                }
            }
            else{
                if(count0 === 10){
                    for(let i=0; i<10; i++){
                        this.board[i][y0].die();
                    }
                    for(let j=1; j<(y0+1); j++){
                        for(let i=0; i<10; i++){
                            if (this.board[i][y0-j].state === 1){
                                this.board[i][y0-j].die();
                                this.board[i][y0-j+1].live();
                            }
                        }
                    }
                }
                if(count1 === 10){
                    for(let i=0; i<10; i++){
                        this.board[i][y1].die();
                    }
                    for(let j=1; j<(y1+1); j++){
                        for(let i=0; i<10; i++){
                            if (this.board[i][y1-j].state === 1){
                                this.board[i][y1-j].die();
                                this.board[i][y1-j+1].live();
                            }
                        }
                    }
                }

            }
        }
    },


    
}

class Cell {
// A compléter
    i;
    j;
    state = 0;
    previousState=0;
    // shape = new paper.Path.Circle({coords(i, j), cellSize/2, 'white', 'blue'});
    shape;

    constructor(i, j){
        this.i=i;
        this.j=j;
        this.shape = new paper.Path.Rectangle(gamearea.coords(this.i, this.j)[0], gamearea.coords(this.i, this.j)[1],cellSize, cellSize);
        this.shape.fillColor = 'black';
        this.shape.strokeColor = 'white';
    }

    live(){
        this.state = 1;
        this.shape.fillColor = 'cyan';
    }

    die(){
        this.state = 0;
        this.shape.fillColor = 'black';
    }
}

function onKeyUp(event) {
    if(gameOverVar === 0){
        if (paused === 0){
            if (event.key =='g') {
                console.log("Step");
                gamearea.iterate();
            }
            if(event.key =='ArrowLeft'){
                gamearea.interupt(1);
            }
            if(event.key =='ArrowRight'){
                console.log("ArrowRight");
                gamearea.interupt(2);
            }
            if(event.key =='ArrowDown'){
                clearInterval(fallSpeed);
                fallSpeed = setInterval(function(){ gamearea.iterate(); }, 50);
            }
            if(event.key =='ArrowUp'){
                gamearea.interupt(3);
            }
        }
        if(event.key =='Escape'){
            gamearea.pausedGame();
        }
    }
    else{
        if(event.key =='Escape'){
            window.location.reload();
        }
    }
}

window.addEventListener("keyup",onKeyUp);

window.addEventListener("load",
    function(){
        let canvas = document.getElementById("myCanvas")
        paper.setup(canvas)
        gamearea.init();
        fallSpeed = setInterval(function(){ gamearea.iterate(); }, 500);
    }
)