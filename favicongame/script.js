let favicon = document.querySelector("[rel=icon]")
let canvas = document.querySelector("canvas")
let ctx = canvas.getContext("2d")
let score = 0, gameOver = false;
let caught = false;
class Rectangle{
    constructor(x, y, w, h, col){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.dir = 0;
        this.col = col;
    }
    collision(){
        for (let i = 0; i < balls.length; i++) {
            const ball = balls[i];
            if(ball.y >= this.y && ball.x >= this.x && ball.x < this.x+this.w){
                balls.splice(i, 1);
                caught = true;
                score++;
            }
        }
    }
    show(){
        fill(this.col);
        rect(this.x, this.y, this.w, this.h);
    }
}
class Ball{
    constructor(x, speed){
        this.x = x;
        this.y = -1;
        this.speed = speed;
    }
    update(){
        this.y += this.speed;
        if(this.y > 16+5) {
            GameOver();

        }
    }
    show(){
        fill("#000000");
        rect(this.x, this.y, 1, 1);        
    }
}
let plat;
let balls = [];
document.querySelector("body").addEventListener("keypress", (e) =>{
    keyPressed(e);
})

setup()
setInterval(() => {
    draw();
}, 60);


function setup(){
    createCanvas(16, 16);
    background("#ff2136");
    plat = new Rectangle(0, 13, 5, 1, "#aa00aa");
}
let caughtCoolDown = 0;
function draw(){
    if(!gameOver) {
        if(Math.random() < 0.03){
            balls.push(new Ball(Math.floor(Math.random()*16), 0.3));
        }
        if(caught){
            background(0, 150, 150)
            caughtCoolDown++;
            if(caughtCoolDown > 3){
                caughtCoolDown = 0;
                caught = false;
            }
        } else {
            background(0, 255, 255)
        }
        plat.show();
        plat.collision();
        balls.forEach(ball => {
            ball.update();
            ball.show();
        });
    } else {
        background(255, 0, 0);
        fill(255, 255, 255);
        ctx.textAlign = "center";
        ctx.font = "bold 8px Areal";
        ctx.fillText(score, 8, 11, 16);
    }
    setFavicon();
}

function keyPressed(e){
    if(e.key == 'a') plat.x--;
    else if(e.key == 'd') plat.x++;

    if(plat.x > 16-plat.w) plat.x = 16-plat.w;
    else if(plat.x < 0) plat.x = 0;
}


function createCanvas(width, height){
    canvas.width = width;
    canvas.height = height;
}

function setFavicon(){
    let favicon = document.querySelector("[rel=icon]")
    var newIcon = favicon.cloneNode(true);
    newIcon.setAttribute("href", canvas.toDataURL());
    favicon.parentNode.replaceChild(newIcon, favicon);
}











function GameOver(){
    gameOver = true;
    document.querySelector("#info").innerHTML = "Game Over! <br> score: "+score;
}

function restart(){
    gameOver = false;
    balls = [];
    score = 0;
    plat = new Rectangle(0, 13, 5, 1, "#aa00aa");
}


function viewAbout(){
    document.querySelector("#about").style.transform = "translate(-50%, -50%) scale(1)";
}
function closeAbout(){
    document.querySelector("#about").style.transform = "translate(-50%, -50%) scale(0)";
}


function background(r, g, b){
    let prevFill = ctx.fillStyle;
    fill(r,g,b);
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    fill(prevFill);
}
function fill(r, g, b){
    if(r[0] == '#') {ctx.fillStyle = r; return;}
    if(!g && !b) ctx.fillStyle = `rgb(${r}, ${r}, ${r})`;
    else if(!b) ctx.fillStyle = `rgba(${r}, ${r}, ${r}, ${g})`;
    else ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
}
function rect(x, y, w, h){
    ctx.fillRect(x, y, w, h);
}