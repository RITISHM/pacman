//board
console.log("js Loaded");
let board;
const rowCount = 21;
const colCount = 19;
const tileSize = 40;
const boardWidth = colCount * tileSize;
const boardHeight = rowCount * tileSize;
let context;

//images
let blueGhostImage;
let pinkGhostImage;
let orangeGhostImage;
let redGhostImage;
let pacmanUpImage;
let pacmanDownImage;
let pacmanLeftImage;
let pacmanRightImage;
let wallImage;

//audios
let eatSound;

//stats
let scoreElement;
let score;
let livesElement;
let lives;

//animation
let lastBlink;
let wait;

//X = wall, O = skip, P = pac man, ' ' = food
//Ghosts: b = blue, o = orange, p = pink, r = red
const tileMap = [
    "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X                 X",
    "X XX X XXXXX X XX X",
    "X    X       X    X",
    "XXXX XXXX XXXX XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXrXX X XXXX",
    "O    X  bpo  X    O",
    "XXXX X XXXXX X XXXX",
    "OOOX           XOOO",
    "XXXX X XXXXX X XXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X  X     P     X  X",
    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X XXXXXX X XXXXXX X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX",
];

const walls = new Set();
const foods = new Set();
const ghosts = new Set();
let pacman;
const directions = ["U", "D", "L", "R"];

window.onload = function () {
    board = document.getElementById("board");
    scoreElement = document.getElementById("score");
    score = 0;
    livesElement = this.document.getElementById("lives");
    lives = 3;
    board.height = boardHeight;
    board.width = boardWidth;
    wait = true;
    context = board.getContext("2d");

    loadImages();
    loadAudio();
    loadMap();
    // console.log(walls.size);
    // console.log(foods.size);
    // console.log(ghosts.size);
    for (let ghost of ghosts.values()) {
        const newDirection = directions[Math.floor(Math.random() * 4)]; //0-3
        ghost.updateDirection(newDirection);
    }
    update();
    document.addEventListener("keyup", movePacman);
};

function loadImages() {
    wallImage = new Image();
    wallImage.src = "../images/wall.png";

    blueGhostImage = new Image();
    blueGhostImage.src = "../images/blueGhost.png";

    redGhostImage = new Image();
    redGhostImage.src = "../images/redGhost.png";

    pinkGhostImage = new Image();
    pinkGhostImage.src = "../images/pinkGhost.png";

    orangeGhostImage = new Image();
    orangeGhostImage.src = "../images/orangeGhost.png";

    pacmanUpImage = new Image();
    pacmanUpImage.src = "../images/pacmanUp.png";

    pacmanDownImage = new Image();
    pacmanDownImage.src = "../images/pacmanDown.png";

    pacmanLeftImage = new Image();
    pacmanLeftImage.src = "../images/pacmanLeft.png";

    pacmanRightImage = new Image();
    pacmanRightImage.src = "../images/pacmanRight.png";
}

function loadAudio() {
    eatSound = new Audio("../audio/pacman-eating-food-dots.mp3");
    eatSound.loop = true;
}

function loadMap() {
    walls.clear();
    foods.clear();
    ghosts.clear();
    for (let i = 0; i < 3; i++) {
        if (i < lives) continue;
        const life = livesElement.children[i];
        life.classList.remove("lost");
    }
    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < colCount; c++) {
            const row = tileMap[r];
            const tileMapChar = row[c];

            const x = c * tileSize;
            const y = r * tileSize;

            if (tileMapChar == "X") {
                walls.add(new Wall(wallImage, x, y, tileSize, tileSize));
            } else if (tileMapChar == "b") {
                ghosts.add(new Ghost(blueGhostImage, x, y, tileSize, tileSize, "blue"));
            } else if (tileMapChar == "o") {
                ghosts.add(new Ghost(orangeGhostImage, x, y, tileSize, tileSize, "orange"));
            } else if (tileMapChar == "p") {
                ghosts.add(new Ghost(pinkGhostImage, x, y, tileSize, tileSize, "pink"));
            } else if (tileMapChar == "r") {
                ghosts.add(new Ghost(redGhostImage, x, y, tileSize, tileSize, "red"));
            } else if (tileMapChar == "P") {
                pacman = new Pacman(pacmanRightImage, x, y, tileSize, tileSize);
            } else if (tileMapChar == " ") {
                foods.add(new Food(x + 14, y + 14, 4, 4));
            }
        }
    }
    wait = true;
    setTimeout(() => { wait = false }, 1000);
}

