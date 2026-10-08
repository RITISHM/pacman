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

