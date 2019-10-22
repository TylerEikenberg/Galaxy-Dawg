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
  game.physics.startSystem(Phaser.Physics.ARCADE);
  //set player to playerShip
  player = game.add.image(game.canvas.width / 2, game.canvas.height - 100, 'playerShip');
  game.physics.arcade.enable(player, Phaser.Physics.ARCADE);
  console.log(2);
}

function update() {}
