var node_list = [];
const lumin = 150; //Luminescene: How dim the stars get when flasing. Larger number means they get dimmer.
var mouse_tracking = false
var lastNode = 0;
var line_list = [];

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.lumin = random(-lumin, lumin);
    this.flux = random(0.25, 4);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  for(ctr = 0; ctr < 250; ctr++) {
    newNode = new Node(random(0, width), random(0, height / 1.5));
    node_list[ctr] = newNode;
  }
}

function draw() {
  background(0);
  noStroke()
  fill(0, 70, 0)
  rect(0, height / 1.5 + 75, width, height - (height / 1.5 + 75))
  ellipse(width / 2, height / 1.5 + 75, width, 100)
  fill(0)
  for(let ctr = 0; ctr < node_list.length; ctr++) {
    fill(255 - abs(node_list[ctr].lumin));
    circle(node_list[ctr].x, node_list[ctr].y, 5)
    node_list[ctr].lumin -= node_list[ctr].flux;
    if(node_list[ctr].lumin < -lumin) {
      node_list[ctr].lumin = lumin;
    }
  }
  stroke(255)
  for(let ctr = 0; ctr < line_list.length; ctr++) {
    line(line_list[ctr][0].x, line_list[ctr][0].y, line_list[ctr][1].x, line_list[ctr][1].y);
  }
  if (mouse_tracking) {
    line(lastNode.x, lastNode.y, mouseX, mouseY);
  }
}

function mousePressed() { 
  for(let ctr = 0; ctr < node_list.length; ctr++) {
    if(dist(mouseX, mouseY, node_list[ctr].x, node_list[ctr].y) <= 6) {
      mouse_tracking = true;
      lastNode = node_list[ctr];
      return;
    }
  }
}


function mouseReleased() { 
  mouse_tracking = false;
  for(let ctr = 0; ctr < node_list.length; ctr++) {
    if(dist(mouseX, mouseY, node_list[ctr].x, node_list[ctr].y) <= 6) {
      line_list.push([node_list[ctr], lastNode]);
      return;
    }
  }
}