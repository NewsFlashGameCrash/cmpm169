var dimensions
var node_array = []
const node_diameter = 10
const splashiness = 3
const timer_value = 0
var pressing = false
var lastNode = null
var timer = timer_value

class Node {
  constructor(x, y) {
    this.index = createVector(x, y);
    this.pos = createVector(node_diameter * (x + 0.5), node_diameter * (y + 0.5))
    this.velocity = createVector(0, 0)
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  dimensions = createVector(width / node_diameter, height / node_diameter)
  for(let i = 0; i < width / node_diameter; i++) {
    var node_row = []
    for(let j = 0; j < height / node_diameter; j++) {
      newNode = new Node(i, j);
      node_row[j] = newNode
    }
    node_array[i] = node_row
  }
  drop(floor(random(0, 1) * dimensions.x), floor(random(0, 1) * dimensions.y))
  
}

function draw() {
  background(220);
  fill('#6A89C7')
  if (timer <= 0) {
      drop(floor(random(0, 1) * dimensions.x), floor(random(0, 1) * dimensions.y))
    timer = timer_value
  }
  else {
    timer--
  }
  if (pressing) {
    nearestNode = node_array[round((mouseX / node_diameter) - 0.5)][round((mouseY / node_diameter) - 0.5)]
    if (nearestNode != lastNode) {
      drop(nearestNode.index.x, nearestNode.index.y)
      lastNode = nearestNode
    }
  }
  for (let i = 0; i < node_array.length; i++) {
    for (let j = 0; j < node_array[i].length; j++) {
      currNode = node_array[i][j]
      tether(currNode)
      currNode.pos.add(currNode.velocity);
      circle(currNode.pos.x, currNode.pos.y, 4/5 * node_diameter)
    }
  }
}

function tether(source) {
  source.velocity.add(createVector(0.1 * (node_diameter * (source.index.x + 0.5) - source.pos.x), 0.1 * (node_diameter * (source.index.y + 0.5) - source.pos.y)))
  source.velocity.mult(0.9)
  return;
}
function drop(x, y) {
  try {
    if(x < 0 || x >= node_array.length || y < 0 || y >= node_array[x].length) throw "Out of Bounds";
  }
  catch(err) {
    print("Input is " + err, x, y)
    return;
  }
  for(let i = -1; i <= 1; i++) {
    for(let j = -1; j <= 1; j++) {
      if(x + i >= 0 && y + j >= 0 && x + i < dimensions.x && y + j < dimensions.y) {
        currNode = node_array[x + i][y + j]
        currNode.velocity = createVector(splashiness * i, splashiness * j)
        ripple(currNode)
      }
    }
  }
  return;
}

function ripple(source) {
  try {
    if(!source) throw "Source doesn't exist"
  }
  catch {
    print("Input is " + err, x, y)
    return;
  }
  for(let i = -1; i <= 1; i++) {
    for(let j = -1; j <= 1; j++) {
      if(source.index.x + i >= 0 && source.index.y + j >= 0 && source.index.x + i < dimensions.x && source.index.y + j < dimensions.y) {
        currNode = node_array[source.index.x + i][source.index.y + j];
        if(currNode != source) {
          if((currNode.pos.x - source.pos.x) * source.velocity.x >= 0 && (currNode.pos.y - source.pos.y) * source.velocity.y >= 0 && ((currNode.pos.x - source.pos.x) * source.velocity.x > 0 || (currNode.pos.y - source.pos.y) * source.velocity.y > 0)) {
            currNode.velocity = createVector(source.velocity.x * 0.5, source.velocity.y * 0.6)
            if(abs(currNode.velocity.mag()) >= 0.05) {
              ripple(currNode)
            }
          }
        }
      }
    }
  }
  return;
}

function mousePressed() {
  pressing = true
}

function mouseReleased() {
  pressing = false
}