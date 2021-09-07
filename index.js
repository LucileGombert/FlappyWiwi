const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const img = new Image();
img.src = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

const bgImg = new Image();
bgImg.src = "./flowersBg.jpg";

const monkeyImg = new Image();
monkeyImg.src = "./bananamonkey.png";

const gameoverImg = new Image();
gameoverImg.src ="./gameoverRemovebg.png";

const gameoverBgImg = new Image();
gameoverBgImg.src ="./bg.jpg";

//General settings
let gamePlaying = false;
let gameOver = false;
const gravity = .5;
const speed = 6.2;
const originSize = [231, 207];
const originSizeGameover = [500, 500]
const size = [100, 80];
const sizeGameover = [200, 200]
const jump = -11.5;
const cTenth = (canvas.width / 10);

//Pipe Settings
let pipeWidth = 78;
const pipeGap = 320;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

let index = 0;
let bestScore = 0;
let currentScore = 0;
let pipes = [];
let flight;
let flyHeight;

const setup = () => {
    currentScore = 0;
    flight = jump;
    flyHeight = (canvas.height / 2) - (size[1] / 2);

    pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

const render = () => {
    index++;

    //Fisrt part background
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height, -((index * (speed /2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);

    //Second part background
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height, -((index * (speed /2)) % canvas.width), 0, canvas.width, canvas.height);

    
    if(gamePlaying) {
        //Display jump monkey
        ctx.drawImage(monkeyImg, 0, 0, ...originSize, cTenth, flyHeight, ...size);
        
        flight += gravity;
        flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);

    }  else if (gameOver) {
        //Display gameover page
        ctx.drawImage(gameoverBgImg, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(gameoverImg, 0, 0, ...originSizeGameover, ((canvas.width / 2) - 100), flyHeight + 65, ...sizeGameover);
        ctx.fillText(`Game Over !`, 130, 150);
        
    } else {
        //Display home page
        ctx.drawImage(monkeyImg, 0, 0, ...originSize, ((canvas.width / 2) - 50), flyHeight +30, ...size);

        flyHeight = (canvas.height / 2) -(size[1] / 2);

        ctx.fillText(`Meilleur score : ${bestScore}`, 55, 145);
        ctx.fillText(`Cliquez pour jouer`, 48, 475);
        ctx.font = "bold 30px courier";
    }

    //Display pipes
    if(gamePlaying) {
        pipes.map(pipe => {
            pipe[0] -= speed;

            //Top pipes
            ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
            
            //Bottom pipes
            ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe [0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);
        
            if(pipe[0] <= -pipeWidth) {
                currentScore++;
                bestScore = Math.max(bestScore, currentScore);

                //Remove pipe and create new one
                pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()]];
            }

            //Gameover
            if([
                pipe[0] <= cTenth + size[0],
                pipe[0] + pipeWidth >= cTenth,
                pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
            ].every(elem => elem)) {
                gamePlaying = false;
                gameOver = true;
                
                setTimeout(function() {
                    gameOver = false;
                }, 2000);
              
                setup();
            }
        })
    }

    document.getElementById('bestScore').innerHTML = `Meilleur : ${bestScore}`;
    document.getElementById('currentScore').innerHTML = `Actuel : ${currentScore}`;
    window.requestAnimationFrame(render);
}

setup();
img.onload = render;

// start game
document.addEventListener('click', () => gamePlaying = true);
window.onclick = () => flight = jump;