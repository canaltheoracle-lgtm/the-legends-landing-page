import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import PressStart from './components/PressStart';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Reviews from './components/Reviews';
import Location from './components/Location';
import useKonamiCode from './hooks/useKonamiCode';
import { CartProvider } from './context/CartContext';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const konamiActivated = useKonamiCode();

  const handleStart = () => {
    setGameStarted(true);
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-retro-bg selection:bg-retro-yellow selection:text-black">
        <AnimatePresence>
          {!gameStarted && (
            <PressStart onStart={handleStart} key="press-start" />
          )}
        </AnimatePresence>

        {gameStarted && (
          <div className={`crt-effect min-h-screen ${konamiActivated ? 'animate-pulse bg-retro-red' : ''}`}>
            <div className="scanline" />
            {konamiActivated && (
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-60 font-retro text-xl sm:text-2xl md:text-4xl text-white text-center bg-black p-6 md:p-10 border-4 border-retro-yellow shadow-[4px_4px_0px_0px_var(--color-retro-red)] md:shadow-[8px_8px_0px_0px_var(--color-retro-red)] w-[90%] max-w-lg">
                30 LIVES ADDED!<br/>
                (AND 30% OFF)
              </div>
            )}
            <Navbar />
            <main>
              <Hero />
              <Menu />
              <Reviews />
              <Location />
            </main>
            
            <footer className="py-10 border-t-4 border-retro-yellow bg-black text-center">
              <div className="font-retro text-[10px] text-gray-500">
                GAME OVER? NO, JUST HUNGRY. <br />
                <span className="text-retro-yellow">THE LEGENDS HAMBURGUERIA © 2026</span>
              </div>
            </footer>
          </div>
        )}
      </div>
    </CartProvider>
  );
}

export default App;
