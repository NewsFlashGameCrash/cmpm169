const starting_nodes = 20
let node_list = []
let spring_list = []
let invisible_spring_list = []
let lastNode = null
let mouse_tracking = false

class Node {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.velocity = createVector(0, 0)
    this.timer = 999999999
    this.status = 0
  }
}

class Spring {
  constructor(source, target, length) {
    this.source = source
    this.target = target
    this.length = length
  }
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  for(let ctr = 0; ctr < starting_nodes; ctr++) {
    newNode = new Node(random(0 + width / 10, width * 0.9), random(0 + height / 10, height * 0.9));
    node_list[ctr] = newNode;
  }
  for(let ctr = 0; ctr < starting_nodes; ctr++) {
    let num_springs = floor(random() * 5) + 1
    for(let iter = 0; iter < num_springs; iter++) {
      connector = floor(random() * (starting_nodes - 1))
      if(connector >= ctr) {
        connector++
      }
      print(connector)
      newSpring = new Spring(node_list[ctr], node_list[connector], floor(random() * 150) + 75)
    }
    spring_list.push(newSpring)
  }
  for(let ctr = 0; ctr < 10; ctr++) {
    for(let iter = ctr + 1; iter < 10; iter++) {
      newSpring = new Spring(node_list[ctr], node_list[iter], 200)
      invisible_spring_list.push(newSpring)
    }
  }
  node_list[0].timer = 150
}

function tether(spring) {
    spring_line = createVector(spring.target.x - spring.source.x, spring.target.y - spring.source.y)
  magnitude = spring_line.mag()
    spring_line.normalize()
    spring_line.mult(magnitude/2 - spring.length / 2)
  source_targ = createVector(spring.source.x + spring_line.x, spring.source.y + spring_line.y)
    spring.source.velocity.add(createVector(0.1 * (source_targ.x - spring.source.x), 0.1 * (source_targ.y - spring.source.y)))
  spring.source.velocity.mult(0.9)
    targ_targ = createVector(spring.target.x - spring_line.x, spring.target.y - spring_line.y)
    spring.target.velocity.add(createVector(0.1 * (targ_targ.x - spring.target.x), 0.1 * (targ_targ.y - spring.target.y)))
  spring.target.velocity.mult(0.9)
  return;
}

function draw() {
  fill(0)
  textAlign(CENTER, CENTER)
  textSize(40)
  background(220);
  for(let ctr = 0; ctr < spring_list.length; ctr++) {
      tether(spring_list[ctr])
  }
  for(let ctr = 0; ctr < invisible_spring_list.length; ctr++) {
    var distance = dist(invisible_spring_list[ctr].target.x, invisible_spring_list[ctr].target.y, invisible_spring_list[ctr].source.x, invisible_spring_list[ctr].target.y)
    if(distance <= invisible_spring_list[ctr].length || distance > 10 * invisible_spring_list[ctr].length) {
    tether(invisible_spring_list[ctr])
    }
  }
  let newSpring = new Spring(new Node(width / 2, height / 2), node_list[0], 0)
  tether(newSpring)
  var sickness = false
  for (let ctr = 0; ctr < node_list.length; ctr++) {
    node_list[ctr].x += node_list[ctr].velocity.x;
    node_list[ctr].y += node_list[ctr].velocity.y;
    if(node_list[ctr].status <= 2 && node_list[ctr].timer != 999999999) {
      sickness = true
    }
    if(node_list[ctr].status == 2) {
      text('🤮', node_list[ctr].x, node_list[ctr].y)
    }
    else {
      text('😀', node_list[ctr].x, node_list[ctr].y)
    }
    if(node_list[ctr].timer != 999999999) {
      node_list[ctr].timer--
    }
    if(node_list[ctr].timer <= 0) {
      statusUpdate(node_list[ctr])
    }
  }
  if(sickness < 1) {
    index = floor(random() * node_list.length)
    node_list[index].timer = 150
    node_list[index].status = 0
  }
  for(let ctr = 0; ctr < spring_list.length; ctr++) {
    line(spring_list[ctr].source.x, spring_list[ctr].source.y, spring_list[ctr].target.x, spring_list[ctr].target.y)
  }
  if (mouse_tracking) {
    line(lastNode.x, lastNode.y, mouseX, mouseY);
  }
}

function mousePressed() { 
  for(let ctr = 0; ctr < node_list.length; ctr++) {
    if(dist(mouseX, mouseY, node_list[ctr].x, node_list[ctr].y) <= 20) {
      mouse_tracking = true;
      lastNode = node_list[ctr];
      return;
    }
  }
}

function mouseReleased() { 
  mouse_tracking = false;
  for(let ctr = 0; ctr < node_list.length; ctr++) {
    if(dist(mouseX, mouseY, node_list[ctr].x, node_list[ctr].y) <= 20) {
      newSpring = new Spring(lastNode, node_list[ctr])
      spring_list.push(newSpring);
      return;
    }
  }
}

function keyPressed() {
  if (key = '+') {
    if(mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
      newNode = new Node(mouseX, mouseY);
      for(ctr = 0; ctr < node_list.length; ctr++) {
        newSpring = new Spring(node_list[ctr], newNode, 100)
        invisible_spring_list.push(newSpring)

      }
      node_list.push(newNode);
    }
  } 
}

function statusUpdate(node) {
  node.status++
  switch (node.status) {
    case 1:
      node.timer = 100
      for(ctr = 0; ctr < spring_list.length; ctr++) {
        currSpring = spring_list[ctr]
        if(currSpring.target == node || currSpring.source == node) {
          if(random() < 0.8) {
            if(currSpring.target == node & currSpring.source.timer == 999999999) {
              currSpring.source.timer = 150
            }
            else if(currSpring.target.timer == 999999999) {
              currSpring.target.timer = 150
            }
          }
        }
      }
      break;
    case 2:
      node.timer = 300
      break;
    case 3:
      node.timer = 1000
      break;
    case 4:
      node.status = 0
      node.timer = 999999999
      break;
  }
}