// colision
function getTop(obj) {
  return obj.y;
}
function getBottom(obj) {
  return obj.y + obj.height;
}
function getRight(obj) {
  return obj.x + obj.width;
}
function getLeft(obj) {
  return obj.x;
}

function collision(objA, objB) {
  return (
    getBottom(objA) >= getTop(objB) &&
    getTop(objA) <= getBottom(objB) &&
    getRight(objA) >= getLeft(objB) &&
    getLeft(objA) <= getRight(objB)
  );
}

function shipCollision() {
  var hasCollided = false;
  enemyArray.forEach(function(enemy) {
    if (collision(player, enemy)) {
      hasCollided = true;
    }
  });

  return hasCollided;
}

function explode() {
  c.clearRect(0, 0, this.enemy_width, this.enemy_width);
}

function handleCollisions() {
  playerBullets.forEach(function(bullet) {
    enemyArray.forEach(function(enemy) {
      if (collision(bullet, enemy)) {
        console.log("hit");
        //enemy.explode();
        bullet.active = false;
      }
    });
  });
}

var canvas = document.getElementById("canvas"),
  c = canvas.getContext("2d");
var innerWidth = 800,
  innerHeight = 620;
canvas.width = innerWidth;
canvas.height = innerHeight;

var score = 0;
lastTime = 0;

// Keys event
var map = {
  37: false, // left arrow
  39: false, // right arrow
  38: false, // top arrow
  40: false, // bottom arrow
  32: false // space key
};

addEventListener("keydown", function(event) {
  if (event.keyCode in map) {
    map[event.keyCode] = true;

    if (map[37]) {
      player.x += -10;
    } else if (map[39]) {
      player.x += 10;
    } else if (map[38]) {
      player.y += -10;
    } else if (map[40]) {
      player.y += 10;
    } else if (map[32]) {
      player.shoot(); //bullet
    }
  }
  if (shipCollision()) {
    return;
  }
});

addEventListener("keyup", function(event) {
  if (event.keyCode in map) {
    map[event.keyCode] = false;
  }
});

// Hero
var player = {},
  player_width = 50,
  player_height = 50,
  player_img = new Image();
player_img.src = "images/hero2.png";

// Create hero
player = {
  width: player_width,
  height: player_height,
  x: innerWidth / 2 - player_width / 2,
  y: innerHeight - (player_height + 10),
  power: 10,
  draw: function() {
    if (this.x <= 0) {
      this.x = 0;
    } else if (this.x >= innerWidth - this.width) {
      this.x = innerWidth - this.width;
    }

    if (this.y <= 0) {
      this.y = 0;
    } else if (this.y >= innerHeight - this.height) {
      this.y = innerHeight - this.height;
    }

    c.drawImage(player_img, this.x, this.y, this.width, this.height);
  }
};

// projectiles
var playerBullets = [];

function Bullet(I) {
  I.active = true;
  I.xVelocity = 0;
  I.yVelocity = -I.speed; //
  I.width = 3;
  I.height = 3;
  I.color = "#FFF";

  I.inBounds = function() {
    return I.x >= 0 && I.x <= canvas.width && I.y >= 0 && I.y <= canvas.height;
  };

  I.draw = function() {
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.width, this.height);
  };

  I.update = function() {
    I.x += I.xVelocity;
    I.y += I.yVelocity;

    I.active = I.active && I.inBounds();
  };
  I.explode = function() {
    this.active = false;
  };

  return I;
}

player.shoot = function() {
  console.log("shoot");
  var bulletPosition = this.midpoint();

  playerBullets.push(
    Bullet({
      speed: 5,
      x: bulletPosition.x,
      y: bulletPosition.y
    })
  );
};

player.midpoint = function() {
  return {
    x: this.x + this.width / 2,
    y: this.y + this.height / 2
  };
};

function update() {}

function draw() {}

// Vilain
var enemyArray = [],
  enemyIndex = 0,
  enemy_width = 30,
  enemy_height = 30,
  enemy_timer = 1000,
  enemy_img = new Image();
enemy_img.src = "images/enemy.png";

// Create vilain obejct
function enemy(x, y, dx, dy, enemy_img, enemy_width, enemy_height, rotation) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.img = enemy_img;
  this.width = enemy_width;
  this.height = enemy_height;
  this.rotation = rotation;
  enemyIndex++;
  enemyArray[enemyIndex] = this;
  this.id = enemyIndex;

  if (this.rotation < 0.2) {
    this.dx = -this.dx;
  } else if (this.rotation > 0.7) {
    this.dx = -this.dx;
  } else {
    this.dx = 0;
    this.dy = this.dy;
  }

  this.update = function() {
    this.y += this.dy;
    this.x += this.dx;

    if (this.x + this.width >= innerWidth) {
      this.dx = -this.dx;
    } else if (this.x <= 0) {
      this.dx = Math.abs(this.dx);
    }

    if (this.y > innerHeight + this.height) {
      this.delete();
    }

    this.draw();
  };

  this.delete = function() {
    delete enemyArray[this.id];
  };

  this.draw = function() {
    c.drawImage(this.img, this.x, this.y, this.width, this.height);
  };
}

// vilain function
function create_enemy() {
  var x = Math.random() * (innerWidth - enemy_width);
  var y = -enemy_height;
  var dx = 3;
  var dy = 3;
  var rotation = Math.random();

  new enemy(x, y, dx, dy, enemy_img, enemy_width, enemy_height, rotation);
}

// Animation
function animate(currentTime) {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  if (shipCollision()) {
    return;
  }

  // score
  function drawScore() {
    hasCollided = false;

    c.font = "18px arial";
    c.fillStyle = "#fff";
    c.fillText("SCORE: " + score++, 10, 22);
  }

  // Hero power
  c.font = "18px arial";
  c.fillStyle = "#fff";
  c.fillText("POWER: " + player.power, innerWidth - 108, 22);

  // display hjero
  player.draw();

  //  New vilain - 1s
  if (currentTime >= lastTime + enemy_timer) {
    lastTime = currentTime;
    create_enemy();
  }

  // upadte vilain psoition
  enemyArray.forEach(function(enemy) {
    enemy.update();
    //enemy.explode();
  });

  //projectiles - update
  playerBullets.forEach(function(bullet) {
    bullet.update();
  });

  playerBullets = playerBullets.filter(function(bullet) {
    return bullet.active;
  });

  //projectiles - draw
  playerBullets.forEach(function(bullet) {
    bullet.draw();
  });

  //enemy.explode();

  handleCollisions();

  drawScore();
}
animate();
