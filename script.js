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
let fruitsEaten = 0;

window.onload = function () {
    // Set board height and width
    board = document.getElementById("board");
    context = board.getContext("2d");
    board.height = total_row * blockSize;
    board.width = total_col * blockSize;
    placeFood();
    document.addEventListener("keyup", changeDirection);  //for movements
    // Velocidad  de la serpiente
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
        fruitsEaten++;
        updateFruitCounter();
        placeFood();

        if (fruitsEaten % 3 === 0) {
            triggerQuestion();
        }
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
        restartGame();
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) { 
            
            // Snake eats own body
            gameOver = true;
            restartGame();
        }
    }
}

// Movement of the Snake - We are using addEventListener
function changeDirection(e) {
    if ((e.code == "ArrowUp" || e.key == "w" || e.key == "W") && speedY != 1) { 
        // If up arrow key pressed with this condition...
        // snake will not move in the opposite direction
        speedX = 0;
        speedY = -1;
    }
    else if ((e.code == "ArrowDown" || e.key == "s" || e.key == "S") && speedY != -1) {
        //If down arrow key pressed
        speedX = 0;
        speedY = 1;
    }
    else if ((e.code == "ArrowLeft" || e.key == "a" || e.key == "A") && speedX != 1) {
        //If left arrow key pressed
        speedX = -1;
        speedY = 0;
    }
    else if ((e.code == "ArrowRight" || e.key == "d" || e.key == "D") && speedX != -1) { 
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
    { q: "¿Which sentence correctly uses “going to” for a future plan?", options: ["I going to study English","i am going to study English","I will studiying English","i studies English tomorrow"], answer: 1 },
    { q: "Which sentence correctly uses Present Continuous for future plans?", options: ["We will meeting the manager tomorrow.","We meeting the manager tomorrow.","We going meet tomorrow.","We are meeting the manager tomorrow"], answer: 3 },
    { q: "Which sentence is correct?", options: ["She seeing the team leader.","She’s seeing the team leader next Monday.","She will seeing the team leader.","She see next Monday."], answer: 1 },
    { q: "Choose the incorrect sentence.", options: ["She is going to travel next year.","They are visiting us next Friday.","He going to buy a car.","We will call you later."], answer: 2 },
    { q: "Which sentence expresses a prediction based on evidence?", options: ["It will rains.", "Look at those clouds! It’s going to rain.", "It raining tomorrow.", "Rain tomorrow."], answer: 1 },
    { q: "Which sentence shows an instant decision?", options: ["I’ll answer the phone.", "I answer the phone yesterday.", "I am answering the phone next month.", "I going answer the phone."], answer: 0 },
];
function triggerQuestion(){
    const modal = document.getElementById('questionModal');
    if (!modal) return;
    modal.setAttribute('aria-hidden','false');
    gameOver = true;
    showQuestionModal(getRandomQuestion());
}

function getRandomQuestion(){
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
}

// Actualizar el contador de frutas en la interfaz
function updateFruitCounter(){
    const fruitCountElement = document.getElementById('fruitCount');
    if (fruitCountElement) {
        fruitCountElement.textContent = fruitsEaten;
    }
}

// Inicializar el contador de frutas
window.addEventListener('DOMContentLoaded', () => {
    updateFruitCounter();
});

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
        feedback.classList.remove('incorrect');
        feedback.classList.add('correct');
        feedback.textContent = '✓ ¡Correcto! Continúas jugando...';
        setTimeout(()=>{
            const modal = document.getElementById('questionModal');
            if (modal) modal.setAttribute('aria-hidden','true');
            gameOver = false;
        }, 700);
    } else {
        feedback.classList.remove('correct');
        feedback.classList.add('incorrect');
        feedback.textContent = '✗ Incorrecto. Reiniciando juego...';
        setTimeout(()=>{
            const modal = document.getElementById('questionModal');
            if (modal) modal.setAttribute('aria-hidden','true');
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
    fruitsEaten = 0;
    updateFruitCounter();
    placeFood();
    gameOver = false;
    // Limpiar feedback
    const feedback = document.getElementById('feedback');
    if (feedback) {
        feedback.textContent = '';
        feedback.classList.remove('correct', 'incorrect');
    }
}


