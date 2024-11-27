import { Scene } from 'phaser';
import { Socket } from 'socket.io-client';
import { PlayerManager } from '../managers/PlayerManager';
import { WorldManager } from '../managers/WorldManager';
import { NetworkManager } from '../managers/NetworkManager';

export class MainScene extends Scene {
  private playerManager!: PlayerManager;
  private worldManager!: WorldManager;
  private networkManager!: NetworkManager;

  constructor(socket: Socket) {
    super({ key: 'MainScene' });
    this.networkManager = new NetworkManager(socket);
  }

  preload() {
    this.load.image('tiles', 'https://labs.phaser.io/assets/tilemaps/tiles/fantasy-tiles.png');
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/mushroom2.png');
    this.load.image('wall', 'https://labs.phaser.io/assets/sprites/block.png');
  }

  create() {
    this.worldManager = new WorldManager(this);
    this.playerManager = new PlayerManager(this, this.networkManager);
  
    this.worldManager.createWorld();
    this.playerManager.createPlayer();
  
    // Setup collisions
    this.physics.add.collider(
      this.playerManager.getPlayer(),
      this.worldManager.getWalls()
    );
  
    this.networkManager.initialize(this.playerManager);
  }
  
  update() {
    this.playerManager.update();
  }
  
}