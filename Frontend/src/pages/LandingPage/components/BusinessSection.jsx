import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const BENEFITS = [
  'Cadastre serviços e profissionais',
  'Defina horários de funcionamento e intervalos',
  'Veja toda a agenda em um só lugar',
  'Gerencie a fila de espera',
  'Acompanhe o histórico de atendimentos',
];

const DAILY_SCHEDULE = [
  {
    time: '09:00 - Corte de Cabelo',
    client: 'João',
    status: 'Confirmado',
    badgeClass: 'af-badge af-badge--success',
  },
  {
    time: '10:30 - Barba',
    client: 'Pedro',
    status: 'Pendente',
    badgeClass: 'af-badge af-badge--warning',
  },
  {
    time: '14:00 - Disponível',
    client: 'Livre',
    status: 'Livre',
    badgeClass: 'af-badge af-badge--blue',
  },
];

export default function BusinessSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });

  const row0Y = useTransform(scrollYProgress, [0.1, 0.55], [26, 0]);
  const row1Y = useTransform(scrollYProgress, [0.25, 0.75], [34, 0]);
  const row2Y = useTransform(scrollYProgress, [0.4, 0.95], [42, 0]);
  const rowOffsets = [row0Y, row1Y, row2Y];

  return (
    <section id="para-negocios" ref={sectionRef} className="lp-business">
      <div className="af-container lp-business__grid">
        <div>
          <h2 className="lp-business__title">
            Organize a agenda do seu estabelecimento
          </h2>
          <p className="lp-business__subtitle">
            Menos trabalho manual, mais controle sobre os atendimentos
          </p>

          <ul className="lp-business__list">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="lp-business__item">
                <span className="lp-business__check" aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <Link to="/cadastro" className="af-btn lp-btn-on-dark af-btn--lg">
            Cadastrar minha empresa
          </Link>
        </div>

        <div>
          <div className="lp-schedule-card" aria-label="Exemplo da Agenda do Dia">
            <div className="lp-schedule-card__head">
              <h3 className="lp-schedule-card__title">Agenda do Dia</h3>
              <span className="lp-schedule-card__date">Quarta, 15 Jul</span>
            </div>

            <div className="lp-schedule-list">
              {DAILY_SCHEDULE.map((slot, index) => (
                <motion.div
                  key={slot.time}
                  style={{ y: rowOffsets[index] }}
                  className="lp-schedule-row"
                >
                  <div>
                    <p className="lp-schedule-row__time">{slot.time}</p>
                    <p className="lp-schedule-row__client">{slot.client}</p>
                  </div>
                  <span className={slot.badgeClass}>{slot.status}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}