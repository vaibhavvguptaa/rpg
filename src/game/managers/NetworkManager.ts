import { Socket } from 'socket.io-client';
import { PlayerManager } from './PlayerManager';

export class NetworkManager {
  private socket: Socket;
  private playerManager?: PlayerManager;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  initialize(playerManager: PlayerManager) {
    if (!playerManager) {
      console.error('PlayerManager is required to initialize NetworkManager');
      return;
    }

    this.playerManager = playerManager;
    this.setupSocketListeners();
    this.emitJoinGame();
  }

  private setupSocketListeners() {
    if (!this.playerManager) return;

    this.socket.on('playerJoined', (playerId: string, position: { x: number; y: number }) => {
      this.playerManager?.addOtherPlayer(playerId, position);
    });

    this.socket.on('playerMoved', (playerId: string, position: { x: number; y: number }) => {
      this.playerManager?.moveOtherPlayer(playerId, position);
    });

    this.socket.on('playerLeft', (playerId: string) => {
      this.playerManager?.removeOtherPlayer(playerId);
    });

    this.socket.on('currentPlayers', (players: { [key: string]: { x: number; y: number } }) => {
      Object.entries(players).forEach(([playerId, position]) => {
        if (playerId !== this.socket.id) {
          this.playerManager?.addOtherPlayer(playerId, position);
        }
      });
    });

    this.socket.on('reconnect', () => {
      this.emitJoinGame();
    });
  }

  emitJoinGame() {
    const player = this.playerManager?.getPlayer();
    if (player) {
      this.socket.emit('joinGame', { x: player.x, y: player.y });
    } else {
      console.error('Player not found when emitting joinGame');
    }
  }

  emitPlayerMovement(position: { x: number; y: number }) {
    this.socket.emit('playerMovement', position);
  }
}
