import { useState } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import logo from '../assets/logo.png';
import { useCart } from '../context/CartContext';
import CheckoutModal from './CheckoutModal';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { itemCount } = useCart();

  const menuItems = [
    { label: "LEVEL 1", href: "#hero" },
    { label: "ITEMS", href: "#menu" },
    { label: "MAP", href: "#location" },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-sm border-b-4 border-retro-yellow p-2 md:p-3">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-12 sm:h-14 md:h-14 pixelated" />
            <div className="font-retro text-white text-[8px] lg:text-[10px] hidden lg:block">THE LEGENDS</div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 font-retro text-[10px] items-center">
            {menuItems.map((item) => (
              <a key={item.label} href={item.href} className="hover:text-retro-yellow transition-colors">
                {item.label}
              </a>
            ))}
            <button
              onClick={() => setCheckoutOpen(true)}
              className="relative hover:text-retro-yellow p-2"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-retro-red text-white text-[10px] font-retro flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setCheckoutOpen(true)}
              className="relative text-retro-yellow p-2"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-retro-red text-white text-[10px] font-retro flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
            <button 
              className="text-retro-yellow p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="fixed inset-0 top-[70px] bg-black/95 z-50 flex flex-col items-center justify-center gap-8 font-retro md:hidden border-t-4 border-retro-yellow">
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
      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  );
};

export default Navbar;
