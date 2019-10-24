/**
 * Galaxy Dawg, a Space Invader inspired top-down space shooter
 */

//create game
const game = new Phaser.Game(400, 730, Phaser.AUTO, 'game-wrapper', {
  preload: preload,
  create: create,
  update: update,
});

let player;
let healthPickup;
let background;
let laser; //to hold players laser shots
let lasers;
let laserTime = 0;
let enemies; //to hold all the enemies
let enemiesRight;
let enemiesDiagonal;
let score = 0;
const scoreText = document.querySelector('.score');
let health = 100;

/******************
 *
 * preload function preloads all the games assets
 * */
function preload() {
  let mouseClick;
  let leftKey;
  let rightKey;
  game.load.image('background', 'assets/spacebg.gif');
  //player ship
  game.load.image('playerShip', 'assets/spaceship.png');
  //enemy ship
  game.load.image('enemyShip', 'assets/enemy.png');
  game.load.image('enemyShip2', 'assets/enemy.png');
  //player shot
  game.load.image('laser', 'assets/shot.png');
  //health pickup
  game.load.image('healthPickup', 'assets/health.png');
  //explosion
  game.load.spritesheet('explosion', 'assets/explosion3.png', 32, 32);
}

/*****************************************
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *  function create holds all the game logic
 * */

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE); //add physics engine
  //   game.input.mouse.capture = true; ADD CLICK FUNCTIONALITY LATER *********

  background = game.add.tileSprite(0, 0, 1000, 600, 'background');
  background.scale.x = 1;
  background.scale.y = 2;
  //set keys to keyboard input
  //   game.mouseClick = game.input.pointer1;
  game.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  game.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  //   game.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  //set player to playerShip
  //set player to game.add.sprite to enable body physics
  player = game.add.sprite(game.canvas.width / 2, game.canvas.height - 100, 'playerShip');
  game.physics.arcade.enable(player, Phaser.Physics.ARCADE); //set player physics
  player.body.collideWorldBounds = true; //player cannot leave world bounds
  player.anchor.set(0.5, 1); //position player's anchor point to the middle of sprite
  player.body.immovable = true; //player wont move upon collision
  player.x = game.input.x || game.world.width * 0.5; //player starts in middle of screen
  player.body.velocity.x = 200; //set default x velocity to 200

  /**
   * create player laser bullet
   */

  lasers = game.add.group(); //create group of lasers
  lasers.enableBody = true;
  game.physics.arcade.enable(lasers, Phaser.Physics.ARCADE);
  lasers.createMultiple(100, 'laser'); //add 100 laser bullets to group
  lasers.setAll('anchor.x', 0.5);
  lasers.setAll('anchor.y', 0.5);
  lasers.setAll('scale.x', 0.5);
  lasers.setAll('scale.y', 0.5);
  lasers.setAll('outOfBoundsKill', true);
  lasers.setAll('checkWorldBounds', true);

  /**
   * Create enemies
   */

  //make enemy shoot bullet
  //create enemy class to define several features ****
  // enemy movement and make enemy fire at random intervals

  enemies = game.add.group();
  enemies.enableBody = true;
  game.physics.arcade.enable(enemies, Phaser.Physics.ARCADE);
  enemies.createMultiple(5, 'enemyShip');
  enemies.setAll('anchor.x', 0.5);
  enemies.setAll('anchor.y', 0.5);
  //   enemies.setAll('scale.x', 0.5);
  //   enemies.setAll('scale.y', 0.5);
  enemies.setAll('outOfBoundsKill', true);
  enemies.setAll('checkWorldBounds', true);
  enemies.setAll('angle', 180);
  //   game.time.events.add(100, deployEnemyShips);
  deployEnemyShipsLeft();
  //   game.time.events.loop(3000, function() {
  //     deployEnemyShipsLeft();
  //   });

  //   enemiesRight = game.add.group();
  //   enemiesRight.enableBody = true;
  //   game.physics.arcade.enable(enemiesRight, Phaser.Physics.ARCADE);
  //   enemiesRight.createMultiple(5, 'enemyShip2');
  //   enemiesRight.setAll('anchor.x', 0.5);
  //   enemiesRight.setAll('anchor.y', 0.5);
  //   //   enemies.setAll('scale.x', 0.5);
  //   //   enemies.setAll('scale.y', 0.5);
  //   enemiesRight.setAll('outOfBoundsKill', true);
  //   enemiesRight.setAll('checkWorldBounds', true);
  //   enemiesRight.setAll('angle', 180);
  //   game.time.events.add(3000, function() {
  //     game.time.events.loop(5000, function() {
  //       deployEnemyShipsRight();
  //     });
  //   });

  setInterval(function() {
    healthAppear();
  }, 5000);
}

/*****************************************
 *
 *
 *
 *
 *
 *
 *
 *
 *  update function holds code on updating game objects
 * */
