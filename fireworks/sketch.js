let particles = [];
let tails = [];
let startColor, endColor;
let explosion;


function preload() {
    soundFormats("mp3", "ogg");
    explosion = loadSound("explosion");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    stroke("#e8e351");
    strokeWeight(3);
    colorMode(RGB);
    startColor = color("#32defc");
    endColor = color("#d1ff75");
}

function draw() {
    background(0, 50);
    for (let i = 0; i < tails.length; i++) {
        tails[i].show();
        tails[i].update();
    }
    for (let i = 0; i < particles.length; i++) {
        particles[i].show();
        particles[i].update();
    }
}

function mousePressed() {
    tails.push(new Tail(mouseX, mouseY, 200));
}



class Particle {
    constructor (x, y, size, vel) {
        this.pos = createVector(x, y);
        this.ppos = this.pos.copy();
        this.startPos = this.pos.copy();
        this.size = size;
        this.vel = vel;
        this.lifeSpan = random(0.2, 1) * frameRate();
        this.life = this.lifeSpan;
    }

    update () {
        this.pos.add(this.vel);
        this.vel.add(createVector(0, 0.03));
        this.lifeSpan--;
        this.delete();
    }

    show () {
        push();
        var lerpAmount = map(this.lifeSpan, 0, this.life, 0, 1);
        stroke(lerpColor(endColor, startColor, lerpAmount));
        line(this.ppos.x, this.ppos.y, this.pos.x, this.pos.y);
        this.ppos = this.pos.copy();
        pop();
    }

    delete () {
        if (this.lifeSpan <= 0) {
            var index = particles.indexOf(this);
            particles.splice(index, 1);
        }
    }
}

class Tail {
    constructor (x, y, offset) {
        this.pos = createVector(x, y);
        this.startpos = this.pos.copy();
        this.startpos.y += offset;
        this.ppos = this.startpos.copy();
        this.lifeTime = 0;
    }
    update () {
        this.lifeTime += 1;
        this.startpos.y -= 5;
        this.startpos.x += (noise(this.pos.x + this.lifeTime * 0.4)*6 -3);
        this.boom();
    }
    show () {
        line(this.ppos.x, this.ppos.y, this.startpos.x, this.startpos.y);
        this.ppos = this.startpos.copy();
    }

    boom () {
        if (this.startpos.y <= this.pos.y) {
            tails.splice(tails.indexOf(this), 1);
            for (let i = 0; i < 150; i++) {
                var vel = p5.Vector.random2D();
                vel.setMag(random(0.7, 3));
                particles.push(new Particle(this.startpos.x, this.startpos.y, 2, vel));
            }
            explosion.play();
        }
    }
}


window.onload = () => {
    let bannerNode = document.querySelector('[alt="www.000webhost.com"]').parentNode.parentNode;
    bannerNode.parentNode.removeChild(bannerNode);
};