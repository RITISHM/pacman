//board
console.log("js Loaded");
let board;
const rowCount = 21;
const colCount = 19;
const tileSize = 40;
const boardWidth = colCount * tileSize;
const boardHeight = rowCount * tileSize;
let context;
let scoreElement;
let score;

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
    "O       bpo       O",
    "XXXX X XXXXX X XXXX",
    "OOOX X       X XOOO",
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
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    loadImages();
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
    wallImage.src = "./images/wall.png";

    blueGhostImage = new Image();
    blueGhostImage.src = "./images/blueGhost.png";

    redGhostImage = new Image();
    redGhostImage.src = "./images/redGhost.png";

    pinkGhostImage = new Image();
    pinkGhostImage.src = "./images/pinkGhost.png";

    orangeGhostImage = new Image();
    orangeGhostImage.src = "./images/orangeGhost.png";

    pacmanUpImage = new Image();
    pacmanUpImage.src = "./images/pacmanUp.png";

    pacmanDownImage = new Image();
    pacmanDownImage.src = "./images/pacmanDown.png";

    pacmanLeftImage = new Image();
    pacmanLeftImage.src = "./images/pacmanLeft.png";

    pacmanRightImage = new Image();
    pacmanRightImage.src = "./images/pacmanRight.png";
}

function loadMap() {
    walls.clear();
    foods.clear();
    ghosts.clear();

    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < colCount; c++) {
            const row = tileMap[r];
            const tileMapChar = row[c];

            const x = c * tileSize;
            const y = r * tileSize;

            if (tileMapChar == "X") {
                const wall = new Block(wallImage, x, y, tileSize, tileSize);
                walls.add(wall);
            } else if (tileMapChar == "b") {
                const ghost = new Block(blueGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            } else if (tileMapChar == "o") {
                const ghost = new Block(orangeGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            } else if (tileMapChar == "p") {
                const ghost = new Block(pinkGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            } else if (tileMapChar == "r") {
                const ghost = new Block(redGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            } else if (tileMapChar == "P") {
                pacman = new Block(pacmanRightImage, x, y, tileSize, tileSize);
            } else if (tileMapChar == " ") {
                const food = new Block(null, x + 14, y + 14, 4, 4);
                foods.add(food);
            }
        }
    }
}

function reloadMap() {
    ghosts.clear();
    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < colCount; c++) {
            const row = tileMap[r];
            const tileMapChar = row[c];

            const x = c * tileSize;
            const y = r * tileSize;

            if (tileMapChar == "b") {
                const ghost = new Block(blueGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            } else if (tileMapChar == "o") {
                const ghost = new Block(orangeGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            } else if (tileMapChar == "p") {
                const ghost = new Block(pinkGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            } else if (tileMapChar == "r") {
                const ghost = new Block(redGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            } else if (tileMapChar == "P") {
                pacman = new Block(pacmanRightImage, x, y, tileSize, tileSize);
            }
        }
    }
    for (let ghost of ghosts.values()) {
        const newDirection = directions[Math.floor(Math.random() * 4)]; //0-3
        ghost.updateDirection(newDirection);
    }
}

function update() {
    move();
    draw();
    setTimeout(update, 1000 / 20);
}

function draw() {
    context.clearRect(0, 0, board.width, board.height);

    context.drawImage(
        pacman.image,
        pacman.x,
        pacman.y,
        pacman.width,
        pacman.height,
    );
    for (let ghost of ghosts) {
        context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
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
    pacman.x += pacman.velocityX;
    pacman.y += pacman.velocityY;

    if (pacman.x == -tileSize && pacman.direction == "L") {
        pacman.x = boardWidth;
    } else if (pacman.x == boardWidth && pacman.direction == "R") {
        pacman.x = -10;
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
            reloadMap();
        }
        if (ghost.x == -tileSize && ghost.direction == "L") {
            ghost.x = boardWidth;
        } else if (ghost.x == boardWidth && ghost.direction == "R") {
            ghost.x = -10;
        }
        ghost.x += ghost.velocityX;
        ghost.y += ghost.velocityY;
        for (let wall of walls.values()) {
            if (collison(ghost, wall)) {
                ghost.x -= ghost.velocityX;
                ghost.y -= ghost.velocityY;
                const newDirection = getGhostDirections(); //0-3
                ghost.updateDirection(newDirection);
            }
        }
    }

    for (let food of foods) {
        if (collison(pacman, food)) {
            foods.delete(food);
            score += 1;
            scoreElement.innerHTML = `Score: ${score}`;
        }
    }
}

function getGhostDirections() {
    return directions[Math.floor(Math.random() * 4)];
}

function movePacman(e) {
    if (e.code == "ArrowUp" || e.code == "KeyW") {
        pacman.updateDirection("U");
    }
    if (e.code == "ArrowDown" || e.code == "KeyS") {
        pacman.updateDirection("D");
    }
    if (e.code == "ArrowRight" || e.code == "KeyD") {
        pacman.updateDirection("R");
    }
    if (e.code == "ArrowLeft" || e.code == "KeyA") {
        pacman.updateDirection("L");
    }

    if (pacman.direction == "U") {
        pacman.image = pacmanUpImage;
    } else if (pacman.direction == "D") {
        pacman.image = pacmanDownImage;
    } else if (pacman.direction == "L") {
        pacman.image = pacmanLeftImage;
    } else if (pacman.direction == "R") {
        pacman.image = pacmanRightImage;
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

class Block {
    constructor(image, x, y, width, height, side) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.startX = x;
        this.startY = y;

        this.direction = "R";
        this.velocityX = 0;
        this.velocityY = 0;
        if (side) {
            this.side = side;
        }
    }

    updateDirection(direction) {
        const prevDirection = this.direction;
        this.direction = direction;
        this.updateVelocity();
        this.x += this.velocityX;
        this.y += this.velocityY;

        //this is to prenvent the pacman from going through wall and changing direction when incase of collision
        for (let wall of walls.values()) {
            if (collison(this, wall)) {
                this.x -= this.velocityX;
                this.y -= this.velocityY;
                this.direction = prevDirection;
                this.updateVelocity();
                return;
            }
        }
    }
    updateVelocity() {
        if (this.direction == "U") {
            this.velocityX = 0;
            this.velocityY = -tileSize / 4;
        }

        if (this.direction == "D") {
            this.velocityX = 0;
            this.velocityY = tileSize / 4;
        }

        if (this.direction == "R") {
            this.velocityX = tileSize / 4;
            this.velocityY = 0;
        }

        if (this.direction == "L") {
            this.velocityX = -tileSize / 4;
            this.velocityY = 0;
        }
        if (this.direction == "S") {
            this.velocityX = 0;
            this.velocityY = 0;
        }
    }
}
