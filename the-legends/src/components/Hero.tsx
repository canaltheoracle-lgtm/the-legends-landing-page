import { motion } from 'framer-motion';
import { Sword, Shield, Zap } from 'lucide-react';
import logo from '../assets/logo.png';

const Hero = () => {
  return (
    <section id="hero" className="min-h-screen pt-24 flex flex-col items-center justify-center relative px-4 overflow-hidden">
      <div className="absolute top-32 left-10 md:left-20 animate-float opacity-50">
        <Zap className="text-retro-yellow w-12 h-12" />
      </div>
      <div className="absolute bottom-32 right-10 md:right-20 animate-float opacity-50" style={{ animationDelay: '1s' }}>
        <Shield className="text-retro-blue w-12 h-12" />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center z-10 flex flex-col items-center"
      >
        <img 
          src={logo} 
          alt="The Legends Logo" 
          className="w-64 sm:w-80 md:w-[550px] mb-8 pixelated drop-shadow-[0_0_20px_rgba(255,184,0,0.3)]"
        />
        <div className="mb-6 inline-block bg-retro-red px-4 py-1 font-retro text-[10px] animate-pulse border-2 border-retro-yellow">
          BOSS LEVEL: O GRANDE BURGER
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-7xl mb-8 leading-tight">
          ENFRENTE A SUA <br />
          <span className="text-retro-yellow">FOME ÉPICA</span>
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a 
            href="#menu" 
            className="retro-button text-sm sm:text-lg px-8 sm:px-10 py-3 sm:py-4 group flex items-center gap-4"
          >
            <Sword className="w-4 h-4 sm:w-5 group-hover:rotate-45 transition-transform" />
            PEDIR AGORA
          </a>
          <span className="font-retro text-[10px] sm:text-sm text-gray-400">
            OU EXPLORE O MAPA
          </span>
        </div>
      </motion.div>

      <div className="mt-16 sm:mt-20 w-full max-w-4xl retro-border bg-gray-900 p-2 relative">
        <div className="h-2 sm:h-4 bg-gray-800 w-full mb-2 flex">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '85%' }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-retro-green shadow-[0_0_10px_rgba(0,255,0,0.5)]"
          />
        </div>
        <div className="flex justify-between font-retro text-[6px] sm:text-[8px] text-gray-400">
          <span>HP DO CLIENTE</span>
          <span>85%</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
