import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const featuresTrackRef = useRef(null);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const scrollFeatures = (direction) => {
    const track = featuresTrackRef.current;
    if (!track) return;

    const firstCard = track.querySelector('[data-feature-card]');
    const cardWidth = firstCard?.getBoundingClientRect().width || track.clientWidth;
    track.scrollBy({ left: direction * (cardWidth + 20), behavior: 'smooth' });
  };

  const primaryButtonClass = 'inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 font-bold text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.42)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_12px_24px_-8px_rgba(37,99,235,0.48)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200';
  const secondaryButtonClass = 'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-800 shadow-[0_4px_14px_-8px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-slate-50 hover:shadow-[0_8px_18px_-8px_rgba(15,23,42,0.24)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100';

  const julyCalendarDays = Array.from({ length: 35 }, (_, index) => {
    // Julho de 2026 começa na quarta-feira e ocupa cinco linhas no calendário.
    if (index < 3) return { day: 28 + index, muted: true };
    if (index <= 33) return { day: index - 2, muted: false };
    return { day: 1, muted: true };
  });

  // Variantes de animação para reaproveitar
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-800 flex flex-col overflow-x-hidden">
      {/* HEADER */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-20 px-6 md:px-12 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100"
      >
        <h1 className="font-black text-2xl tracking-tight text-slate-900">
          <Link to="/">AgendaFácil</Link>
        </h1>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">Sou Cliente</Link>
          <Link to="/cadastro" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">Sou Empresa</Link>
        </nav>

        {/* Botão do menu mobile */}
        <button
          type="button"
          className="md:hidden relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-[6px] rounded-xl transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-6 rounded-full bg-slate-900"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0, scaleX: 0.5 } : { opacity: 1, scaleX: 1 }}
            className="block h-0.5 w-6 rounded-full bg-slate-900"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-6 rounded-full bg-slate-900"
          />
        </button>
      </motion.header>

      {/* Drawer mobile: painel lateral com fundo sobreposto */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Fechar menu"
              onClick={closeMenu}
              className="fixed inset-0 z-[60] cursor-default bg-slate-950/35 backdrop-blur-[2px] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            />

            <motion.aside
              id="mobile-navigation"
              className="fixed right-0 top-0 z-[61] flex h-[100dvh] w-[min(88vw,380px)] flex-col bg-white px-7 pb-8 pt-7 shadow-2xl md:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              aria-label="Navegação principal"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <Link to="/" onClick={closeMenu} className="text-2xl font-black tracking-tight text-slate-900">
                  AgendaFácil
                </Link>
                <button
                  type="button"
                  onClick={closeMenu}
                  aria-label="Fechar menu"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="flex flex-col gap-2 pt-8" aria-label="Links do menu">
                <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }}>
                  <Link onClick={closeMenu} to="/login" className="block rounded-xl px-4 py-4 text-base font-bold text-slate-800 transition-colors hover:bg-blue-50 hover:text-[#2563EB]">
                    Sou Cliente
                  </Link>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.14 }}>
                  <Link onClick={closeMenu} to="/cadastro" className="block rounded-xl px-4 py-4 text-base font-bold text-slate-800 transition-colors hover:bg-blue-50 hover:text-[#2563EB]">
                    Sou Empresa
                  </Link>
                </motion.div>
              </nav>

              <div className="mt-auto rounded-2xl bg-[#EBF5FF] p-5">
                <p className="text-sm font-bold text-slate-900">Seu próximo horário começa aqui.</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">Encontre um horário disponível ou organize os atendimentos do seu negócio.</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      
      <main className="flex-1 flex flex-col">
        
        {/* HERO SECTION */}
        <section className="bg-white py-16 md:py-24 px-6 md:px-12 overflow-hidden">
          <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-16 relative">
            
            {/* Textos e Botões */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="z-10 flex-1 text-center lg:flex-[0.9] lg:text-left"
            >
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-[54px] font-black text-[#2D2D2D] leading-[1.1] tracking-tight">
                Agende seu horário <br className="hidden md:block" />
                <span className="text-[#2563EB]">sem ligar, sem esperar.</span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="mt-6 text-slate-600 text-base md:text-lg max-w-lg mx-auto lg:mx-0 font-medium">
                Veja os horários disponíveis, marque em poucos cliques e acompanhe tudo em um só lugar.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link to="/login" className={`${primaryButtonClass} w-full sm:w-auto`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Agendar Agora
                </Link>
                <Link to="/cadastro" className={`${secondaryButtonClass} w-full sm:w-auto group`}>
                  <svg className="w-5 h-5 text-slate-600 group-hover:text-[#2563EB] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  Sou Empresa
                </Link>
              </motion.div>
            </motion.div>

            {/* Ilustração do calendário */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.75, ease: "easeOut", delay: 0.15 }}
              className="relative isolate flex w-full flex-1 justify-center px-2 py-10 sm:px-4 lg:min-w-[500px] lg:flex-[1.1]"
            >
              {/* Fundo decorativo independente do cartão e sem z-index negativo */}
              <motion.div
                aria-hidden="true"
                animate={{ rotate: [-3, 0, -3] }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                className="pointer-events-none absolute inset-x-3 top-10 bottom-5 z-0 rounded-[2.5rem] bg-[#EBF5FF] sm:inset-x-1 sm:top-8 sm:bottom-3"
              />

              {/* Calendário ampliado */}
              <motion.div
                animate={{ y: [0, -9, 0] }}
                transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
                className="relative z-10 w-full max-w-[560px] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.28)]"
              >
                <div className="flex min-h-[410px] bg-[#2563EB] text-white sm:min-h-[470px]">
                  <div className="flex w-[58px] shrink-0 flex-col items-center justify-center gap-8 border-r border-blue-500/40 px-2 sm:w-[76px] sm:gap-9 sm:px-3">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <svg className="h-7 w-7 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>

                  <div className="min-w-0 flex-1 bg-white px-3 py-6 text-slate-800 sm:px-6 sm:py-8 lg:px-7">
                    <div className="mb-6 flex items-center justify-between sm:mb-7">
                      <span className="text-sm font-bold text-slate-300" aria-hidden="true">‹</span>
                      <span className="text-sm font-extrabold tracking-tight text-slate-900">Julho 2026</span>
                      <span className="text-sm font-bold text-slate-300" aria-hidden="true">›</span>
                    </div>

                    <div className="mb-4 grid grid-cols-7 gap-y-2 text-center text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => <span key={day}>{day}</span>)}
                    </div>

                    <div className="grid grid-cols-7 gap-x-1 gap-y-2.5 text-center text-xs font-semibold sm:gap-x-2 sm:gap-y-3 sm:text-sm">
                      {julyCalendarDays.map((date, index) => (
                        <span
                          key={`${date.day}-${index}`}
                          className={`mx-auto flex h-9 w-full max-w-[38px] items-center justify-center rounded-lg sm:h-11 sm:max-w-[44px] ${
                            date.muted ? 'text-slate-300' : date.day === 15 ? 'bg-[#2563EB] font-extrabold text-white shadow-md shadow-blue-600/25' : 'text-slate-600'
                          }`}
                        >
                          {date.day}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex items-center justify-center gap-2 border-t border-slate-100 pt-4 text-[11px] font-semibold text-slate-400 sm:mt-6 sm:text-xs">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Horários disponíveis
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Confirmação com entrada e destaque sutis */}
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 190, damping: 18 }}
                className="absolute bottom-0 left-0 z-20 flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-[0_12px_30px_-12px_rgba(15,23,42,0.28)] sm:bottom-3 sm:-left-3 sm:p-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#22C55E] text-white"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.18, duration: 0.35 }}
                  className="pr-2"
                >
                  <p className="text-[11px] font-extrabold text-slate-800 sm:text-xs">Horário selecionado</p>
                  <p className="mt-0.5 text-[10px] font-medium text-slate-500 sm:text-[11px]">15 de julho · 10:00</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* STEPS SECTION */}
        <section id="como-funciona" className="py-20 px-6 md:px-12 bg-[#FAFAFA]">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-[1000px] mx-auto"
          >
            <motion.h2 variants={fadeInUp} className="text-[32px] font-black text-center text-slate-900 tracking-tight mb-16">
              Agendar nunca foi tão simples
            </motion.h2>
            
            <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-0 relative">
              {/* Step 1 */}
              <motion.div variants={fadeInUp} className="flex-1 flex flex-col items-center text-center px-4 w-full group">
                <div className="mb-6 relative transition-transform duration-300 group-hover:-translate-y-2">
                  <svg className="w-[72px] h-[72px]" viewBox="0 0 72 72" fill="none">
                    <rect x="12" y="20" width="48" height="32" rx="4" fill="#E2E8F0" />
                    <rect x="12" y="20" width="48" height="10" rx="4" fill="#334155" />
                    <circle cx="18" cy="25" r="2" fill="#F87171" />
                    <circle cx="24" cy="25" r="2" fill="#FBBF24" />
                    <circle cx="30" cy="25" r="2" fill="#34D399" />
                    <circle cx="45" cy="45" r="10" fill="none" stroke="#22C55E" strokeWidth="4" />
                    <line x1="52" y1="52" x2="58" y2="58" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-3">Escolha o serviço</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-[220px]">
                  Veja o que o estabelecimento oferece e quem atende.
                </p>
              </motion.div>

              <div className="hidden md:block w-px h-32 bg-slate-300 mt-8"></div>

              {/* Step 2 */}
              <motion.div variants={fadeInUp} className="flex-1 flex flex-col items-center text-center px-4 w-full group">
                <div className="mb-6 relative transition-transform duration-300 group-hover:-translate-y-2">
                  <svg className="w-[72px] h-[72px]" viewBox="0 0 72 72" fill="none">
                    <circle cx="36" cy="36" r="20" fill="#EBF5FF" stroke="#94A3B8" strokeWidth="4" />
                    <path d="M36 24V36L44 40" stroke="#F87171" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-3">Escolha o horário</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-[220px]">
                  Só aparecem os horários realmente disponíveis.
                </p>
              </motion.div>

              <div className="hidden md:block w-px h-32 bg-slate-300 mt-8"></div>

              {/* Step 3 */}
              <motion.div variants={fadeInUp} className="flex-1 flex flex-col items-center text-center px-4 w-full group">
                <div className="mb-6 relative transition-transform duration-300 group-hover:-translate-y-2">
                   <svg className="w-[72px] h-[72px]" viewBox="0 0 72 72" fill="none">
                    <rect x="12" y="20" width="48" height="32" rx="4" fill="#E2E8F0" />
                    <rect x="12" y="20" width="48" height="10" rx="4" fill="#334155" />
                    <circle cx="18" cy="25" r="2" fill="#F87171" />
                    <circle cx="24" cy="25" r="2" fill="#FBBF24" />
                    <circle cx="30" cy="25" r="2" fill="#34D399" />
                    <circle cx="36" cy="42" r="10" fill="#22C55E" />
                    <path d="M31 42l3 3 6-6" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-3">Confirme</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-[220px]">
                  Pronto: seu agendamento fica salvo e você acompanha o status.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* AUDIENCE SECTION: restaurada para o link "Para quem é" */}
        <section id="categorias" className="bg-[#F5F8FC] px-6 py-20 md:px-12 md:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="mx-auto max-w-[1100px]"
          >
            <motion.div variants={fadeInUp} className="mx-auto mb-12 max-w-2xl text-center">
              <span className="mb-3 inline-block text-xs font-extrabold uppercase tracking-[0.18em] text-[#2563EB]">Para quem é</span>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-[36px]">
                Feito para quem trabalha com horário marcado
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
                Uma forma mais simples de organizar a rotina de atendimentos, seja você profissional autônomo ou responsável por um estabelecimento.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { number: '01', title: 'Salões e barbearias', description: 'Organize serviços, profissionais e horários de atendimento.' },
                { number: '02', title: 'Clínicas e consultórios', description: 'Facilite a marcação e o acompanhamento dos compromissos.' },
                { number: '03', title: 'Estúdios e espaços', description: 'Mantenha os horários e a disponibilidade em um só lugar.' },
                { number: '04', title: 'Profissionais autônomos', description: 'Cuide da sua agenda sem depender de trocas intermináveis de mensagens.' }
              ].map((audience) => (
                <motion.article
                  key={audience.number}
                  variants={fadeInUp}
                  className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_-18px_rgba(37,99,235,0.26)]"
                >
                  <span className="mb-7 flex h-10 w-10 items-center justify-center rounded-xl bg-[#EBF5FF] text-xs font-extrabold text-[#2563EB]">{audience.number}</span>
                  <h3 className="text-base font-extrabold text-slate-900">{audience.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{audience.description}</p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-24 px-6 md:px-12 bg-white">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-[1200px] mx-auto"
          >
            <motion.h2 variants={fadeInUp} className="mb-6 text-center text-[30px] font-black tracking-tight text-slate-900 md:mb-10 md:text-[32px]">
              Tudo que você precisa, sem complicação
            </motion.h2>

            <div className="mb-5 flex items-center justify-between gap-4 md:hidden">
              <p className="text-xs font-medium text-slate-500">Deslize para explorar os recursos</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollFeatures(-1)}
                  aria-label="Ver recurso anterior"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:border-blue-200 hover:text-[#2563EB] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <button
                  type="button"
                  onClick={() => scrollFeatures(1)}
                  aria-label="Ver próximo recurso"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:border-blue-200 hover:text-[#2563EB] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </button>
              </div>
            </div>

            <div
              ref={featuresTrackRef}
              tabIndex={0}
              aria-label="Carrossel de recursos do AgendaFácil"
              role="region"
              aria-roledescription="carrossel"
              className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-smooth px-6 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0 md:pb-0"
            >
              {[
                {
                  title: "Sem conflito de horário",
                  desc: "Se aparece na tela, está livre.",
                  svg: <svg className="h-14 w-14" viewBox="0 0 64 64" fill="none"><path d="M16 24h12l8 16h12M16 40h12l4-8" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/><path d="M40 24h8m0 0l-4-4m4 4l-4 4" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/><path d="M40 40h8m0 0l-4-4m4 4l-4 4" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                },
                {
                  title: "Horários sempre à vista",
                  desc: "Consulte a disponibilidade quando quiser.",
                  svg: <svg className="h-14 w-14" viewBox="0 0 64 64" fill="none"><rect x="16" y="20" width="32" height="32" rx="4" fill="#FCA5A5" /><rect x="16" y="20" width="32" height="12" rx="4" fill="#EF4444" /><rect x="22" y="38" width="6" height="6" fill="white" /><rect x="32" y="38" width="6" height="6" fill="white" /><circle cx="44" cy="44" r="10" fill="#FBBF24" stroke="white" strokeWidth="2" /><path d="M44 38v6l3 3" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                },
                {
                  title: "Histórico organizado",
                  desc: "Veja seus agendamentos passados e futuros.",
                  svg: <svg className="h-14 w-14" viewBox="0 0 64 64" fill="none"><rect x="20" y="16" width="28" height="36" rx="2" fill="#BAE6FD" /><line x1="28" y1="26" x2="40" y2="26" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" /><line x1="28" y1="34" x2="40" y2="34" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" /><circle cx="20" cy="40" r="12" fill="#F87171" stroke="white" strokeWidth="2" /><path d="M20 34v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                },
                {
                  title: "Fila de espera",
                  desc: "O estabelecimento te avisa se surgir vaga.",
                  svg: <svg className="h-14 w-14" viewBox="0 0 64 64" fill="none"><path d="M20 16h24v4L36 32l8 12v4H20v-4l8-12-8-12v-4z" fill="#FDE68A" stroke="#D97706" strokeWidth="4" strokeLinejoin="round"/><path d="M22 16h20v2L34 30h-4L22 18v-2z" fill="#D97706" /></svg>
                }
              ].map((feat, i) => (
                <motion.article
                  key={feat.title}
                  data-feature-card
                  variants={fadeInUp}
                  className="flex min-h-[230px] min-w-[82%] snap-start flex-col items-center rounded-2xl border border-slate-100 bg-white p-7 text-center shadow-[0_8px_24px_-18px_rgba(15,23,42,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_-18px_rgba(37,99,235,0.24)] sm:min-w-[48%] md:min-w-0 md:p-6"
                >
                  <div className="mb-6 transition-transform duration-300 hover:scale-110">
                    {feat.svg}
                  </div>
                  <h3 className="mb-3 text-sm font-bold text-slate-900">{feat.title}</h3>
                  <p className="text-[13px] leading-relaxed text-slate-500">{feat.desc}</p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </section>

        {/* BUSINESS SECTION */}
        <section id="para-negocios" className="py-24 px-6 md:px-12 bg-[#2546D3] text-white overflow-hidden">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-[36px] font-black tracking-tight mb-4 leading-tight">
                Organize a agenda do seu estabelecimento
              </h2>
              <p className="text-blue-200 text-[15px] font-medium mb-10">
                Menos trabalho manual, mais controle sobre os atendimentos
              </p>
              
              <ul className="flex flex-col gap-5 mb-10">
                {[
                  'Cadastre serviços e profissionais',
                  'Defina horários de funcionamento e intervalos',
                  'Veja toda a agenda em um só lugar',
                  'Gerencie a fila de espera',
                  'Acompanhe o histórico de atendimentos'
                ].map((benefit, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center flex-shrink-0">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-white text-[15px] font-medium">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
              
              <Link to="/cadastro" className={`${secondaryButtonClass} w-full border-transparent px-8 py-3.5 text-[#2563EB] hover:bg-blue-50 sm:w-auto`}>
                Cadastrar minha empresa
              </Link>
            </motion.div>
            
            {/* Agenda do Dia Card */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="w-full flex justify-center lg:justify-end"
            >
              <div className="bg-white rounded-[20px] p-6 shadow-2xl text-slate-800 w-full max-w-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-shadow duration-500">
                <h3 className="font-bold text-center text-[15px] mb-6">Agenda do Dia</h3>
                
                <div className="flex flex-col gap-4">
                  {[
                    { time: "09:00 - Corte de Cabelo", status: "Confirmado", color: "bg-[#22C55E]", name: "João" },
                    { time: "10:30 - Barba", status: "Pendente", color: "bg-[#F59E0B]", name: "Pedro" },
                    { time: "14:00 - Disponível", status: "Livre", color: "bg-[#3B82F6]", name: "Livre" }
                  ].map((apt, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="flex flex-col gap-2 pb-4 border-b border-slate-100 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span className="text-xs text-slate-500 font-medium">{apt.time}</span>
                        </div>
                        <span className={`${apt.color} text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase`}>{apt.status}</span>
                      </div>
                      <div className="flex items-center gap-2 pl-6">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        <span className="text-[11px] text-slate-500">{apt.name}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CLOSING CTA */}
        <section className="py-24 px-6 md:px-12 bg-[#EBF5FF] text-center overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-[36px] font-black text-slate-900 tracking-tight mb-4">
              Pronto para começar?
            </h2>
            <p className="text-slate-600 text-[17px] mb-10 max-w-md mx-auto">
              Agende em poucos cliques ou organize a agenda do seu estabelecimento.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login" className={`${secondaryButtonClass} w-full px-8 py-3.5 text-[#2563EB] sm:w-auto`}>
                Agendar agora
              </Link>
              <Link to="/cadastro" className={`${primaryButtonClass} w-full px-8 py-3.5 sm:w-auto`}>
                Acessar área da empresa
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0F172A] py-16 px-6 md:px-12">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12 md:gap-6">
          <div className="text-left">
            <Link to="/" className="font-black text-2xl tracking-tight text-white">AgendaFácil</Link>
            <p className="text-slate-400 text-[13px] mt-3 max-w-[200px]">
              Agendamento simples para clientes e empresas.
            </p>
          </div>
          
          <div>
            <h4 className="text-slate-400 text-xs font-bold mb-4">Links</h4>
            <div className="flex gap-16">
              <div className="flex flex-col gap-3 text-[13px] font-medium text-white">
                <a href="#como-funciona" className="hover:text-[#38BDF8] transition-colors">Como funciona</a>
                <a href="#para-negocios" className="hover:text-[#38BDF8] transition-colors">Para empresas</a>
                <a href="#categorias" className="hover:text-[#38BDF8] transition-colors">Para quem é</a>
              </div>
              <div className="flex flex-col gap-3 text-[13px] font-medium text-white">
                <a href="#" className="hover:text-[#38BDF8] transition-colors">Termos de uso</a>
                <a href="#" className="hover:text-[#38BDF8] transition-colors">Política de privacidade</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}