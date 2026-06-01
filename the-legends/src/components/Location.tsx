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
          <div className="retro-border bg-gray-900 aspect-video relative overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3717.284287201127!2d-50.4454047!3d-21.2060973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x949645643aefb6f1:0x6e9af7c55d936650!2sThe%20Legends%20Hamburgueria!5e0!3m2!1spt-BR!2sbr!4v1716854400000!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="The Legends Hamburgueria - Mapa"
            />
          </div>

          <div className="space-y-6 md:space-y-8">
            <div className="flex items-start gap-4 md:gap-6 group">
              <div className="p-2 md:p-3 bg-retro-red text-white retro-border group-hover:bg-retro-yellow group-hover:text-black transition-colors shrink-0">
                <MapPin className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm md:text-lg mb-1 md:mb-2 wrap-break-word">COORDENADAS</h3>
                <p className="text-[10px] md:text-sm text-gray-400 font-game leading-relaxed">Rua Marcílios Dias, 10<br />Araçatuba - SP</p>
              </div>
            </div>

            <div className="flex items-start gap-4 md:gap-6 group">
              <div className="p-2 md:p-3 bg-retro-red text-white retro-border group-hover:bg-retro-yellow group-hover:text-black transition-colors shrink-0">
                <Clock className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm md:text-lg mb-1 md:mb-2 wrap-break-word">HORÁRIO DE JOGO</h3>
                <p className="text-[10px] md:text-sm text-gray-400 font-game leading-relaxed">DOM: 19:00 às 23:00<br />SEG: 19:00 às 23:00<br />TER: 19:00 às 23:00<br />QUI: 19:00 às 23:00<br />SEX: 19:00 às 23:00<br />SÁB: 19:00 às 23:00</p>
              </div>
            </div>

            <div className="flex items-start gap-4 md:gap-6 group">
              <div className="p-2 md:p-3 bg-retro-red text-white retro-border group-hover:bg-retro-yellow group-hover:text-black transition-colors shrink-0">
                <Phone className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm md:text-lg mb-1 md:mb-2 wrap-break-word">SUPORTE TÉCNICO</h3>
                <p className="text-[10px] md:text-sm text-gray-400 font-game leading-relaxed">(18) 99705-1415<br />@thelegendshamburgueria</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
