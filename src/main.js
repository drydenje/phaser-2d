import Phaser from "phaser";

// import GameScene from "./scenes/GameScene";
import KoalaScene from "./scenes/KoalaScene";

const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 600,
  physics: {
    default: "matter",
    arcade: {
      debug: true,
    },
  },
  scene: [KoalaScene],
};

export default new Phaser.Game(config);
