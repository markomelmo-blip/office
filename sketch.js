let bg;
let foodImg;
let mainImg;
let characterImgs = [];

let gameStarted = false;

let mainCharacter;
let characters = [];
let foods = [];

const BASE_SPEED = 1.2; // пришвидшено на 0.2x
const RADIUS = 220;
const FOOD_HP = 10;

function preload() {
  bg = loadImage('background.png');
  foodImg = loadImage('food.png');

  mainImg = loadImage('main.png');

  characterImgs.push(loadImage('character_1.png'));
  characterImgs.push(loadImage('character_2.png'));
  characterImgs.push(loadImage('character_3.png'));
  characterImgs.push(loadImage('character_4.png'));
}

function setup() {
  createCanvas(800, 800);
  imageMode(CENTER);

  mainCharacter = {
    x: width / 2,
    y: height / 2,
    size: 90,
    hp: 100,
    jumpOffset: 0,
    jumpDir: 1
  };

  setupCharacters();
  setupFood();
}

function setupCharacters() {
  characters = [];

  for (let i = 0; i < characterImgs.length; i++) {
    let angle = TWO_PI / characterImgs.length * i - HALF_PI;

    let x = width / 2 + cos(angle) * RADIUS;
    let y = height / 2 + sin(angle) * RADIUS;

    // ручні корекції позицій
    if (i === 1) { // character_2.png
      x += 30;
      y -= 20;
    }

    if (i === 2) { // character_3.png
      x -= 10;
    }

    characters.push({
      x,
      y,
      img: characterImgs[i],
      size: 80
    });
  }
}

function setupFood() {
  foods = [];

  for (let i = 0; i < 5; i++) {
    foods.push(spawnFood());
  }
}

function spawnFood() {
  return {
    x: random(width),
    y: random(height),
    vx: random([-1, 1]) * BASE_SPEED,
    vy: random([-1, 1]) * BASE_SPEED,
    size: 50,
    active: true
  };
}

function draw() {
  imageMode(CORNER);
image(bg, 0, 0);
imageMode(CENTER);

  if (!gameStarted) {
    idleJump();
    drawMain();
    drawCharacters();
    return;
  }

  drawMain();
  drawCharacters();
  updateFood();
  drawFood();
}

function idleJump() {
  mainCharacter.jumpOffset += mainCharacter.jumpDir * 0.6;
  if (abs(mainCharacter.jumpOffset) > 8) {
    mainCharacter.jumpDir *= -1;
  }
}

function drawMain() {
  drawProportionalImage(
    mainImg,
    mainCharacter.x,
    mainCharacter.y + mainCharacter.jumpOffset,
    mainCharacter.size
  );
}

function drawCharacters() {
  for (let c of characters) {
    drawProportionalImage(c.img, c.x, c.y, c.size);
  }
}

function drawFood() {
  for (let f of foods) {
    if (!f.active) continue;

    drawProportionalImage(foodImg, f.x, f.y, f.size);
  }
}

function updateFood() {
  for (let f of foods) {
    if (!f.active) continue;

    f.x += f.vx;
    f.y += f.vy;

    if (f.x < 0 || f.x > width) f.vx *= -1;
    if (f.y < 0 || f.y > height) f.vy *= -1;

    let d = dist(f.x, f.y, mainCharacter.x, mainCharacter.y);
    if (d < (f.size + mainCharacter.size) / 2) {
      f.active = false;
      mainCharacter.hp += FOOD_HP;

      setTimeout(() => {
        foods.push(spawnFood());
      }, 600);
    }
  }
}

function mousePressed() {
  if (!gameStarted) {
    let d = dist(mouseX, mouseY, mainCharacter.x, mainCharacter.y);
    if (d < mainCharacter.size / 2) {
      gameStarted = true;
      mainCharacter.jumpOffset = 0;
    }
  }
}

function drawProportionalImage(img, x, y, targetSize) {
  let ratio = img.width / img.height;
  let w, h;

  if (ratio > 1) {
    w = targetSize;
    h = targetSize / ratio;
  } else {
    h = targetSize;
    w = targetSize * ratio;
  }

  image(img, x, y, w, h);
}
