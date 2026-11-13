import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Para quem é', href: '#categorias' },
  { label: 'Recursos', href: '#recursos' },
  { label: 'Para empresas', href: '#para-negocios' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
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

  return (
    <>
      <header className="lp-header">
        <div className="af-container lp-header__inner">
          <Link to="/" className="lp-brand">
            AgendaFácil
          </Link>

          <nav className="lp-nav-links" aria-label="Navegação principal">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} className="lp-nav-link">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="lp-header__actions">
            <Link to="/login" className="af-btn af-btn--ghost af-btn--sm">
              Sou Cliente
            </Link>
            <Link to="/cadastro" className="af-btn af-btn--primary af-btn--sm">
              Sou Empresa
            </Link>
          </div>

          <button
            type="button"
            className="lp-menu-toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="lp-menu-toggle__bar"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="lp-menu-toggle__bar"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="lp-menu-toggle__bar"
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="lp-drawer-backdrop"
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              aria-hidden="true"
            />

            <motion.aside
              id="mobile-navigation"
              className="lp-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              aria-label="Menu mobile"
            >
              <div className="lp-drawer__head">
                <Link to="/" onClick={closeMenu} className="lp-brand">
                  AgendaFácil
                </Link>

                <button
                  type="button"
                  onClick={closeMenu}
                  className="lp-drawer__close"
                  aria-label="Fechar menu"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="lp-drawer__nav" aria-label="Links da página">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="lp-drawer__link"
                  >
                    <span>{item.label}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </a>
                ))}
              </nav>

              <div className="lp-drawer__footer">
                <Link to="/login" onClick={closeMenu} className="af-btn af-btn--primary">
                  Sou Cliente
                </Link>
                <Link to="/cadastro" onClick={closeMenu} className="af-btn af-btn--secondary">
                  Sou Empresa
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}