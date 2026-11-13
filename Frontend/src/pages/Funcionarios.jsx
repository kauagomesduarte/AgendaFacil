import React from 'react';
import '../CSS/Funcionarios.css';
import Sidebar from '../components/Sidebar';


const Funcionarios = () => {
  // Dados de exemplo baseados no teu design
const listaFuncionarios = [
    { nome: 'Carlos', email: 'carlos@estilofino.com', servico: 'Corte, Barba', status: 'Ativo' },
    { nome: 'Marina', email: 'marina@estilofino.com', servico: 'Corte e escova, Hidratação', status: 'Ativo' },
    { nome: 'Rafael', email: 'rafael@estilofino.com', servico: 'Corte, Barba, Sobrancelha', status: 'Ativo' },
    { nome: 'Beatriz', email: 'beatriz@estilofino.com', servico: 'Hidratação', status: 'Inativo' },
    { nome: '', email: '', servico: '', status: '' },
    { nome: '', email: '', servico: '', status: '' },
    { nome: '', email: '', servico: '', status: '' },
    { nome: '', email: '', servico: '', status: '' },
    { nome: '', email: '', servico: '', status: '' },
    { nome: '', email: '', servico: '', status: '' },
    { nome: '', email: '', servico: '', status: '' },
    { nome: '', email: '', servico: '', status: '' },
    { nome: '', email: '', servico: '', status: '' },
    { nome: '', email: '', servico: '', status: '' },
    
  ];
  return (
    <div className="funcionarios-container">
      <Sidebar />
      
      <main className="conteudo-principal">
        <div className="cartao-funcionarios">
          
          <header className="cabecalho-tabela">
            <h2>Funcionários</h2>
            <div className="acoes-cabecalho">
              <input type="text" placeholder="Pesquisar" className="input-pesquisa" />
              <button className="btn-filtro">Filtros</button>
              <button className="btn-icone">✏️</button>
            </div>
          </header>

          <table className="tabela-funcionarios">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Serviço</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {listaFuncionarios.map((funcionario, index) => (
                <tr key={index}>
                  <td className="font-bold">{funcionario.nome}</td>
                  <td>{funcionario.email}</td>
                  <td>{funcionario.servico}</td>
                  <td>{funcionario.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="rodape-tabela">
            <div className="rodape-tabela">
        <button className="btn-salvar">Salvar Alterações</button>
      </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Funcionarios;

