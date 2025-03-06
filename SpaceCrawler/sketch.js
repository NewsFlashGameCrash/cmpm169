
let heroes = ["Jake Cloudjumper", "Glup Shitto", "George Lucas", "The ghost of Luke Skywalker", "That broom kid from Episode VIII"]
let hero = heroes[Math.floor(Math.random() * heroes.length)];
let sidekick;
let empires = ["Syndicate", "Opposition Party", "Group of Generally Unpleasent People", "Better Republic", "Really Confused Person"];
let empire = empires[Math.floor(Math.random() * empires.length)];
let titles = ["Darth", "Lith", "Head Honcho", "Acting Deputy Vice-Undersecretary", "Principal"];
let evil_names = ["Binks", "Attornicus", "Steve", "Stubbed Toenius", "Gene Roddenberry", "Mouse", "Kirk", "Mudder", "Palpatine. Yes, we brought him back again."]
let villain = titles[Math.floor(Math.random() * titles.length)] + " " + evil_names[Math.floor(Math.random() * evil_names.length)];
console.log(villain)
let episodes = ["Invasion of the\n" + empire, hero + " Is Back", "Phatasmal Killer\noh wait that's a D&D Spell nevermind", villain + "\nDoes a generally rude thing", "Blatant Exploitation of Nostalgia", ""]
let superweapons = ["The Sun Squisher", "a really big barrel of TNT", "a strongly worded letter", "the Meteor Masher", "the End Credits", "The Death Star, but this time it's pink"]
let superweapon = superweapons[Math.floor(Math.random() * superweapons.length)];
let episode = episodes[Math.floor(Math.random() * episodes.length)]

let p1_options = ["The villainous " + empire + " has siezed control of the galaxy with their newest weapon, " + superweapon + ", and they will not stop until they rule all of the Republic with an iron fist.", hero + " has left to get milk, and in his absence a new threat has emerged! The " + empire + " has vowed to ensure that another Star Wars movie is never released! The Republic has assembled its best forces to combat this rising threat!"]
let p2_options = ["Confident in his victory, " + villain + " sits in his lair plotting his latest scheme to make " + hero + " clean the entire " + empire + " headquarters.", "In a shocking display of desperation " + villain + " has used " + superweapon + " on his own base! Or, at least, we think it was desperation. It's plausible he was also just really bored."]
let p3_options = ["As " + villain + " schemes in his lair, our heroes race across the galaxy to find the secret to destroying " + superweapon + "....",  "Look, I'll be honest with you, this movie kinda sucks, you shouldn't watch it. I bet if you ask now, you could even get a refund on your ticket...."]
let p1 = p1_options[Math.floor(Math.random() * p1_options.length)]
let p2 = p2_options[Math.floor(Math.random() * p2_options.length)]
let p3 = p3_options[Math.floor(Math.random() * p3_options.length)]

var y, z = 0, crawlFont;
let logoDist = 0;
function preload() {
  crawlFont = loadFont('AlternateGothicEF-NoTwo.ttf');
  logoFont = loadFont('Starjhol.ttf');
  audio = loadSound("Star Wars Theme Kazoo Cover.mp3");
}
var timer = 0;

function setup() {
  audio.play();
  createCanvas(windowWidth, windowWidth / 2.35,  WEBGL);
  perspective(2 * atan(height / 2 / 800), width / height, 0.1 * 800, 10 * 80000)
  y = height / 2
  
}

function draw() {
  background(0);
  textFont(crawlFont);
  if (timer <= 6500) {
  let alphaval = 255;
  if(timer <= 1000) {
    alphaval = (max((timer - 500), 0) / 500) * 255;
  }
  else if(timer >= 3000) {
    alphaval = max(1 - (timer - 3000) / 500, 0)  * 255;
  }
  fill(48, 201, 210, alphaval);
  textSize(width/20);
  let preamble = "A long time ago, in a galaxy far,\nfar away..."
  text(preamble, 0 - textWidth(preamble) / 2, 0)
  }
  else {
    push();
    translate(0, 0, -logoDist)
    logoDist += deltaTime;
    textFont(logoFont);
    textAlign(CENTER, CENTER);
    fill(255, 200, 0);
    textSize(width * 0.45);
    text("\@", 0, 0)
    pop();
    if(timer >= 14500) {
      push();
      textAlign(CENTER, TOP);
      textFont(crawlFont);
      translate(0, y, z);
      rotateX(PI/4);
      textSize(width/12);
      fill(255, 200, 0);
      text("Episode X\n" + episode.toUpperCase(),0,0);
      textSize(width/20);
      var w = width*0.8;
      text("\n\n"+ p1 + "\n\n"+p2+"\n\n"+p3, -w/2,width/4,w,height*20);
      pop();
      y -= height/800;
      z -= height/800;
    }
  }
  timer += deltaTime
}