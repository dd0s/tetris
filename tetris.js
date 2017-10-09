const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

function collide(arena, player) {
    const [pm, offset] = [player.matrix, player.pos];
    for (let y = 0; y < pm.length; ++y) {
        for (let x = 0; x < pm[y].length; ++x) {
            // TODO: rewrite this if
            if ( pm[y][x] !== 0          && 
                (arena[y + offset.y]     && 
                 arena[y + offset.y][x + offset.x]) !== 0 ) {
                    return true;
            }
        }
    }
    return false;
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
}

function createMatrix(w, h) {
    const matrix = [];
    while(h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function createPiece(type) {
    if (type === 'T') {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ];
    } else if (type === 'O') {
        return [
            [1, 1],
            [1, 1]
        ];
    } else if (type === 'L') {
        return [
            [1, 0, 0],
            [1, 0, 0],
            [1, 1, 1]
        ];
    } else if (type === 'J') {
        return [
            [0, 0, 1],
            [0, 0, 1],
            [1, 1, 1]
        ];
    } else if (type === 'I') {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0]
        ];
    } else if (type === 'S') {
        return [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ];
    } else if (type === 'Z') {
        return [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ];
    }
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

// Syntax for forEach:
// arr.forEach(function callback(currentValue, index, array) {
//     //your iterator
// }[, thisArg]);
function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = 'red';
                context.fillRect( x + offset.x, 
                                  y + offset.y, 
                                  1, 1 );
            }
        });
    });
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2) - 
                   (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
    }
}

function playerRotate(dir) {
    let offset = 1;
    rotate(player.matrix, dir);
    while(collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();    
    }
    /* the time will eventually grow each frame, 
       because timeStamp is passed to callback*/
    // console.log(deltaTime); 
    draw();
    // The 'update 'callback has one single argument, a DOMHighResTimeStamp, 
    // which indicates the current time (the time returned from 
    // performance.now() ) for when requestAnimationFrame starts to fire 
    // callbacks.
    requestAnimationFrame(update);
}

const arena = createMatrix(12, 20);
// console.log(arena);
console.table(arena);

const player = {
    pos: { x: 5, y: 5 },    // offset from beggining coord
    matrix: createPiece('T')
}

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {             // left
        playerMove(-1);
    } else if (event.keyCode === 39) {      // right
        playerMove(1);
    } else  if (event.keyCode === 40) {     // down
        playerDrop();
    } else if (event.keyCode === 81) {
        playerRotate(-1);
    } else if (event.keyCode === 87) {
        playerRotate(1);
    }
});

update();
