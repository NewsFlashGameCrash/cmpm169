function recurse(x, y, size, rotation, iter, origin) {
  const rsin=sin(rotation)
  const rcos=cos(rotation)
  const rthree = sqrt(3)
  triangle(x + size * -rsin, y + size * rcos, x + size * (-rthree/2 * rcos + 0.5 * rsin), y + size * (-0.5 * rcos - rthree/2 * rsin), x + size * (rthree/2 * rcos + 0.5 * rsin), y + size * (-0.5 * rcos + rthree/2 * rsin))
  if((min(origin + 100, 400)) > (iter * 100)) {
    const flakescale = min((origin/(iter*100)), 1)
    const flakecenter = size * (1/2 + 1/6 * flakescale)
    if(iter == 1) {
      recurse(x + flakecenter * rsin, y + flakecenter * -rcos, 2/6 * size * flakescale, rotation + 180, iter + 1, origin)
    }
    recurse(x + flakecenter * (-rthree/2 * rcos - 0.5 * rsin), y + flakecenter * (0.5 * rcos - rthree/2 * rsin), 2/6 * size * flakescale, rotation + 60, iter + 1, origin)
    recurse(x + flakecenter * (rthree/2 * rcos - 0.5 * rsin), y + flakecenter * (0.5 * rcos + rthree/2 * rsin), 2/6 * size * flakescale, rotation + 300, iter + 1, origin)
    recurse(x + 2/3 * size * -rsin, y + 2/3 * size * rcos, 1/3 * size, rotation, iter + 1, origin)
    recurse(x + 2/3 * size * (-rthree/2 * rcos + 0.5 * rsin), y + 2/3 * size * (-0.5 * rcos - rthree/2 * rsin), 1/3 * size, rotation + 120, iter + 1, origin)
    recurse(x + 2/3 * size * (rthree/2 * rcos + 0.5 * rsin), y + 2/3 * size * (-0.5 * rcos + rthree/2 * rsin), 1/3 * size, rotation + 240, iter + 1, origin)
  }
}

class Snowflake {
  constructor() {
    this.x = random(width)
    this.y = random(-20, -100)
    this.size = random(10, 20)
    this.speed = random(1, 5)
    this.rspeed = random(-10, 10)
    this.rotation = random(0, 360)
  }
  
  move() {
    this.y += this.speed
    this.rotation = (this.rotation + this.rspeed) % 360
    this.rspeed = min(max(this.rspeed + random(-0.3, 0.3), -10), 10)
    if(this.y > 420) {
      this.x = random(width)
      this.y = random(-20, -100)
      this.size = random(10, 20)
      this.speed = random(1, 5)
      this.rspeed = random(0.1, 10)
      this.rotation = random(0, 360)
    }
  }
  
  display() {
    if(this.y > -20) {
      recurse(this.x, this.y, this.size, this.rotation, 1, this.y)
    }
  }
}
var flakes = [];
function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES)
  for(let i = 0; i < 50; i++) {
    snowflake = new Snowflake()
    flakes[i] = snowflake;
  }
  noStroke()
}

function draw() {
  background(220);
  for(let ctr = 0; ctr < 50; ctr ++) {
    flakes[ctr].move()
    flakes[ctr].display()
  }
}

