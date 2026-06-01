import { Star } from 'lucide-react';

const reviews = [
  { id: 1, user: "LUIZ_HERO", score: 9999, comment: "Fantástico o atendimento e sabor dos lanches! Os melhores burgers da cidade!" },
  { id: 2, user: "JULIA_GAMER", score: 9500, comment: "Excelente! Os lanches são muito bons, atendimento ótimo e lugar aconchegante!" },
  { id: 3, user: "PEDRO_CHEF", score: 9000, comment: "Recomendo! Lanches deliciosos, funcionários super atenciosos, vale a pena!" },
];

const Reviews = () => {
  return (
    <section id="reviews" className="py-12 md:py-20 px-4 bg-retro-bg border-y-4 border-retro-yellow">
      <div className="container mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-5xl mb-4">HALL OF FAME</h2>
          <p className="font-retro text-[10px] md:text-xs text-retro-yellow">TOP PLAYERS REVIEWS</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          {reviews.map((review, index) => (
            <div key={review.id} className="retro-border bg-black p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-zinc-950 transition-colors text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <span className="font-retro text-retro-yellow text-xs md:text-base">{index + 1}ST</span>
                <div>
                  <div className="font-retro text-xs md:text-sm mb-1">{review.user}</div>
                  <div className="text-[9px] md:text-[10px] text-gray-500 font-game italic">"{review.comment}"</div>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-end">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-retro-yellow text-retro-yellow" />
                  ))}
                </div>
                <div className="font-retro text-retro-orange text-[8px] md:text-xs">SCORE: {review.score}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