function reloadMap() {
    if (lives === 0) {
        loadMap();
        lives = 3;
        score = 0;
        scoreElement.innerHTML = score;
    }
    else {
        ghosts.clear();
        for (let r = 0; r < rowCount; r++) {
            for (let c = 0; c < colCount; c++) {
                const row = tileMap[r];
                const tileMapChar = row[c];

                const x = c * tileSize;
                const y = r * tileSize;

                if (tileMapChar == "b") {
                    ghosts.add(new Ghost(blueGhostImage, x, y, tileSize, tileSize, "blue"));
                } else if (tileMapChar == "o") {
                    ghosts.add(new Ghost(orangeGhostImage, x, y, tileSize, tileSize, "orange"));
                } else if (tileMapChar == "p") {
                    ghosts.add(new Ghost(pinkGhostImage, x, y, tileSize, tileSize, "pink"));
                } else if (tileMapChar == "r") {
                    ghosts.add(new Ghost(redGhostImage, x, y, tileSize, tileSize, "red"));
                } else if (tileMapChar == "P") {
                    pacman = new Pacman(pacmanRightImage, x, y, tileSize, tileSize);
                }
            }
        }
        wait = true;
        setTimeout(() => { wait = false }, 1000);
    }
    for (let i = 0; i < 3; i++) {
        if (i < lives) continue;
        const life = livesElement.children[i];
        life.classList.add("lost");
    }
    for (let ghost of ghosts.values()) {
        const newDirection = directions[Math.floor(Math.random() * 4)]; //0-3
        ghost.updateDirection(newDirection);
    }
}

function update() {
    if (pacman.isDying) {
        blink();
    }
    else if (!pacman.isDying && !wait) {
        move();
    }
    draw();
    setTimeout(update, 1000 / 20);
}

function blink() {
    const currentTime = Date.now();

    if (!lastBlink || currentTime - lastBlink > 200) {
        pacman.visible = !pacman.visible;
        lastBlink = currentTime;
    }

}

function draw() {
    context.clearRect(0, 0, board.width, board.height);

    for (let ghost of ghosts) {
        context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
    }

    if (pacman.visible) {
        context.drawImage(
            pacman.image,
            pacman.x,
            pacman.y,
            pacman.width,
            pacman.height,
        );
    }
    for (let wall of walls) {
        context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
    }

    context.fillStyle = "yellow";
    for (let food of foods) {
        context.fillRect(food.x, food.y, food.width, food.height);
    }
}

function move() {

    if (pacman.direction !== pacman.newDirection) {
        pacman.updateDirection(pacman.nextDirection);
    }
    pacman.x += pacman.velocityX;
    pacman.y += pacman.velocityY;

    if (pacman.x == -tileSize && pacman.direction == "L") {
        pacman.x = boardWidth;
    } else if (pacman.x == boardWidth && pacman.direction == "R") {
        pacman.x = -tileSize;
    }
    for (let wall of walls.values()) {
        if (collison(pacman, wall)) {
            pacman.x -= pacman.velocityX;
            pacman.y -= pacman.velocityY;
            break;
        }
    }

    for (let ghost of ghosts.values()) {
        if (collison(pacman, ghost)) {
            lives--;
            pacman.isDying = true;
            if (pacman.isDying) {
                setTimeout(() => {
                    pacman.isDying = false;
                    reloadMap();
                    pacman.visible = true;
                }, 2000);

            }
            break;
        }
        if (ghost.x == -tileSize && ghost.direction == "L") {
            ghost.x = boardWidth;
        } else if (ghost.x == boardWidth && ghost.direction == "R") {
            ghost.x = -tileSize;
        }
        ghost.x += ghost.velocityX;
        ghost.y += ghost.velocityY;
        for (let wall of walls.values()) {
            if (collison(ghost, wall)) {
                ghost.x -= ghost.velocityX;
                ghost.y -= ghost.velocityY;
                const newDirection = getGhostDirections(ghost);
                ghost.updateDirection(newDirection);
            }
        }
    }
    let ateFoodThisFrame = false;
    for (let food of foods) {
        if (collison(pacman, food)) {
            foods.delete(food);
            score += 1;
            scoreElement.innerHTML = `Score: ${score}`;
            ateFoodThisFrame = true;
            break;
        }
    }

    if (foods.size === 0) {
        // Prevent multiple alerts by removing eatSound pause check 
        // to simplify. We'll just alert and let the loop run (empty map).
        if (!window.winAlertShown) {
            window.winAlertShown = true;
            setTimeout(() => alert("You Win!"), 100);
        }
    }

    if (ateFoodThisFrame) {
        if (eatSound.paused) {
            eatSound.play().catch(err => console.log("Audio error:", err));
        }
    } else {
        if (!eatSound.paused) {
            eatSound.pause();
            eatSound.currentTime = 0; // Optional: reset track position when stopping
        }
    }
}