function update() {
  /**
   * COME BACK TO THIS LATER
   * CHANGE INPUT TO MOUSE CLICK ONLY
   */
  //   if (game.mouseClick.isDown) {
  //     console.log('click');
  //     player.body.velocity.x = -player.body.velocity.x * 1;
  //     if (player.body.velocity > 0) {
  //       player.body.velocity.x = -200;
  //     } else if (player.body.velocity < 0) {
  //       player.body.velocity.x = 200;
  //     }
  //   }

  if (game.leftKey.isDown) {
    player.body.velocity.x = -200;
    fireLaser();
  } else if (game.rightKey.isDown) {
    player.body.velocity.x = 200;
    fireLaser();
  }

  //add collision detection for enemyShips and bullets
  game.physics.arcade.collide(lasers, enemies, destroyEnemy);
  game.physics.arcade.collide(lasers, enemiesRight, destroyEnemy);
  //add collision detection for enemyShips and playerShip
  game.physics.arcade.collide(enemies, player, takeDamage);
  game.physics.arcade.collide(enemiesRight, player, takeDamage);
  if (health === 0) {
    killPlayer();
  }
  game.physics.arcade.collide(healthPickup, player, increaseHealth);

  background.tilePosition.y += 1;
  let j = 0;
  //update captain dialogue for score % 1500 = 0;
  if (score % 1000 === 0 && score !== 0 && j != 1) {
    const captainText = document.querySelector('.character-text');
    captainText.innerHTML = newPhrase();
  }
}

/*********************
 * function fireLaser
 * first if statement checks if previous laser fired time has elapsed enough
 * laser is set to first laser in lasers group
 * second if condition sets position of laser to player body
 * velocity is set to shoot out laser
 * set laserTime to current time + 200 so player cannot shoot laser rapidly
 */
function fireLaser() {
  if (game.time.now > laserTime) {
    laser = lasers.getFirstExists(false);
    if (laser) {
      laser.reset(player.x + 5, player.y - 80);
      laser.body.velocity.y = -400;

      laserTime = game.time.now + 200;
    }
  }
}

/**
 *
 * Function deployEnemies adds enemies to the game space
 */
let enemyXSpawn = 100;
function deployEnemyShipsLeft() {
  //   const MIN_ENEMY_SPACING = 300;
  //   const MAX_ENEMY_SPACING = 500;
  const ENEMY_SPEED = 300;
  let enemy = enemies.getFirstExists(false);
  if (enemy) {
    enemy.reset(enemyXSpawn, 0);
    enemy.body.velocity.x = 0;
    enemy.body.velocity.y = ENEMY_SPEED;
    enemy.body.drag.x = 100;
    // enemy.update = function() {
    //   enemy.angle = 180 - game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y));
    // };

    game.time.events.add(300, deployEnemyShipsLeft);
    game.time.events.add(5000, function() {
      enemyXSpawn = 300;
      deployEnemyShipsLeft();
    });
  }
}

// function deployEnemyShipsRight() {
//   const ENEMY_SPEED = 300;
//   let enemy2 = enemiesRight.getFirstExists(false);
//   if (enemy2) {
//     enemy2.reset(300, 0);
//     enemy2.body.velocity.x = 0;
//     enemy2.body.velocity.y = ENEMY_SPEED;
//     enemy2.body.drag.x = 300;
//     // enemy.update = function() {
//     //   enemy.angle = 180 - game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y));
//     // };
//     //randomly adds new enemy ships
//     game.time.events.add(300, deployEnemyShipsRight);
//   }
// }

/******************
 *
 * function destroyEnemy kills the laser and enemy upon
 * collision between the two
 */
function destroyEnemy(enemy, laser) {
  enemy.kill();
  laser.kill();
  increaseScore();
  let explosion = game.add.sprite(enemy.x - 10, enemy.y - 10, 'explosion');
  explosion.scale.set(2);
  explosion.animations.add('boom');
  explosion.play('boom', 15, false, true);
}

//Function increaseScore increass the players score by 50
function increaseScore() {
  score += 50;
  scoreText.innerHTML = `Score: ${score}`;
}

//Function takeDamage reduces the players health on collision with enemy
const healthText = document.querySelector('#health');
function takeDamage(player, enemy) {
  const dogImage = document.querySelector('.player-image');
  dogImage.classList.add('saturate');
  setInterval(function() {
    dogImage.classList.remove('saturate');
  }, 100);
  setInterval(function() {
    dogImage.classList.add('saturate');
  }, 200);
  setInterval(function() {
    dogImage.classList.remove('saturate');
  }, 100);

  console.log(dogImage);
  enemy.kill();
  health -= 50;
  healthText.innerHTML = `Health: ${health}`;
}

const gameOver = document.querySelector('.gameover');
//Function killPlayer removes the player from the game
function killPlayer() {
  player.kill();
  if (laser) {
    laser.kill();
  }

  gameOver.style.display = 'initial';
}

//function new phrase returns a random phrase
function newPhrase() {
  const phrases = ['GOOD SHOOTING, PUP!', 'MORE ENEMIES INCOMING!', 'WHOA! KEEP IT UP!', 'THATS A GOOD BOY!'];

  var returnPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  return returnPhrase;
}

function healthAppear() {
  healthPickup = game.add.sprite(200, 80, 'healthPickup');
  healthPickup.enableBody = true;
  game.physics.arcade.enable(healthPickup, Phaser.Physics.ARCADE);
  healthPickup.anchor.set(0.5, 1);
  healthPickup.body.immovable = false;
  healthPickup.body.velocity.x = 20;
  healthPickup.body.velocity.y = 200;
  healthPickup.game.outOfBoundsKill = false;
}

function increaseHealth(healthPickup) {
  healthPickup.kill();
  health += 100;
  healthText.innerHTML = `Health: ${health}`;
  healthText.classList.add('glowText');
  setInterval(function() {
    healthText.classList.remove('glowText');
  }, 800);
}
