import { motion } from 'framer-motion';

const STEPS = [
  {
    number: 'PASSO 01',
    title: 'Escolha o serviço',
    description: 'Veja o catálogo do estabelecimento, duração do atendimento e quem vai atender.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
  },
  {
    number: 'PASSO 02',
    title: 'Selecione o horário',
    description: 'Visualize apenas os horários realmente livres na agenda, sem precisar trocar mensagens.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    number: 'PASSO 03',
    title: 'Confirme e acompanhe',
    description: 'Seu horário fica reservado na hora e você acompanha o status pelo histórico.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="m9 11 3 3L22 4" />
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="lp-steps">
      <div className="af-container af-container--narrow">
        <header className="af-section-header">
          <span className="af-eyebrow">Como funciona</span>
          <h2 className="af-section-title">Agendar nunca foi tão simples</h2>
          <p className="af-section-subtitle">
            Três passos diretos para sair da busca e garantir seu horário marcado.
          </p>
        </header>

        <div className="lp-steps__grid">
          {STEPS.map((step, index) => (
            <motion.article
              key={step.number}
              className="lp-step-card"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <div className="lp-step-card__top">
                <div className="lp-step-card__icon" aria-hidden="true">
                  {step.icon}
                </div>
                <span className="lp-step-card__num">{step.number}</span>
              </div>
              <h3 className="lp-step-card__title">{step.title}</h3>
              <p className="lp-step-card__desc">{step.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}