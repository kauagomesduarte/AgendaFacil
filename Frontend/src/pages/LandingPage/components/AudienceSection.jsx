const AUDIENCES = [
  {
    code: '01',
    title: 'Salões e barbearias',
    description: 'Organize serviços, profissionais e horários de atendimento.',
  },
  {
    code: '02',
    title: 'Clínicas e consultórios',
    description: 'Facilite a marcação e o acompanhamento dos compromissos.',
  },
  {
    code: '03',
    title: 'Estúdios e espaços',
    description: 'Mantenha os horários e a disponibilidade em um só lugar.',
  },
  {
    code: '04',
    title: 'Profissionais autônomos',
    description: 'Cuide da sua agenda sem depender de trocas intermináveis de mensagens.',
  },
];

export default function AudienceSection() {
  return (
    <section id="categorias" className="lp-audience">
      <div className="af-container">
        <header className="af-section-header">
          <h2 className="af-section-title">Feito para quem trabalha com horário marcado</h2>
          <p className="af-section-subtitle">
            Uma forma mais simples de organizar a rotina de atendimentos, seja você profissional autônomo ou responsável por um estabelecimento.
          </p>
        </header>

        <div className="lp-audience__grid">
          {AUDIENCES.map((item) => (
            <article key={item.code} className="lp-audience-card">
              <span className="lp-audience-card__code">{item.code}</span>
              <h3 className="lp-audience-card__title">{item.title}</h3>
              <p className="lp-audience-card__desc">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}