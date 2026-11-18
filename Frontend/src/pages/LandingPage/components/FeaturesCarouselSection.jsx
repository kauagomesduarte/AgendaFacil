import { useRef, useState } from 'react';

const FEATURES = [
  {
    id: 'sem-conflito',
    title: 'Sem conflito de horário',
    description: 'Se aparece na tela, está livre. A disponibilidade é atualizada automaticamente a cada reserva.',
    theme: 'royal',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 'horarios-a-vista',
    title: 'Horários sempre à vista',
    description: 'Consulte a disponibilidade quando quiser, com visualização clara por dia e profissional.',
    theme: 'sky',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="3" />
        <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01" />
      </svg>
    ),
  },
  {
    id: 'historico-organizado',
    title: 'Histórico organizado',
    description: 'Veja seus agendamentos passados e futuros reunidos em uma linha do tempo fácil de consultar.',
    theme: 'lavender',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M8 13h8M8 17h5" />
      </svg>
    ),
  },
  {
    id: 'fila-de-espera',
    title: 'Fila de espera',
    description: 'O estabelecimento te avisa se surgir vaga no período que você precisa, sem você precisar ficar ligando.',
    theme: 'indigo',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
];

export default function FeaturesCarouselSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);

  const selectSlide = (index) => {
    const normalized = (index + FEATURES.length) % FEATURES.length;
    setActiveIndex(normalized);

    const track = trackRef.current;
    const targetCard = track?.children?.[normalized];
    if (track && targetCard) {
      track.scrollTo({
        left: targetCard.offsetLeft - track.offsetLeft,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="recursos" className="lp-features">
      <div className="af-container">
        <header className="af-section-header">
          <h2 className="af-section-title">Tudo que você precisa, sem complicação</h2>
          <p className="af-section-subtitle">
            Recursos pensados para tornar o agendamento claro tanto para quem agenda quanto para quem atende.
          </p>
        </header>

        {/* Toolbar visível apenas em mobile/tablet (< 1024px) */}
        <div className="lp-features__toolbar">
          <div className="lp-features__indicators" role="tablist" aria-label="Selecionar funcionalidade">
            {FEATURES.map((feature, index) => (
              <button
                key={feature.id}
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                aria-label={`Ver ${feature.title}`}
                onClick={() => selectSlide(index)}
                className={`lp-features__dot ${activeIndex === index ? 'lp-features__dot--active' : ''}`}
              />
            ))}
          </div>

          <div className="lp-features__arrows">
            <button
              type="button"
              onClick={() => selectSlide(activeIndex - 1)}
              className="lp-carousel-arrow"
              aria-label="Funcionalidade anterior"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => selectSlide(activeIndex + 1)}
              className="lp-carousel-arrow"
              aria-label="Próxima funcionalidade"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          role="region"
          aria-label="Carrossel de funcionalidades do AgendaFácil"
          className="lp-features__track"
        >
          {FEATURES.map((feature, index) => {
            const isActive = activeIndex === index;
            return (
              <article
                key={feature.id}
                onClick={() => selectSlide(index)}
                className={`lp-feature-card lp-feature-card--${feature.theme} ${
                  isActive ? 'lp-feature-card--active' : 'lp-feature-card--inactive'
                }`}
              >
                <div className="lp-feature-card__icon" aria-hidden="true">
                  {feature.icon}
                </div>
                <h3 className="lp-feature-card__title">{feature.title}</h3>
                <p className="lp-feature-card__desc">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}