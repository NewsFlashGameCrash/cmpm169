function setup() {
  createCanvas(400, 400);
}
var sizectr = 0;
function supersquare(colorcode, size, up) {
  rotate((sizectr/100) % 360)
  fill(colorcode)
  square(-(size % 1000)/2, -(size % 1000)/2, (size % 1000))
  if(colorcode == 255) {
    up = 0;
  }
  else if(colorcode == 0) {
    up = 1;
  }
  if(size > 10) {
    if(up == 1) {
      supersquare((colorcode + 1) % 256, size - 10, 1)
    }
    else {
      supersquare((colorcode - 1) % 256, size - 10, 0)
    }
  }
}
function draw() {
  translate(200, 200)
  background(220);
  supersquare(0, sizectr, 1)
  sizectr += 1;
  if(sizectr > 10000) {
    sizectr -= 2560;
  }
}