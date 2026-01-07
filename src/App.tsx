import { useState } from 'react';
import { Game } from './components/Game';
import { OnlineGame } from './components/multiplayer';

type GameMode = 'menu' | 'solo' | 'multiplayer';

function App() {
  const [mode, setMode] = useState<GameMode>('menu');

  if (mode === 'multiplayer') {
    return <OnlineGame onBack={() => setMode('menu')} />;
  }

  // Solo game or menu (Game component handles its own start screen)
  return <Game onMultiplayer={() => setMode('multiplayer')} />;
}

export default App;
