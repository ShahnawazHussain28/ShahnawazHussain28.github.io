// Diwali fireworks: my 2021 version, rebuilt.
// Open index.html?name=Priya to greet someone.

// Switch the upgrades on one at a time
const settings = {
  colors: true,
  glow: true,
  shapes: true,
  twinkle: true,
  finale: true,
};

const GRAVITY = 0.12;
const SHAPES = ["peony", "ring", "rangoli", "willow"];

let rockets = [];
let sparks = [];
let textPoints = [];
let friend = "";

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  strokeCap(ROUND);
  friend = getFriendName();
  textPoints = makeTextPoints();
  background(0);
}

function draw() {
  // Black at low opacity: old sparks fade into trails
  blendMode(BLEND);
  background(0, 0, 0, 0.2);

  if (settings.glow) {
    // Overlapping light adds up, like real light
    blendMode(ADD);
  }

  autoLaunch();
  updateAll(rockets);
  updateAll(sparks);
}

function updateAll(list) {
  // Walk backwards, so removing one never skips the next
  for (let i = list.length - 1; i >= 0; i--) {
    list[i].update();
    list[i].show();
    if (list[i].done()) {
      list.splice(i, 1);
    }
  }
}

function autoLaunch() {
  // A new rocket every 40 frames
  if (frameCount % 40 === 0) {
    const x = random(width * 0.15, width * 0.85);
    rockets.push(new Rocket(x, pickShape()));
  }

  // The finale: 7 seconds in, then every 20 seconds
  if (settings.finale && frameCount % 1200 === 420) {
    rockets.push(new Rocket(width / 2, "finale"));
  }
}

function pickHue() {
  if (settings.colors) {
    return random(360);
  }
  // Without colors, everything is gold
  return 45;
}

function pickShape() {
  if (settings.shapes) {
    return random(SHAPES);
  }
  return "peony";
}

class Rocket {
  constructor(x, shape) {
    // Just fast enough to climb 50-85% of the screen
    const rise = height * random(0.5, 0.85);
    const speed = sqrt(2 * GRAVITY * rise);
    this.pos = createVector(x, height);
    this.prev = this.pos.copy();
    this.vel = createVector(random(-1, 1), -speed);
    this.shape = shape;
    this.hue = pickHue();
    this.exploded = false;
  }

  update() {
    this.prev = this.pos.copy();
    this.vel.y += GRAVITY;
    this.pos.add(this.vel);
    // At the top it stops rising: boom!
    if (this.vel.y >= 0) {
      this.explode();
    }
  }

  explode() {
    this.exploded = true;
    const x = this.pos.x;
    const y = this.pos.y;
    if (this.shape === "finale") {
      finaleBurst(x, y);
    } else {
      burst(x, y, this.hue, this.shape);
    }
  }

  show() {
    const a = this.prev;
    const b = this.pos;
    strokeWeight(3);
    stroke(40, 30, 100);
    line(a.x, a.y, b.x, b.y);
  }

  done() {
    return this.exploded;
  }
}

class Spark {
  constructor(x, y, vel, hue, life) {
    this.pos = createVector(x, y);
    this.prev = this.pos.copy();
    this.vel = vel;
    this.hue = hue;
    this.life = life;
    this.age = 0;
  }

  update() {
    this.prev = this.pos.copy();
    // Air slows the spark, gravity pulls it down
    this.vel.mult(0.97);
    this.vel.y += GRAVITY * 0.3;
    this.pos.add(this.vel);
    this.age++;
  }

  show() {
    // 1 when the spark is new, 0 when it burns out
    const fuel = 1 - this.age / this.life;
    // Starts white-hot, then shows its color
    const sat = 100 - 70 * fuel;
    let bright = 100;
    const a = this.prev;
    const b = this.pos;

    if (settings.twinkle && fuel < 0.5) {
      // Old sparks flicker like glitter
      bright = random(20, 100);
    }

    if (settings.glow) {
      // A wide, faint line underneath glows
      strokeWeight(9);
      stroke(this.hue, sat, bright, fuel * 0.2);
      line(a.x, a.y, b.x, b.y);
    }

    strokeWeight(2.5);
    stroke(this.hue, sat, bright, fuel);
    line(a.x, a.y, b.x, b.y);
  }

