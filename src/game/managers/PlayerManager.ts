import { Scene } from 'phaser';
import { NetworkManager } from './NetworkManager';

export class PlayerManager {
  private scene: Scene;
  private player!: Phaser.Physics.Arcade.Sprite;
  private otherPlayers: Map<string, Phaser.Physics.Arcade.Sprite>;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private networkManager: NetworkManager;

  constructor(scene: Scene, networkManager: NetworkManager) {
    this.scene = scene;
    this.networkManager = networkManager;
    this.otherPlayers = new Map();
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  createPlayer() {
    const spawnPoint = this.getRandomSpawnPoint();
    this.player = this.scene.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
    this.player.setScale(0.5); // Reduced size
    this.player.setCollideWorldBounds(true);
  }

  getPlayer() {
    return this.player;
  }

  addOtherPlayer(playerId: string, position: { x: number; y: number }) {
    const otherPlayer = this.scene.physics.add.sprite(position.x, position.y, 'player');
    otherPlayer.setTint(0xff0000);
    otherPlayer.setScale(0.5); // Adjusted size for consistency
    this.otherPlayers.set(playerId, otherPlayer);
  }

  moveOtherPlayer(playerId: string, position: { x: number; y: number }) {
    const otherPlayer = this.otherPlayers.get(playerId);
    if (otherPlayer) {
      otherPlayer.setPosition(position.x, position.y);
    }
  }

  removeOtherPlayer(playerId: string) {
    const otherPlayer = this.otherPlayers.get(playerId);
    if (otherPlayer) {
      otherPlayer.destroy();
      this.otherPlayers.delete(playerId);
    }
  }

  private getRandomSpawnPoint() {
    const spawnPoints = [
      { x: 100, y: 100 },
      { x: 700, y: 100 },
      { x: 100, y: 500 },
      { x: 700, y: 500 }
    ];
    return spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
  }

  update() {
    if (!this.player) return;

    let velocityChanged = false;

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      velocityChanged = true;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      velocityChanged = true;
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
      velocityChanged = true;
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
      velocityChanged = true;
    } else {
      this.player.setVelocityY(0);
    }

    if (velocityChanged) {
      this.networkManager.emitPlayerMovement({ x: this.player.x, y: this.player.y });
    }
  }
}
