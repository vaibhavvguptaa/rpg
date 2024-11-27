import React, { useEffect, useRef } from 'react';
import { Game } from 'phaser';
import { io } from 'socket.io-client';
import { gameConfig } from './game/config';
import { MainScene } from './game/scenes/MainScene';

function App() {
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    // Connect to WebSocket server
    const socket = io('http://localhost:3000');

    // Create game instance
    const config = {
      ...gameConfig,
      scene: new MainScene(socket)
    };

    gameRef.current = new Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-white mb-4">Phaser RPG</h1>
      <div id="game-container" className="rounded-lg overflow-hidden shadow-2xl"></div>
    </div>
  );
}

export default App;