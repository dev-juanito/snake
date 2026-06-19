let blockSize = 25;
let total_row = 17; //total row number
let total_col = 17; //total column number
let board;
let context;

let snakeX = blockSize * 5;
let snakeY = blockSize * 5;

// Set the total number of rows and columns
let speedX = 0;  //speed of snake in x coordinate.
let speedY = 0;  //speed of snake in Y coordinate.

let snakeBody = [];

let foodX;
let foodY;

let gameOver = false;

window.onload = function () {
    // Set board height and width
    board = document.getElementById("board");
    board.height = total_row * blockSize;
    board.width = total_col * blockSize;
    context = board.getContext("2d");

    placeFood();
    document.addEventListener("keyup", changeDirection);  //for movements
    // Set snake speed
    setInterval(update, 1000 / 10);
}

function update() {
    if (gameOver) {
        return;
    }

    // Background of a Game
    context.fillStyle = "green";
    context.fillRect(0, 0, board.width, board.height);

    // Set food color and position
    context.fillStyle = "yellow";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
    }

    // body of snake will grow
    for (let i = snakeBody.length - 1; i > 0; i--) {
        // it will store previous part of snake to the current part
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle = "white";
    snakeX += speedX * blockSize; //updating Snake position in X coordinate.
    snakeY += speedY * blockSize;  //updating Snake position in Y coordinate.
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    if (snakeX < 0 
        || snakeX > total_col * blockSize 
        || snakeY < 0 
        || snakeY > total_row * blockSize) { 
        
        // Out of bound condition
        gameOver = true;
            triggerQuestion();
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) { 
            
            // Snake eats own body
            gameOver = true;
            triggerQuestion();
        }
    }
}

// Movement of the Snake - We are using addEventListener
function changeDirection(e) {
    if (e.code == "ArrowUp" && speedY != 1) { 
        // If up arrow key pressed with this condition...
        // snake will not move in the opposite direction
        speedX = 0;
        speedY = -1;
    }
    else if (e.code == "ArrowDown" && speedY != -1) {
        //If down arrow key pressed
        speedX = 0;
        speedY = 1;
    }
    else if (e.code == "ArrowLeft" && speedX != 1) {
        //If left arrow key pressed
        speedX = -1;
        speedY = 0;
    }
    else if (e.code == "ArrowRight" && speedX != -1) { 
        //If Right arrow key pressed
        speedX = 1;
        speedY = 0;
    }
}

// Randomly place food
function placeFood() {

    // in x coordinates.
    foodX = Math.floor(Math.random() * total_col) * blockSize; 
    
    //in y coordinates.
    foodY = Math.floor(Math.random() * total_row) * blockSize; 
}

// Preguntas y lógica del modal
let questions = [
    { q: "¿Cuál es la capital de Francia?", options: ["París","Londres","Berlín","Madrid"], answer: 0 },
    { q: "¿Cuánto es 2 + 2?", options: ["3","4","5","6"], answer: 1 },
    { q: "¿Qué planeta es conocido como el Planeta Rojo?", options: ["Venus","Marte","Júpiter","Saturno"], answer: 1 },
    { q: "¿Cuál es el lenguaje principal para desarrollo web en el navegador?", options: ["Python","C#","JavaScript","Go"], answer: 2 }
];
let questionIndex = 0;
let savedState = null; // almacena el estado justo antes de la muerte

function triggerQuestion(){
    // guardar estado anterior (posición válida antes del salto que causó la muerte)
    const prevX = snakeX - speedX * blockSize;
    const prevY = snakeY - speedY * blockSize;
    savedState = {
        snakeX: prevX,
        snakeY: prevY,
        speedX: speedX,
        speedY: speedY,
        snakeBody: JSON.parse(JSON.stringify(snakeBody)),
        foodX: foodX,
        foodY: foodY
    };
    // mostrar modal
    const modal = document.getElementById('questionModal');
    if (!modal) return;
    modal.setAttribute('aria-hidden','false');
    gameOver = true;
    showQuestionModal(questions[questionIndex % questions.length]);
}

function showQuestionModal(qObj){
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    const feedback = document.getElementById('feedback');
    if (!questionText || !optionsContainer) return;
    questionText.textContent = qObj.q;
    optionsContainer.innerHTML = '';
    feedback.textContent = '';
    qObj.options.forEach((opt, idx)=>{
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.addEventListener('click', ()=> handleAnswer(idx, qObj.answer));
        optionsContainer.appendChild(btn);
    });
}

function handleAnswer(selected, correct){
    const feedback = document.getElementById('feedback');
    if (!feedback) return;
    if (selected === correct){
        feedback.style.color = 'green';
        feedback.textContent = '¡Correcto! Continúas donde ibas...';
        // reaparecer en un punto aleatorio del tablero y continuar conservando puntos
        setTimeout(()=>{
            const modal = document.getElementById('questionModal');
            if (modal) modal.setAttribute('aria-hidden','true');
            // restaurar cuerpo y velocidad guardados para conservar puntos
            if (savedState){
                snakeBody = savedState.snakeBody;
                speedX = savedState.speedX;
                speedY = savedState.speedY;
            }
            // buscar posición aleatoria libre (no en comida ni en el cuerpo)
            function getRandomFreePos(){
                for (let i=0;i<200;i++){
                    const x = Math.floor(Math.random() * total_col) * blockSize;
                    const y = Math.floor(Math.random() * total_row) * blockSize;
                    let conflict = false;
                    if (x === foodX && y === foodY) conflict = true;
                    for (let s of snakeBody){ if (s[0] === x && s[1] === y){ conflict = true; break; } }
                    if (!conflict) return {x,y};
                }
                // fallback: usar posición guardada o centro
                return { x: savedState ? savedState.snakeX : blockSize * 5, y: savedState ? savedState.snakeY : blockSize * 5 };
            }
            const pos = getRandomFreePos();
            snakeX = pos.x;
            snakeY = pos.y;
            // avanzar a la siguiente pregunta para la próxima muerte
            questionIndex++;
            savedState = null;
            gameOver = false;
        }, 700);
    } else {
        feedback.style.color = 'red';
        feedback.textContent = 'Incorrecto. Reiniciando juego...';
        // avanzar a la siguiente pregunta para la próxima muerte
        setTimeout(()=>{
            const modal = document.getElementById('questionModal');
            if (modal) modal.setAttribute('aria-hidden','true');
            questionIndex++;
            restartGame();
        }, 900);
    }
}

function restartGame(){
    // resetear estado del juego
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    speedX = 0;
    speedY = 0;
    snakeBody = [];
    placeFood();
    gameOver = false;
}


