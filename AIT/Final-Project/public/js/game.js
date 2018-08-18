// INITIALIZE GLOBAL VARIABLES TO BE USED THROUGHOUT GAME

class Board{
	constructor(){
		this.width = 1000;
		this.height = 1000;
	}
}

class Snake{
	constructor(){
		this.direction = "d"; // TRACKER OF DIRECTION BY USER INPUT , DEFAULT START IS DOWN
		this.body = []; // SNAKE OBJECT, WILL HOLD ARRAY OF OBJECTS
		this.size = 20; // BASE UNIT SIZE OF BLOCKS IN BOARD GRID
	}
}

class Apple{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
}

// SKELETON OF GAME BASED ON TUTORIAL AT COMPETA.COM

// IMPLEMENTATION DONE COMPLETELY BY MYSELF (NO LARGE SEGMENTS OF CODE TAKEN)
	// ONLY LOGIC OF GAME AND DRAWING ALGORITHMS INSPIRED BY TUTORIAL
	// AS WELL AS BASIC UNDERSTANDINGS OF A GAME ENGINE

// GET CANVAS

const canv = document.getElementById('board');
// everything in 2-D
const context = canv.getContext('2d');

let apple; // CURRENT APPLE ON THE BOARD

let board = new Board();

let snake = new Snake();

let gameloop;

let userScore = 0; //INITIALIZE USER'S SCORE TO 0

const mode = document.getElementById('mode');

const start = document.getElementById('startBtn');
	const description = document.getElementById('instructions');
	const p = document.createElement('p');

	const easy = document.getElementById('choice1');
	const medium = document.getElementById('choice2');
	const hard = document.getElementById('choice3');

// DRAWING CODE INSPIRED BY TUTORIAL
function drawApple(apple){
	context.fillStyle = 'red';
	context.fillRect(apple.x*snake.size, apple.y*snake.size, snake.size-4, snake.size-4);
}

// END GAME PROCEDURE
function reset(){
	start.disabled = false;	 // ENABLE START BUTTON
	start.classList.remove('invisible');

	// SEND SCORE TO SERVER
		// IF HIGH SCORE, WILL ADD TO LEADERBOARDS
	const req = new XMLHttpRequest();
	req.open('POST', '/send');
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	const str = "mode=" + mode.textContent + "&score=" + userScore;
	req.send(str);

	p.appendChild(document.createElement("br"));

	p.textContent += ", Click Start to Play Again!";

	p.classList.remove('Score'); // CHANGE SCORE STYLING
	p.classList.add('endGame');
	apple = {}; // RESET NECESSARY OBJECTS

	gameloop = clearInterval(gameloop);
}

// CREATE NEW FOOD OBJECT - INPUT X AND Y LOCATION
function placeApple(){
	// GENERATE AN X-COORDINATE AND Y-COORDINATE
		// DON'T ALLOW IT TO BE WHERE SNAKE BODY ALREADY IS

	let x = Math.floor((Math.random()*30) + 1);
	let y = Math.floor((Math.random()*30) + 1);

	// IF X,Y INTERFERE WITH ANY SNAKE COORDINATES, RECALCULATE X AND Y
	for(let i = 0; i < snake.body.length; i++){
		if(x === snake.body[i].x && y === snake.body[i].y){
			x = Math.floor((Math.random()*30)+1);
			y = Math.floor((Math.random()*30)+1);
			i--;
		}
	}

	const createApple = new Apple(x, y); // MAKE NEW APPLE
	apple = createApple;
}

// DRAWING LOGIC FROM TUTORIAL
function drawSnakeBody(x, y){
	context.fillStyle = 'black';
	context.fillRect(x*snake.size, y*snake.size, snake.size, snake.size);
	context.strokeStyle = 'white';
	context.strokeRect(x*snake.size, y*snake.size, snake.size, snake.size); // WHITE BORDER
}

function checkCollision(head, snake){ // CHECK COLLISION WITH ITSELF
	for(let i = 0; i < snake.body.length; i++){ // IF HEAD === ANY BODY PART, RETURN TRUE
		if(head.x === snake.body[i].x && head.y === snake.body[i].y){
			return true;
		}
	}
	return false;
}

function checkWallCollision(head, snake, board){ //CHECK COLLISION WITH ANY WALL
	if(head.x === -1 || head.x === board.width / snake.size || head.y === -1 || head.y === board.height / snake.size){
		return true;
	}
	return false;
}

// GAME ENGINE INSPIRED BY SAME TUTORIAL
	// IMPLEMENTATION MY OWN

