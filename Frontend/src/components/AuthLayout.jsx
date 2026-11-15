import { Link } from 'react-router-dom';
import '../CSS/auth.css';

export default function AuthLayout({
  headerActionLabel,
  headerActionTo,
  title,
  subtitle,
  wide = false,
  shake = false,
  children,
}) {
  return (
    <div className="af-auth-page">
      <header className="lp-header">
        <div className="af-container lp-header__inner">
          <Link to="/" className="lp-brand">
            AgendaFácil
          </Link>

          <Link to={headerActionTo} className="af-auth-header__action">
            {headerActionLabel}
          </Link>
        </div>
      </header>

      <main className="af-auth-main">
        <div className="af-auth-bg-grid" aria-hidden="true" />
        <div className="af-auth-blob af-auth-blob--blue" aria-hidden="true" />
        <div className="af-auth-blob af-auth-blob--lavender" aria-hidden="true" />

        <div
          className={`af-auth-card ${wide ? 'af-auth-card--wide' : ''} ${
            shake ? 'af-auth-card--shake' : ''
          }`}
        >
          <div className="af-auth-header-block">
            <h1 className="af-auth-title">{title}</h1>
            <p className="af-auth-subtitle">{subtitle}</p>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}