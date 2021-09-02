import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  init() {}

  preload() {
    this.load.atlas("koala", "assets/koala.png", "assets/koala.json");
    this.load.image("tiles", "assets/blocks.png");
    this.load.tilemapTiledJSON("tilemap", "assets/game.json");

    this.koala = undefined;
    this.cursors = undefined;
    this.isTouchingGround = false;
  }

  create() {
    this.createKoalaAnimations();
    this.cursors = this.input.keyboard.createCursorKeys();

    const map = this.make.tilemap({ key: "tilemap" });
    const tileset = map.addTilesetImage("Blocks", "tiles");

    const ground = map.createLayer("Ground", tileset);
    ground.setCollisionByProperty({ collides: true });

    this.matter.world.convertTilemapLayer(ground);

    const objectsLayer = map.getObjectLayer("Objects");

    objectsLayer.objects.forEach((objData) => {
      const { x = 0, y = 0, name, width = 0 } = objData;

      switch (name) {
        case "koala-spawn": {
          this.koala = this.matter.add
            .sprite(x + width * 0.5, y, "koala")
            .play("koala-idle")
            .setFixedRotation();

          this.koala.setOnCollide((data) => {
            this.isTouchingGround = true;
          });

          this.cameras.main.startFollow(this.koala);

          break;
        }
      }
    });
  }
  //
  update() {
    const speed = 10;

    if (this.cursors.left.isDown) {
      this.koala.flipX = true;
      this.koala.setVelocityX(-speed);
      this.koala.anims.play("koala-walk", true);
    } else if (this.cursors.right.isDown) {
      this.koala.flipX = false;
      this.koala.setVelocityX(speed);
      this.koala.anims.play("koala-walk", true);
    } else {
      this.koala.setVelocityX(0);
      this.koala.anims.play("koala-idle");
    }

    // check if the player is jumping
    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);
    if (spaceJustPressed && this.isTouchingGround) {
      this.koala.setVelocityY(-20);
      this.isTouchingGround = false;
    }
  }

  createKoalaAnimations() {
    this.anims.create({
      key: "koala-idle",
      frames: [{ key: "koala", frame: "koala_idle@2x.png" }],
    });

    this.anims.create({
      key: "koala-walk",
      frameRate: 7,
      frames: this.anims.generateFrameNames("koala", {
        start: 1,
        end: 3,
        prefix: "koala_walk0",
        suffix: "@2x.png",
      }),
      repeat: -1,
    });
  }
}
