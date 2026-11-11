import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/landing.css';

const calendarDays = [
  'S', 'T', 'Q', 'Q', 'S', 'S', 'D',
  ...Array.from({ length: 35 }, (_, index) => String(index + 1)),
];

const steps = [
  {
    icon: '🔎',
    title: 'Escolha o serviço',
    text: 'Veja o que o estabelecimento oferece e quem atende.',
  },
  {
    icon: '🕘',
    title: 'Escolha o horário',
    text: 'Só aparecem os horários realmente disponíveis.',
  },
  {
    icon: '✅',
    title: 'Confirme',
    text: 'Pronto: seu agendamento fica salvo e você acompanha o status.',
  },
];

const features = [
  {
    icon: '🔀',
    title: 'Sem conflito de horário',
    text: 'Se aparece na tela, está livre.',
  },
  {
    icon: '📅',
    title: 'Horários sempre à vista',
    text: 'Consulte a disponibilidade e escolha quando quiser.',
  },
  {
    icon: '🗂️',
    title: 'Histórico organizado',
    text: 'Veja seus agendamentos passados e futuros.',
  },
  {
    icon: '⏳',
    title: 'Fila de espera',
    text: 'Sem vaga? Entre na fila e receba um aviso quando surgir um horário.',
  },
];

const businessBenefits = [
  'Cadastre serviços e profissionais',
  'Defina horários de funcionamento e intervalos',
  'Veja toda a agenda em um só lugar',
  'Gerencie a fila de espera',
  'Acompanhe o histórico de atendimentos',
];

const appointments = [
  { time: '09:00', service: 'Corte de cabelo', person: 'João', status: 'Confirmado', tone: 'confirmed' },
  { time: '10:30', service: 'Barba', person: 'Pedro', status: 'Pendente', tone: 'pending' },
  { time: '14:00', service: 'Disponível', person: 'Livre', status: 'Livre', tone: 'available' },
];

const categories = [
  { icon: '🏥', title: 'Clínicas', text: 'Consultas organizadas, sem sobreposição.' },
  { icon: '💈', title: 'Barbearias', text: 'Cada barbeiro com a própria agenda.' },
  { icon: '💅', title: 'Salões de Beleza', text: 'Serviços e horários em um só lugar.' },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="lp-header">
      <div className="lp-header__inner">
        <Link className="lp-brand" to="/" aria-label="AgendaFácil, página inicial">
          AgendaFácil
        </Link>

        <nav className="lp-header__nav" aria-label="Navegação principal">
          <Link to="/login">Sou Cliente</Link>
          <Link to="/cadastro">Sou Empresa</Link>
        </nav>

        <button
          className="lp-menu-button"
          type="button"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="lp-mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && (
        <nav id="lp-mobile-navigation" className="lp-mobile-nav" aria-label="Navegação móvel">
          <Link onClick={closeMenu} to="/login">Sou Cliente</Link>
          <Link onClick={closeMenu} to="/cadastro">Sou Empresa</Link>
        </nav>
      )}
    </header>
  );
}

