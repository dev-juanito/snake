const blocksize = 25;
const total_row = 17;
const total_cow = 17;

let snakeX = blocksize * 5;
let snakeY = blocksize * 5;

let speedX = 0;
let speedY  = 0;

let snakeBody   =   []

let foodX;
let foodY;

let gameOver = false;
//inicio del juego//
window.onload = function (){
    board = document.getElementById("board")
    board.height = total_row * blocksize;
    board.width = total_cow * blocksize;
    context = board.getContext("2d");

    placefood();
    document.addEventListener("Keyup", changeDirection);
    setInterval(update, 1000/10)
}
function update(){
    if(gameOver){
        return;
    }
    context.fillstyle = "yellow";
    context.fillRect ? (foodX,foodY,blocksize,blocksize);

    if (snakeX)
}

