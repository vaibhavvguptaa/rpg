import { Scene } from 'phaser';

export class WorldManager {
  private scene: Scene;
  private walls!: Phaser.Physics.Arcade.StaticGroup;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  createWorld() {
    this.walls = this.scene.physics.add.staticGroup();
    
    // Create walls in strategic positions
    const wallPositions = [
      { x: 400, y: 300 },
      { x: 200, y: 400 },
      { x: 500, y: 200 },
      { x: 300, y: 150 },
      { x: 500, y: 450 }
    ];

    wallPositions.forEach(pos => {
      this.walls.create(pos.x, pos.y, 'wall');
    });
  }

  getWalls() {
    return this.walls;
  }
}