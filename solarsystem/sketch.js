let sun;
let sunTexture, mercuryTexture, venusTexture, earthTexture, marsTexture, jupiterTexture, saturnTexture, uranusTexture, neptuneTexture;
let space1;
var eSize = 13;
var eYear = 13;
var eDay = 1;
let speedSlider;

function preload() {
    space1 = loadImage("space1.jpg");
    sunTexture = loadImage("sun.jpg");
    mercuryTexture = loadImage("mercury.jpg");
    venusTexture = loadImage("venus.jpg");
    earthTexture = loadImage("earth.jpg");
    marsTexture = loadImage("mars.jpg");
    jupiterTexture = loadImage("jupiter.jpg");
    saturnTexture = loadImage("saturn.jpg");
    uranusTexture = loadImage("uranus.jpg");
    neptuneTexture = loadImage("neptune.jpg");
}

function setup() {
    createCanvas(windowWidth-50, windowHeight-50, WEBGL);
    createP("Speed");
    speedSlider = createSlider(0, 8, 1, 0);
    background(7, 11, 52);
    noFill();
    strokeWeight(0.3);
    sun = new Sun(50);
    createEasyCam();
    lightFalloff(0.5, 0, 0);
}

function draw() {
    background(7, 11, 52);
    push();
    texture(space1);
    sphere(3000);
    pop();
    sun.show(speedSlider.value());
}

class Planet {
    constructor (name, distance, size, speed, rotSpeed, textureImg) {
        this.name = name;
        this.textureImg = textureImg;
        this.rotSpeed = rotSpeed;
        this.rot = 0;
        this.angle = 0;
        this.pos = createVector(100*distance*cos(this.angle), 100*distance*sin(this.angle));
        this.distance = distance;
        this.size = size;
        this.speed = speed;
    }
    update (val) {
        if(this.name == "venus") this.rot -= this.rotSpeed * 0.1;
        else this.rot += this.rotSpeed * 0.1;
        this.angle += 0.001 * this.speed * val;
        this.pos.x = this.distance*cos(this.angle);
        this.pos.y = this.distance*sin(this.angle);
    }
    show () {
        stroke(255);
        ellipse(0, 0, this.distance*2, this.distance*2, 35);
        noStroke();
        push();
        translate(this.pos.x, this.pos.y);
        rotateX(3*PI/2);
        rotateY(this.rot);
        texture(this.textureImg);
        if(this.name == "saturn"){
            push();
            rotateX(HALF_PI);
            torus(this.size+3, 3);
            torus(this.size+8, 3);
            pop();
        }
        sphere(this.size);
        pop();
    }
}

class Sun {
    constructor (size) {
        this.rot = 0;
        this.size = size;
        this.planets = [];
        this.planets.push(new Planet("mercury", 70,  eSize*0.4, eYear*4.1,   eDay/58,   mercuryTexture));
        this.planets.push(new Planet("venus",   100, eSize*0.9, eYear*1.6,   eDay/200,  venusTexture));
        this.planets.push(new Planet("earth",   135, eSize,     eYear*1,     eDay/1,    earthTexture));
        this.planets.push(new Planet("mars",    175, eSize*0.5, eYear*0.5,   eDay/1,    marsTexture));
        this.planets.push(new Planet("jupiter", 220, eSize*1.3, eYear*0.08,  eDay/0.4,  jupiterTexture));
        this.planets.push(new Planet("saturn",  260, eSize*1.2, eYear*0.03,  eDay/0.41, saturnTexture));
        this.planets.push(new Planet("uranus",  290, eSize*1.1, eYear*0.01,  eDay/0.7,  uranusTexture));
        this.planets.push(new Planet("neptune", 330, eSize*1.1, eYear*0.001, eDay/0.62, neptuneTexture));
    }
    show (sliderVal) {
        this.rot += 0.001;
        push();
        ambientLight(255);
        texture(sunTexture);
        rotateZ(this.rot);
        sphere(this.size);
        pop();
        pointLight(255, 255, 255, 0, 0, 0);
        ambientLight(80);
        for (let i = 0; i < this.planets.length; i++) {
            this.planets[i].update(sliderVal);
            this.planets[i].show();
        }
    }
}