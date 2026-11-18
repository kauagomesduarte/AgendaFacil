import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';

const STEPS = [
  {
    number: '01',
    title: 'Escolha o serviço',
    description: 'Veja o que o estabelecimento oferece, a duração de cada atendimento e quem atende.',
  },
  {
    number: '02',
    title: 'Escolha o horário',
    description: 'Só aparecem os horários realmente disponíveis, sem precisar ligar ou aguardar resposta.',
  },
  {
    number: '03',
    title: 'Confirme',
    description: 'Pronto: seu agendamento fica salvo e você acompanha o status pelo celular ou computador.',
  },
];

export default function InteractiveShowcaseSection() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Barra de progresso acompanha continuamente a posição da rolagem (0% -> 100%)
  const progressScale = useTransform(scrollYProgress, [0, 1], [0.12, 1]);
  // Movimento sutil do painel sincronizado à rolagem
  const boardY = useTransform(scrollYProgress, [0, 0.5, 1], [14, 0, -14]);

  useEffect(() => {
    const updateStepFromScroll = (value) => {
      const nextStep = value < 0.34 ? 0 : value < 0.68 ? 1 : 2;
      setActiveStep((prev) => (prev !== nextStep ? nextStep : prev));
    };

    const unsubscribe = scrollYProgress.on
      ? scrollYProgress.on('change', updateStepFromScroll)
      : scrollYProgress.onChange(updateStepFromScroll);

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [scrollYProgress]);

  const handleSelectStep = (index) => {
    setActiveStep(index);

    const section = sectionRef.current;
    if (!section || window.innerWidth < 960) return;

    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const scrollableDistance = section.offsetHeight - window.innerHeight;
    if (scrollableDistance <= 0) return;

    const targetRatio = index === 0 ? 0.05 : index === 1 ? 0.5 : 0.9;
    window.scrollTo({
      top: sectionTop + scrollableDistance * targetRatio,
      behavior: 'smooth',
    });
  };

  return (
    <section id="como-funciona" ref={sectionRef} className="lp-story">
      <div className="lp-story__sticky">
        <div className="af-container lp-story__grid">
          {/* Coluna Esquerda: Etapas do Agendamento */}
          <div>
            <header className="lp-story__header">
              <h2 className="lp-story__title">Agendar nunca foi tão simples</h2>
              <p className="lp-story__subtitle">
                Role a página para acompanhar cada etapa da reserva dentro do sistema.
              </p>
            </header>

            <div className="lp-story__steps" role="tablist" aria-label="Etapas do agendamento">
              {STEPS.map((step, index) => {
                const isActive = activeStep === index;
                return (
                  <button
                    key={step.number}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleSelectStep(index)}
                    className={`lp-story-step ${isActive ? 'lp-story-step--active' : ''}`}
                  >
                    <div className="lp-story-step__row">
                      <span className="lp-story-step__index">{step.number}</span>
                      <span className="lp-story-step__title">{step.title}</span>
                    </div>
                    {isActive && <p className="lp-story-step__desc">{step.description}</p>}
                  </button>
                );
              })}
            </div>

            <div className="lp-story__track" aria-hidden="true">
              <motion.div
                className="lp-story__track-fill"
                style={{ scaleX: progressScale }}
              />
            </div>
          </div>

          {/* Coluna Direita: Interface SaaS Sincronizada ao Scroll */}
          <div className="lp-stage">
            <motion.div className="lp-stage-board" style={{ y: boardY }} aria-live="polite">
              <div className="lp-stage-board__bar">
                <div className="lp-stage-board__dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="lp-stage-board__url">agendafacil.app/reserva</span>
              </div>

              <AnimatePresence mode="wait">
                {activeStep === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="lp-stage-panel"
                  >
                    <h3 className="lp-stage-panel__heading">Escolha o serviço</h3>
                    <p className="lp-stage-panel__sub">Selecione o atendimento e o profissional desejado</p>

                    <div className="lp-service-list">
                      <div className="lp-service-item lp-service-item--active">
                        <div>
                          <p className="lp-service-item__title">Corte de Cabelo</p>
                          <p className="lp-service-item__meta">45 min · Prof. Lucas</p>
                        </div>
                        <span className="af-badge af-badge--blue">Selecionado</span>
                      </div>

                      <div className="lp-service-item">
                        <div>
                          <p className="lp-service-item__title">Barba Completa</p>
                          <p className="lp-service-item__meta">30 min · Prof. Lucas</p>
                        </div>
                        <span className="lp-service-item__meta">Disponível</span>
                      </div>

                      <div className="lp-service-item">
                        <div>
                          <p className="lp-service-item__title">Corte + Barba</p>
                          <p className="lp-service-item__meta">60 min · Prof. André</p>
                        </div>
                        <span className="lp-service-item__meta">Disponível</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="lp-stage-panel"
                  >
                    <h3 className="lp-stage-panel__heading">Escolha o horário</h3>
                    <p className="lp-stage-panel__sub">Quarta-feira, 15 de julho · Apenas horários livres</p>

                    <div className="lp-timeslot-grid">
                      <div className="lp-timeslot-box">09:00</div>
                      <div className="lp-timeslot-box lp-timeslot-box--selected">10:00</div>
                      <div className="lp-timeslot-box lp-timeslot-box--busy">11:30</div>
                      <div className="lp-timeslot-box">14:00</div>
                      <div className="lp-timeslot-box">15:30</div>
                      <div className="lp-timeslot-box">17:00</div>
                    </div>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="lp-stage-panel"
                  >
                    <h3 className="lp-stage-panel__heading">Agendamento confirmado</h3>
                    <p className="lp-stage-panel__sub">Salvo na sua agenda e sincronizado com o estabelecimento</p>

                    <div className="lp-confirm-layout">
                      <div className="lp-confirm-summary">
                        <div className="lp-confirm-summary__row">
                          <span>Serviço</span>
                          <strong>Corte de Cabelo</strong>
                        </div>
                        <div className="lp-confirm-summary__row">
                          <span>Data e hora</span>
                          <strong>15 Jul · 10:00</strong>
                        </div>
                        <div className="lp-confirm-summary__row">
                          <span>Status</span>
                          <span className="af-badge af-badge--success">Confirmado</span>
                        </div>
                      </div>

                      <div className="lp-mini-phone" aria-hidden="true">
                        <div className="lp-mini-phone__screen">
                          <div className="lp-mini-phone__notch" />
                          <p className="lp-mini-phone__title">Meus horários</p>
                          <p className="lp-service-item__meta">15 Jul · 10:00</p>
                          <div className="lp-mini-phone__pill">Confirmado</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}