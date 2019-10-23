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
let laser; //to hold players laser shots
let lasers;
let laserTime = 0;
let enemies; //to hold all the enemies
let score = 0;
const scoreText = document.querySelector('.score');

/******************
 *
 * preload function preloads all the games assets
 * */
function preload() {
  let mouseClick;
  let leftKey;
  let rightKey;
  let spaceKey;
  //player ship
  game.load.image('playerShip', 'assets/spaceship.png');
  //enemy ship
  game.load.image('enemyShip', 'assets/enemy.png');
  //player shot
  game.load.image('laser', 'assets/shot.png');
  console.log(1);
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

  //set keys to keyboard input
  //   game.mouseClick = game.input.pointer1;
  game.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  game.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  game.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  //set player to playerShip
  //set player to game.add.sprite to enable body physics
  player = game.add.sprite(game.canvas.width / 2, game.canvas.height - 100, 'playerShip');
  game.physics.arcade.enable(player, Phaser.Physics.ARCADE); //set player physics
  player.body.collideWorldBounds = true; //player cannot leave world bounds
  console.log(2);
  player.anchor.set(0.5, 1); //position player's anchor point to the middle of sprite
  player.body.immovable = true; //player wont move upon collision
  player.x = game.input.x || game.world.width * 0.5;
  player.body.velocity.x = 200; //set default x velocity to 200 so ship moves on it own

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
  //create 6 enemies
  //add enemy to game
  //make enemy move side to side
  //give enemy collision
  //make enemy shoot bullet
  //make enemy blow up ONLY WHEN hit by player bullet
  //create enemy class to define several features ****
  // enemy movement and make enemy fire at random intervals

  enemies = game.add.group();
  enemies.enableBody = true;
  game.physics.arcade.enable(enemies, Phaser.Physics.ARCADE);
  enemies.createMultiple(3, 'enemyShip');
  enemies.setAll('anchor.x', 0.5);
  enemies.setAll('anchor.y', 0.5);
  //   enemies.setAll('scale.x', 0.5);
  //   enemies.setAll('scale.y', 0.5);
  enemies.setAll('outOfBoundsKill', true);
  enemies.setAll('checkWorldBounds', true);

  deployEnemyShips();

  //   enemy = game.add.sprite(game.canvas.width / 2, game.canvas.height - 600, 'enemyShip');
  //   game.physics.arcade.enable(enemy, Phaser.Physics.ARCADE);
  //   enemy.body.collideWorldBounds = true;
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
    // if (checkOverlap(lasers, enemy[0])) {
    //   enemy[0].kill;
    // }
    // player.animations.play('left');
  } else if (game.rightKey.isDown) {
    player.body.velocity.x = 200;
    fireLaser();
    // if (checkOverlap(lasers, enemy[0])) {
    //   enemy[0].kill;
    // }
    // player.animations.play('right');
  }

  //add collision detection for ships and bullets
  game.physics.arcade.collide(lasers, enemies, destroyEnemy);
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
function deployEnemyShips() {
  const MIN_ENEMY_SPACING = 300;
  const MAX_ENEMY_SPACING = 1000;
  const ENEMY_SPEED = 300;

  let enemy = enemies.getFirstExists(false);
  if (enemy) {
    enemy.reset(game.rnd.integerInRange(0, game.width), -20);
    enemy.body.velocity.x = game.rnd.integerInRange(-300, 300);
    enemy.body.velocity.y = ENEMY_SPEED;
    enemy.body.drag.x = 100;
    enemy.body;
  }

  game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), deployEnemyShips);
}

/******************
 *
 * function destroyEnemy kills the laser and enemy upon
 * collision between the two
 */
function destroyEnemy(enemy, laser) {
  enemy.kill();
  laser.kill();
  increaseScore();
}

function increaseScore() {
  score += 50;
  scoreText.innerHTML = `Score: ${score}`;
}