function play(){

	context.fillStyle = "lightgrey";
	context.fillRect(0, 0, board.width, board.height);
	context.strokeStyle = 'black';
	context.strokeRect(0, 0, board.width, board.height);

	const head = {x: snake.body[0].x, y: snake.body[0].y};

	// MOVE HEAD BASED ON direction
	if(snake.direction === 'd'){
		head.y++;
	}
	else if(snake.direction === 'u'){
		head.y--;
	}
	else if(snake.direction === 'l'){
		head.x--;
	}
	else{
		head.x++;
	}

	// CHECK IF ANY COLLISIONS OCCUR
	// 1. WITH CANVAS FRAME ITSELF
	if(checkWallCollision(head, snake, board)){
		reset();
		return;
	}

	// 2. WITH ITSELF
	if(checkCollision(head, snake) === true){
		reset();
		return;
	}

	let tail = {};

	// IF HEAD === APPLE
	if(head.x === apple.x && head.y === apple.y){
		// UPDATE SCORE BASED ON DIFFICULTY
		if(mode.textContent === 'Medium'){
			userScore += 10;
		}
		else if(mode.textContent === 'Hard'){
			userScore += 20;
		}
		else{
			userScore += 5;
		}
		// NEW FOOD
		placeApple();
	}
	else{
		tail = snake.body.pop();
	}

	// MOVE NEW SNAKE HEAD TO BEGINNING OF ARRAY, POP OUT LAST ELEMENT TO SIMULATE MOVEMENT
	// LOGIC FROM TUTORIAL
	tail.x = head.x;
	tail.y = head.y;

	snake.body.unshift(tail); 

	// DRAW SNAKE
	for(let i = 0; i < snake.body.length; i++){
		drawSnakeBody(snake.body[i].x, snake.body[i].y);
	}

	drawApple(apple);


	// UPDATE SCORE
	p.textContent = "Your Score: " + userScore;

}

function init(){
	// ONLY PUT THINGS THAT'LL HAPPEN ONCE IN THE GAME

	board = new Board();
	snake = new Snake();


	p.classList.remove("endGame");
	p.classList.add("Score");

	userScore = 0;

	start.disabled = 'true'; // DISABLE START BUTTON
	start.classList.add('invisible');

	// DISPLAY SCORE COUNTER
	p.textContent = "Your Score: " + userScore;
	description.appendChild(p);

	// INITIALIZE SNAKE
		// BEGIN AS LENGTH 5
	const length = 5;
	// PUSH ELEMENTS INTO SNAKE ARRAY
		// FIRST INDEX SHOULD ALWAYS BE HEAD OF SNAKE
	for(let i = length-1; i >= 0; i--){
		snake.body.push({x: 0, y: i});
	}

	placeApple(); // DRAW FIRST APPLE

	// CHANGE FREQUENCY OF LOOP BASED ON SELECTED DIFFICULTY

	// GAMELOOP CONCEPT USED IN TUTORIAL

	if(hard.checked){
		gameloop = setInterval(play, 20);
	}
	else if(medium.checked){
		gameloop = setInterval(play, 50); // UPDATE FREQUENTLY
	}
	else{
		gameloop = setInterval(play, 80); // DEFAULT EASY
	}
}

function main(){

	context.fillStyle = "lightgrey";
	context.fillRect(0, 0, board.width, board.height);
	context.strokeStyle = 'black';
	context.strokeRect(0, 0, board.width, board.height);

	easy.addEventListener('click', function(){
		mode.textContent = "Easy";
	});

	medium.addEventListener('click', function(){
		mode.textContent = "Medium";
	});

	hard.addEventListener('click', function(){
		mode.textContent = "Hard";
	});


	// START BASED ON START BUTTON
	start.addEventListener('click', function(){ init(); });

	// ADD EVENT LISTENER WHENEVER ONE OF THE ARROW KEYS IS PRESSED

	function handleKey(evt){
		const dir = evt.keyCode; // NUMBER VALUE OF KEY PRESSED

		if(dir === 37){ // LEFT
			evt.preventDefault();
			if(snake.direction !== 'r'){ // UNLESS TRAVELLING RIGHT
				snake.direction = 'l';	// CHANGE TO LEFT
			}
		}
		if(dir === 38){ // UP
			evt.preventDefault();
			if(snake.direction !== 'd'){
				snake.direction = 'u';
			}
		}
		if(dir === 39){ // RIGHT
			evt.preventDefault();
			if(snake.direction !== 'l'){
				snake.direction = 'r';
			}
		}
		if(dir === 40){ // DOWN
			evt.preventDefault();
			if(snake.direction !== 'u'){
				snake.direction ='d';
			}
		}

	}

	document.onkeydown = handleKey;

}

main();

module.exports = {
	checkCollision: checkCollision,
	checkWallCollision: checkWallCollision
};