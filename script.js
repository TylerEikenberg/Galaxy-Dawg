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
preload = () => {
  game.load.image('playerShip', 'assets/spaceship.png');
  // game.load.spritesheet('woof', 'images/woof.png', 32, 32);
};

//function create holds all the game logic
create = () => {};
