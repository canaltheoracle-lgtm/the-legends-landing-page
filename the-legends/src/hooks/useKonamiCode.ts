import { useState, useEffect } from 'react';

const useKonamiCode = () => {
  const [isActivated, setIsActivated] = useState(false);
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 
    'ArrowDown', 'ArrowDown', 
    'ArrowLeft', 'ArrowRight', 
    'ArrowLeft', 'ArrowRight', 
    'b', 'a'
  ];
  const [input, setInput] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newInput = [...input, e.key];
      if (newInput.length > konamiCode.length) {
        newInput.shift();
      }
      setInput(newInput);

      if (newInput.join(',') === konamiCode.join(',')) {
        setIsActivated(true);
        // Reset after some time
        setTimeout(() => setIsActivated(false), 5000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input]);

  return isActivated;
};

export default useKonamiCode;
