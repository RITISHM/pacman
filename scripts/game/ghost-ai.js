function getGhostDirections(ghost) {
    // calulate the coordinates
    const ghostC = Math.round(ghost.x / tileSize);
    const ghostR = Math.round(ghost.y / tileSize);
    const pacmanC = Math.round(pacman.x / tileSize);
    const pacmanR = Math.round(pacman.y / tileSize);

    // ask bfs for next move
    let nextDirection = findShotestPath(ghostR, ghostC, pacmanR, pacmanC);

    // if bfs finds path then use it
    if (nextDirection) {
        return nextDirection;
    }

    // if not then move randomly 
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

function findShotestPath(startR, startC, targetR, targetC) {
    if (startC == targetC && startR == targetR) return;

    const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    const direction = { "1,0": "D", "-1,0": "U", "0,-1": "L", "0,1": "R" };
    const queue = [];
    const visited = new Set();

    queue.push({ r: startR, c: startC, path: [] });
    visited.add(`${startR},${startC}`);

    while (queue.length > 0) {
        const curr = queue.shift();
        let c = curr.c;
        let r = curr.r;
        let currentPath = curr.path;
        if (c === targetC && r === targetR) {
            return currentPath[0];
        }

        for (let dir of dirs) {
            let nR = r + dir[0];
            let nC = c + dir[1];
            let key = `${dir[0]},${dir[1]}`;

            if (nR >= 0 && nR < rowCount &&
                nC >= 0 && nC < colCount
                && !visited.has(`${nR},${nC}`) &&
                tileMap[nR][nC] !== "X") {

                let nDirection = direction[key];
                let nPath = [...currentPath, nDirection];
                queue.push({ r: nR, c: nC, path: nPath });
                visited.add(`${nR},${nC}`);

            }
        }

    }
}