function getGhostDirections(ghost) {
    const validDirections = [];
    const opposites = { "U": "D", "D": "U", "L": "R", "R": "L" };
    const backward = opposites[ghost.direction];

    for (let dir of directions) {
        if (dir === backward) continue; // Don't reverse unless forced

        // Test this direction
        ghost.direction = dir;
        ghost.updateVelocity();
        ghost.x += ghost.velocityX;
        ghost.y += ghost.velocityY;

        let hitWall = false;
        for (let wall of walls.values()) {
            if (collison(ghost, wall)) {
                hitWall = true;
                break;
            }
        }

        // Revert test
        ghost.x -= ghost.velocityX;
        ghost.y -= ghost.velocityY;

        if (!hitWall) {
            validDirections.push(dir);
        }
    }

    // Revert to original direction so we don't mess up current state
    ghost.direction = backward ? opposites[backward] : "R";
    ghost.updateVelocity();

    if (validDirections.length > 0) {
        return validDirections[Math.floor(Math.random() * validDirections.length)];
    } else {
        // If stuck (dead end), must reverse
        return backward || directions[Math.floor(Math.random() * 4)];
    }
}

function movePacman(e) {
    if (e.code == "ArrowUp" || e.code == "KeyW") {
        pacman.nextDirection = "U";
    }
    if (e.code == "ArrowDown" || e.code == "KeyS") {
        pacman.nextDirection = "D";
    }
    if (e.code == "ArrowRight" || e.code == "KeyD") {
        pacman.nextDirection = "R";
    }
    if (e.code == "ArrowLeft" || e.code == "KeyA") {
        pacman.nextDirection = "L";
    }
}

function collison(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// ========== ENTITY CLASSES ==========

// Base class for all game objects
class Entity {
    constructor(image, x, y, width, height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.startX = x;
        this.startY = y;
    }

    draw(ctx) {
        if (this.image) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}

// Static entity: Wall tile
class Wall extends Entity {
    constructor(image, x, y, width, height) {
        super(image, x, y, width, height);
    }
}

// Static entity: Food dot (no image, drawn as a filled rectangle)
class Food extends Entity {
    constructor(x, y, width, height) {
        super(null, x, y, width, height);
    }

    draw(ctx) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Base class for moving entities (Pacman and Ghosts)
class Character extends Entity {
    constructor(image, x, y, width, height) {
        super(image, x, y, width, height);
        this.direction = "R";
        this.velocityX = 0;
        this.velocityY = 0;
    }

    updateDirection(direction) {
        const prevDirection = this.direction;
        this.direction = direction;
        this.updateVelocity();

        // Test move to check wall collision
        this.x += this.velocityX;
        this.y += this.velocityY;

        let hitWall = false;
        for (let wall of walls.values()) {
            if (collison(this, wall)) {
                hitWall = true;
                break;
            }
        }

        // Always revert the test move
        this.x -= this.velocityX;
        this.y -= this.velocityY;

        // If turn was invalid, revert direction
        if (hitWall) {
            this.direction = prevDirection;
            this.updateVelocity();
        }
    }

    updateVelocity() {
        if (this.direction == "U") {
            this.velocityX = 0;
            this.velocityY = -tileSize / 4;
        } else if (this.direction == "D") {
            this.velocityX = 0;
            this.velocityY = tileSize / 4;
        } else if (this.direction == "R") {
            this.velocityX = tileSize / 4;
            this.velocityY = 0;
        } else if (this.direction == "L") {
            this.velocityX = -tileSize / 4;
            this.velocityY = 0;
        } else if (this.direction == "S") {
            this.velocityX = 0;
            this.velocityY = 0;
        }
    }
}

// Pacman: handles directional sprite switching
class Pacman extends Character {
    constructor(image, x, y, width, height) {
        super(image, x, y, width, height);
        this.nextDirection = this.direction;
        this.isDying = false;
        this.visible = true;
    }

    updateDirection(direction) {
        super.updateDirection(direction);
        // Update sprite based on current facing direction
        if (this.direction == "U") {
            this.image = pacmanUpImage;
        } else if (this.direction == "D") {
            this.image = pacmanDownImage;
        } else if (this.direction == "L") {
            this.image = pacmanLeftImage;
        } else if (this.direction == "R") {
            this.image = pacmanRightImage;
        }
    }
}

// Ghost: stores ghost name/type for future AI behaviors
class Ghost extends Character {
    constructor(image, x, y, width, height, name) {
        super(image, x, y, width, height);
        this.name = name; // "red", "pink", "blue", "orange"
    }
}