function CalendarIllustration() {
  return (
    <div className="lp-calendar-wrap" aria-label="Exemplo visual de uma agenda mensal">
      <div className="lp-calendar">
        <div className="lp-calendar__top">
          <strong><span aria-hidden="true">‹</span> Jun 2025 <span aria-hidden="true">›</span></strong>
          <span>Mês</span>
        </div>
        <div className="lp-calendar__body">
          <aside className="lp-calendar__tools" aria-hidden="true">
            <span>▦</span>
            <span>◷</span>
            <span>♙</span>
          </aside>
          <div className="lp-calendar__grid">
            {calendarDays.map((day, index) => (
              <span
                className={day === '18' ? 'is-selected' : ''}
                key={`${day}-${index}`}
              >
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="lp-confirmation">
        <span aria-hidden="true">✓</span>
        <p>
          <strong>Horário confirmado</strong>
          <small>18 de junho, 10:30</small>
        </p>
      </div>
    </div>
  );
}

function BusinessSchedule() {
  return (
    <div className="lp-schedule">
      <h3>Agenda do Dia</h3>
      <div className="lp-schedule__appointments">
        {appointments.map((appointment) => (
          <article className="lp-appointment" key={appointment.time}>
            <span className="lp-appointment__time">◷ {appointment.time}</span>
            <span className={`lp-appointment__dot ${appointment.tone}`} aria-hidden="true" />
            <p>
              <strong>{appointment.service}</strong>
              <small>{appointment.person}</small>
            </p>
            <span className={`lp-appointment__status ${appointment.tone}`}>
              {appointment.status}
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="lp-hero">
      <div className="lp-shell lp-hero__inner">
        <div className="lp-hero__copy">
          <h1 className="lp-hero__title">
            Agende seu horário <span>sem ligar, sem esperar.</span>
          </h1>
          <p>
            Veja os horários disponíveis, marque em poucos cliques e acompanhe tudo em um só lugar.
          </p>
          <div className="lp-actions">
            <Link className="lp-button lp-button--primary" to="/login">Agendar Agora</Link>
            <Link className="lp-button lp-button--outline" to="/cadastro">Sou Empresa</Link>
          </div>
        </div>
        <CalendarIllustration />
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section className="lp-section lp-steps" id="como-funciona">
      <div className="lp-shell">
        <h2 className="lp-section__title">Agendar nunca foi tão simples</h2>
        <div className="lp-steps__grid">
          {steps.map((step) => (
            <article className="lp-step" key={step.title}>
              <span className="lp-icon lp-icon--step" aria-hidden="true">{step.icon}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="lp-section lp-features">
      <div className="lp-shell">
        <h2 className="lp-section__title">Tudo que você precisa, sem complicação</h2>
        <div className="lp-features__grid">
          {features.map((feature) => (
            <article className="lp-feature" key={feature.title}>
              <span className="lp-icon lp-icon--feature" aria-hidden="true">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Businesses() {
  return (
    <section className="lp-business" id="para-negocios">
      <div className="lp-shell">
        <h2 className="lp-section__title">Organize a agenda do seu estabelecimento</h2>
        <p className="lp-business__subtitle">
          Menos trabalho manual, mais controle sobre os atendimentos
        </p>
        <div className="lp-business__content">
          <div className="lp-business__details">
            <ul>
              {businessBenefits.map((benefit) => (
                <li key={benefit}><span aria-hidden="true">✓</span>{benefit}</li>
              ))}
            </ul>
            <Link className="lp-button lp-button--light" to="/cadastro">
              Cadastrar minha empresa
            </Link>
          </div>
          <BusinessSchedule />
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="lp-section lp-categories" id="categorias">
      <div className="lp-shell">
        <h2 className="lp-section__title">Feito para quem trabalha com horário marcado</h2>
        <div className="lp-categories__grid">
          {categories.map((category) => (
            <article className="lp-category" key={category.title}>
              <span className="lp-icon lp-icon--category" aria-hidden="true">{category.icon}</span>
              <h3>{category.title}</h3>
              <p>{category.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingCTA() {
  return (
    <section className="lp-closing">
      <div className="lp-shell">
        <h2>Pronto para começar?</h2>
        <p>Agende em poucos cliques ou organize a agenda do seu estabelecimento.</p>
        <div className="lp-actions lp-actions--centered">
          <Link className="lp-button lp-button--white" to="/login">Agendar agora</Link>
          <Link className="lp-button lp-button--primary" to="/cadastro">
            Acessar área da empresa
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-shell lp-footer__inner">
        <div className="lp-footer__brand">
          <Link className="lp-brand lp-brand--light" to="/">AgendaFácil</Link>
          <p>Agendamento simples para clientes e empresas.</p>
        </div>
        <nav className="lp-footer__links" aria-label="Links do rodapé">
          <h2>Links</h2>
          <a href="#como-funciona">Como funciona</a>
          <a href="#para-negocios">Para empresas</a>
          <a href="#categorias">Para quem é</a>
        </nav>
        <div className="lp-footer__legal" aria-label="Informações legais">
          <span>Termos de uso</span>
          <span>Política de privacidade</span>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      <main className="lp-main">
        <Hero />
        <Steps />
        <Features />
        <Businesses />
        <Categories />
        <ClosingCTA />
      </main>
      <Footer />
    </div>
  );
}
