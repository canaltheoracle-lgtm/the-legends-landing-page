import { motion } from 'framer-motion';

const burgers = [
  {
    id: 1,
    name: "SUPER MARIO BURGER",
    desc: "2 carnes smash, cogumelos salteados, queijo cheddar e molho especial.",
    price: "R$ 32,00",
    power: "+50 HP",
    color: "bg-retro-red"
  },
  {
    id: 2,
    name: "FATALITY CHEESE",
    desc: "Pão brioche, 3 carnes 180g, muito bacon crocante e maionese verde.",
    price: "R$ 45,00",
    power: "MAX ATTACK",
    color: "bg-retro-blue"
  },
  {
    id: 3,
    name: "LINK'S ADVENTURE",
    desc: "Frango crocante, alface, tomate, cebola roxa e molho de ervas.",
    price: "R$ 28,00",
    power: "+30 STAMINA",
    color: "bg-retro-green"
  },
  {
    id: 4,
    name: "SONIC SPEED",
    desc: "Carne bovina, anéis de cebola, barbecue e queijo prato.",
    price: "R$ 35,00",
    power: "+10 SPEED",
    color: "bg-retro-orange"
  }
];

const Menu = () => {
  return (
    <section id="menu" className="py-12 md:py-20 px-4 bg-retro-bg">
      <div className="container mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-5xl mb-4 px-2">INVENTÁRIO DE LANCHES</h2>
          <p className="font-retro text-[9px] md:text-xs text-retro-yellow">SELECIONE SEU POWER-UP</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {burgers.map((burger) => (
            <motion.div
              key={burger.id}
              whileHover={{ scale: 1.05, y: -10 }}
              className="retro-border bg-black p-4 md:p-6 flex flex-col items-center text-center group"
            >
              <div className={`w-24 h-24 md:w-32 md:h-32 mb-4 md:mb-6 ${burger.color} flex items-center justify-center pixelated shadow-[4px_4px_0px_0px_var(--color-retro-yellow)]`}>
                {/* Placeholder for burger image */}
                <span className="font-retro text-xl md:text-2xl text-white">?</span>
              </div>
              <h3 className="text-xs md:text-sm mb-3 md:mb-4 group-hover:text-retro-yellow transition-colors">{burger.name}</h3>
              <p className="text-[9px] md:text-[10px] text-gray-400 font-game mb-4 leading-relaxed line-clamp-3">
                {burger.desc}
              </p>
              <div className="mt-auto w-full">
                <div className="font-retro text-[8px] text-retro-yellow mb-2">{burger.power}</div>
                <div className="font-retro text-sm md:text-lg">{burger.price}</div>
                <a 
                  href={`https://wa.me/5511999998888?text=Olá! Gostaria de pedir o ${burger.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="retro-button mt-4 w-full py-2 text-[8px] block text-center"
                >
                  EQUIPAR
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;
