import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const AVAILABLE_DAYS = [8, 10, 14, 15, 16, 21, 22, 24, 28, 29];
const TIME_SLOTS = ['09:00', '10:00', '14:30'];

const JULY_2026_DAYS = Array.from({ length: 35 }, (_, index) => {
  if (index < 3) return { day: 28 + index, muted: true };
  if (index <= 33) {
    const day = index - 2;
    return { day, muted: false, available: AVAILABLE_DAYS.includes(day) };
  }
  return { day: 1, muted: true };
});

export default function HeroSection() {
  const [selectedDay, setSelectedDay] = useState(15);
  const [selectedSlot, setSelectedSlot] = useState('10:00');
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const calendarY = useTransform(scrollYProgress, [0, 1], [0, -24]);

  return (
    <section ref={heroRef} className="lp-hero">
      <div className="lp-hero__grid-bg" aria-hidden="true" />
      <div className="lp-hero__glow" aria-hidden="true" />

      <div className="af-container lp-hero__grid">
        <div className="lp-hero__content">
          <h1 className="lp-hero__title">
            <span className="lp-hero__title-line">Agende seu horário</span>
            <span className="lp-hero__title-accent">sem ligar, sem esperar.</span>
          </h1>

          <p className="lp-hero__subtitle">
            Veja os horários disponíveis, marque em poucos cliques e acompanhe tudo em um só lugar.
          </p>

          <div className="lp-hero__actions">
            <Link to="/login" className="af-btn af-btn--primary af-btn--lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="3" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <span>Agendar Agora</span>
            </Link>

            <Link to="/cadastro" className="af-btn af-btn--secondary af-btn--lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
              </svg>
              <span>Sou Empresa</span>
            </Link>
          </div>
        </div>

        {/* Palco do Calendário Limpo */}
        <div className="lp-hero__visual">
          <motion.div className="lp-calendar-wrapper" style={{ y: calendarY }}>
            <div className="lp-saas-calendar" role="region" aria-label="Demonstração do calendário de agendamento">
              <div className="lp-saas-calendar__topbar">
                <div>
                  <p className="lp-saas-calendar__service">Corte de Cabelo</p>
                  <p className="lp-saas-calendar__duration">Prof. Lucas · 45 min</p>
                </div>
                <span className="lp-saas-calendar__month">Julho 2026</span>
              </div>

              <div className="lp-saas-calendar__body">
                <div className="lp-saas-calendar__weekdays" aria-hidden="true">
                  {WEEKDAYS.map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>

                <div className="lp-saas-calendar__days">
                  {JULY_2026_DAYS.map((item, idx) => {
                    if (item.muted) {
                      return (
                        <span key={`muted-${idx}`} className="lp-saas-day lp-saas-day--muted">
                          {item.day}
                        </span>
                      );
                    }

                    const isSelected = item.day === selectedDay;
                    return (
                      <button
                        key={item.day}
                        type="button"
                        onClick={() => setSelectedDay(item.day)}
                        aria-pressed={isSelected}
                        aria-label={`Dia ${item.day} de julho`}
                        className={`lp-saas-day ${
                          isSelected
                            ? 'lp-saas-day--selected'
                            : item.available
                              ? 'lp-saas-day--available'
                              : ''
                        }`}
                      >
                        {item.day}
                      </button>
                    );
                  })}
                </div>

                <div className="lp-saas-calendar__slots-section">
                  <div className="lp-saas-calendar__slots" role="group" aria-label="Horários disponíveis">
                    {TIME_SLOTS.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedSlot(time)}
                        aria-pressed={selectedSlot === time}
                        className={`lp-saas-slot ${
                          selectedSlot === time ? 'lp-saas-slot--selected' : ''
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lp-saas-calendar__footer" aria-live="polite">
                <p className="lp-saas-calendar__selection-meta">
                  <strong>{selectedDay} de julho</strong> às <strong>{selectedSlot}</strong>
                </p>
                <Link to="/login" className="af-btn af-btn--primary af-btn--sm">
                  Continuar
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}