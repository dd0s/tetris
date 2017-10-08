const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

const matrix = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0]
];

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);    
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
    dropCounter = 0;
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
    pos: { x: 5, y: 5 },
    matrix: matrix
}

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {             // left
        player.pos.x--;
    } else if (event.keyCode === 39) {      // right
        player.pos.x++;
    } else  if (event.keyCode === 40) {     // down
        playerDrop();
    }
});

update();
