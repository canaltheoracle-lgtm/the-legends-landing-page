import { MapPin, Clock, Phone } from 'lucide-react';

const Location = () => {
  return (
    <section id="location" className="py-12 md:py-20 px-4 bg-black relative overflow-hidden">
      <div id="contact" className="absolute -top-24" /> {/* Anchor for contact */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        {/* Decorative grid */}
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-5xl mb-4">MAPA DO MUNDO</h2>
          <p className="font-retro text-[10px] md:text-xs text-retro-yellow">ENCONTRE NOSSO CASTELO</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="retro-border bg-gray-900 aspect-video relative flex items-center justify-center overflow-hidden">
            {/* Mock Map */}
            <div className="absolute inset-0 bg-red-900/10" />
            <div className="text-center p-4">
              <MapPin className="w-8 h-8 md:w-12 md:h-12 text-retro-yellow mx-auto mb-2 md:mb-4 animate-bounce" />
              <div className="font-retro text-[8px] md:text-[10px]">THE LEGENDS HQ</div>
            </div>
            {/* Scanlines on map */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_4px,4px_100%]" />
          </div>

          <div className="space-y-6 md:space-y-8">
            <div className="flex items-start gap-4 md:gap-6 group">
              <div className="p-2 md:p-3 bg-retro-red text-white retro-border group-hover:bg-retro-yellow group-hover:text-black transition-colors shrink-0">
                <MapPin className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm md:text-lg mb-1 md:mb-2 wrap-break-word">COORDENADAS</h3>
                <p className="text-[10px] md:text-sm text-gray-400 font-game leading-relaxed">Rua dos Gamers, 123 - Bairro Retrô<br />Cidade das Lendas - SP</p>
              </div>
            </div>

            <div className="flex items-start gap-4 md:gap-6 group">
              <div className="p-2 md:p-3 bg-retro-red text-white retro-border group-hover:bg-retro-yellow group-hover:text-black transition-colors shrink-0">
                <Clock className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm md:text-lg mb-1 md:mb-2 wrap-break-word">HORÁRIO DE JOGO</h3>
                <p className="text-[10px] md:text-sm text-gray-400 font-game leading-relaxed">Terça a Domingo: 18:00 - 00:00<br />Sexta e Sábado: 18:00 - 02:00</p>
              </div>
            </div>

            <div className="flex items-start gap-4 md:gap-6 group">
              <div className="p-2 md:p-3 bg-retro-red text-white retro-border group-hover:bg-retro-yellow group-hover:text-black transition-colors shrink-0">
                <Phone className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm md:text-lg mb-1 md:mb-2 wrap-break-word">SUPORTE TÉCNICO</h3>
                <p className="text-[10px] md:text-sm text-gray-400 font-game leading-relaxed">(11) 99999-8888<br />@thelegendshamburgueria</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
