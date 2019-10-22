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

//preload function preloads all the games assets
function preload() {
  game.load.image('playerShip', 'assets/spaceship.png');
  console.log(1);
  // game.load.spritesheet('woof', 'images/woof.png', 32, 32);
}

//function create holds all the game logic
function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE); //add physics engine
  //set player to playerShip
  //set player to game.add.sprite to enable body physics
  player = game.add.sprite(game.canvas.width / 2, game.canvas.height - 100, 'playerShip');
  game.physics.arcade.enable(player, Phaser.Physics.ARCADE); //set player physics
  player.body.collideWorldBounds = true; //player cannot leave world bounds
  console.log(2);
  player.anchor.set(0.5, 1); //position players anchor point to the middle of sprite
  player.body.immovable = true; //player wont move upon collision
  player.x = game.input.x || game.world.width * 0.5;

  cursors = game.input.keyboard.createCursorKeys();
}

function update() {
  player.body.velocity.x = 0;

  if (cursors.left.isDown) {
    player.body.velocity.x = -200;
    player.animations.play('left');
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 200;
    player.animations.play('right');
  } else {
    player.animations.stop();
  }
  if (cursors.up.isDown && player.body.touching.down) {
    player.body.velocity.y = -400;
  }
}
