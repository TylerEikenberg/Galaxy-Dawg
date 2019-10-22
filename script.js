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
let playerShots = []; //to hold players laser shots
let enemies = []; //to hold all the enemies

//preload function preloads all the games assets
function preload() {
  let leftKey;
  let rightKey;
  let spaceKey;
  //player ship
  game.load.image('playerShip', 'assets/spaceship.png');
  //enemy ship
  game.load.image('enemyShip', 'assets/enemy.png');
  //player shot
  game.load.image('shot', 'assets/shot.png');
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

  //set keys to keyboard input
  game.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  game.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  game.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  //set player to playerShip
  //set player to game.add.sprite to enable body physics
  player = game.add.sprite(game.canvas.width / 2, game.canvas.height - 100, 'playerShip');
  game.physics.arcade.enable(player, Phaser.Physics.ARCADE); //set player physics
  player.body.collideWorldBounds = true; //player cannot leave world bounds
  console.log(2);
  player.anchor.set(0.5, 1); //position players anchor point to the middle of sprite
  player.body.immovable = true; //player wont move upon collision
  player.x = game.input.x || game.world.width * 0.5;
  player.body.velocity.x = 200; //set default x velocity to 150 so ship moves on it own

  /**
   * create player laser bullet
   */

  playerShots[0] = game.add.sprite(game.canvas.width / 2, game.canvas.height - 100, 'shot');
  game.physics.arcade.enable(playerShots[0], Phaser.Physics.ARCADE);
  playerShots[0].body.collideWorldBounds = true;
  playerShots[0].anchor.set(player.position.x, player.position.y);

  /**
   * Create enemies
   */
  //create 6 enemies
  //add enemy to game
  //make enemy move side to side
  //give enemy collision
  //make enemy shoot bullet
  //make enemy blow up ONLY WHEN hit by player bullet

  //for loop to create enemies and add them to enemies array
  for (let i = 0; i <= 2; i++) {
    enemy = game.add.sprite(game.canvas.width - 300 * i, game.canvas.height - 600, 'enemyShip');
    game.physics.arcade.enable(enemy, Phaser.Physics.ARCADE);
    enemy.body.collideWorldBounds = true;
    enemy.body.velocity.x = 100;
    enemies[i] = enemy;
    console.log;
  }

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
  if (game.leftKey.isDown) {
    player.body.velocity.x = -200;
    // player.animations.play('left');
  } else if (game.rightKey.isDown) {
    player.body.velocity.x = 200;
    // player.animations.play('right');
    //   } else if (cursors.space.isDown) {
    //     playerShots[0].anchor.set(player.position.x, player.position.y);
    //     // player.animations.stop();
    //   }
  }
}
