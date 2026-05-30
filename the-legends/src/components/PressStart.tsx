import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

interface PressStartProps {
  onStart: () => void;
}

const PressStart = ({ onStart }: PressStartProps) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.5 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black crt-effect p-8 py-12 md:py-20"
      onClick={onStart}
    >
      <div className="scanline" />
      
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center mb-8 flex flex-col items-center w-full max-w-[90vw] md:max-w-[70vw] lg:max-w-[800px]"
        >
          <img 
            src={logo} 
            alt="The Legends Logo" 
            className="w-[85%] sm:w-full h-auto max-h-[40vh] md:max-h-[50vh] object-contain mb-4 pixelated drop-shadow-[0_0_50px_rgba(255,184,0,0.6)]"
          />
          <h2 className="text-[min(5vw,24px)] sm:text-3xl md:text-5xl lg:text-6xl text-retro-yellow font-retro tracking-tight">
            HAMBURGUERIA
          </h2>
        </motion.div>

        <motion.div
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="cursor-pointer text-center"
        >
          <p className="font-retro text-sm md:text-2xl text-white">
            PRESS START TO EAT
          </p>
        </motion.div>
      </div>

      <div className="mt-8 text-gray-500 font-retro text-[8px] md:text-[10px] text-center px-4">
        © 2026 THE LEGENDS CORP - LEVEL 1
      </div>
    </motion.div>
  );
};

export default PressStart;
