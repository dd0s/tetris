const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

const matrix = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0]
];

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
        player.pos.y = 0;
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
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
    matrix: matrix
}

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {             // left
        playerMove(-1);
    } else if (event.keyCode === 39) {      // right
        playerMove(1);
    } else  if (event.keyCode === 40) {     // down
        playerDrop();
    }
});

update();