  done() {
    return this.age >= this.life;
  }
}

function burst(x, y, hue, shape) {
  let life = random(50, 90);
  if (shape === "willow") {
    // Willows are gold and hang in the air longer
    hue = 40;
    life = life * 2;
  }

  const count = 180;
  for (let i = 0; i < count; i++) {
    const angle = (TWO_PI * i) / count;
    const vel = burstVelocity(shape, angle);
    sparks.push(new Spark(x, y, vel, hue, life));
  }
}

function burstVelocity(shape, angle) {
  if (shape === "ring") {
    // Same speed in every direction: a circle
    return p5.Vector.fromAngle(angle, 6);
  }
  if (shape === "rangoli") {
    // Speed rises and falls 8 times: 8 petals
    const speed = 6 * abs(cos(4 * angle));
    return p5.Vector.fromAngle(angle, speed);
  }
  if (shape === "willow") {
    return p5.Vector.fromAngle(angle, random(1, 4));
  }
  // A peony: random speeds fill the whole circle
  return p5.Vector.fromAngle(angle, random(1, 7));
}

class TextSpark extends Spark {
  constructor(x, y, target) {
    // Gold and orange, and it lives for 6 seconds
    const hue = random(25, 50);
    const vel = p5.Vector.random2D().mult(random(2, 10));
    super(x, y, vel, hue, 360);
    this.target = target;
  }

  update() {
    if (this.age > 240) {
      // Time's up: fall like a normal spark
      super.update();
      return;
    }
    this.prev = this.pos.copy();
    // First it flies out like any burst...
    this.vel.mult(0.9);
    this.pos.add(this.vel);
    // ...then gets pulled harder and harder to its letter
    const pull = min(this.age / 400, 0.1);
    this.pos.lerp(this.target, pull);
    this.age++;
  }
}

function finaleBurst(x, y) {
  for (const target of textPoints) {
    sparks.push(new TextSpark(x, y, target));
  }
}

function makeTextPoints() {
  // Write the message on a hidden canvas
  const g = createGraphics(width, height);
  g.pixelDensity(1);
  g.background(0);
  g.fill(255);
  g.textStyle(BOLD);
  g.textAlign(CENTER, CENTER);

  if (friend === "") {
    writeLine(g, "Happy Diwali", height * 0.45);
  } else {
    writeLine(g, "Happy Diwali", height * 0.36);
    writeLine(g, friend, height * 0.56);
  }

  // Every white pixel (a few apart) becomes a target
  g.loadPixels();
  const points = [];
  const gap = max(5, floor(width / 160));
  for (let y = 0; y < height; y += gap) {
    for (let x = 0; x < width; x += gap) {
      const i = 4 * (y * width + x);
      if (g.pixels[i] > 128) {
        points.push(createVector(x, y));
      }
    }
  }
  g.remove();
  return points;
}

function writeLine(g, words, y) {
  // As big as fits: 85% of the width at most
  g.textSize(100);
  const fit = (100 * width * 0.85) / g.textWidth(words);
  g.textSize(min(fit, height * 0.18));
  g.text(words, width / 2, y);
}

function getFriendName() {
  const params = new URLSearchParams(location.search);
  const name = params.get("name") || "";
  // Keep it short, so it fits on a phone
  return name.trim().slice(0, 16);
}

function mousePressed(event) {
  // Tap the sky to launch your own rocket
  if (event.target.tagName === "CANVAS") {
    rockets.push(new Rocket(mouseX, pickShape()));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  textPoints = makeTextPoints();
}
