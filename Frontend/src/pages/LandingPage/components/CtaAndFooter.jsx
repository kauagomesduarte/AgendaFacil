import { Link } from 'react-router-dom';

export default function CtaAndFooter() {
  return (
    <>
      <section className="lp-cta">
        <div className="af-container">
          <div className="lp-cta__inner">
            <h2 className="af-section-title">Pronto para começar?</h2>
            <p className="af-section-subtitle">
              Agende em poucos cliques ou organize a agenda do seu estabelecimento.
            </p>

            <div className="lp-cta__actions">
              <Link to="/login" className="af-btn af-btn--secondary af-btn--lg">
                Agendar agora
              </Link>
              <Link to="/cadastro" className="af-btn af-btn--primary af-btn--lg">
                Acessar área da empresa
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="af-container">
          <div className="lp-footer__top">
            <div>
              <Link to="/" className="lp-brand lp-footer__brand">
                AgendaFácil
              </Link>
              <p className="lp-footer__tagline">
                Agendamento simples para clientes e empresas.
              </p>
            </div>

            <div>
              <h3 className="lp-footer__heading">Links</h3>
              <ul className="lp-footer__links">
                <li><a href="#como-funciona" className="lp-footer__link">Como funciona</a></li>
                <li><a href="#para-negocios" className="lp-footer__link">Para empresas</a></li>
                <li><a href="#categorias" className="lp-footer__link">Para quem é</a></li>
              </ul>
            </div>

            <div>
              <h3 className="lp-footer__heading">Institucional</h3>
              <ul className="lp-footer__links">
                <li><a href="#termos" className="lp-footer__link">Termos de uso</a></li>
                <li><a href="#privacidade" className="lp-footer__link">Política de privacidade</a></li>
              </ul>
            </div>
          </div>

          <div className="lp-footer__bottom">
            <span>© {new Date().getFullYear()} AgendaFácil.</span>
          </div>
        </div>
      </footer>
    </>
  );
}