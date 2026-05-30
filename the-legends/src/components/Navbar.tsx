import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "LEVEL 1", href: "#hero" },
    { label: "ITEMS", href: "#menu" },
    { label: "MAP", href: "#location" },
    { label: "SAVE GAME", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-sm border-b-4 border-retro-yellow p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-12 sm:h-16 md:h-24 pixelated" />
          <div className="font-retro text-white text-[8px] lg:text-[10px] hidden lg:block">THE LEGENDS</div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 font-retro text-[10px]">
          {menuItems.map((item) => (
            <a key={item.label} href={item.href} className="hover:text-retro-yellow transition-colors">
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-retro-yellow p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-[70px] bg-black/95 z-50 flex flex-col items-center justify-center gap-8 font-retro md:hidden crt-effect">
          <div className="scanline" />
          {menuItems.map((item) => (
            <a 
              key={item.label} 
              href={item.href} 
              className="text-lg hover:text-retro-yellow transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
