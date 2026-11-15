import { useState } from "react";
import "./App.css";

function App() {
  const [funcionarios, setFuncionarios] = useState([
    {
      id: 1,
      nome: "Carlos",
      email: "carlos@estilofino.com",
      servico: "Corte, Barba",
      status: "Ativo",
    },
    {
      id: 2,
      nome: "Marina",
      email: "marina@estilofino.com",
      servico: "Corte e escova, Hidratação",
      status: "Ativo",
    },
    {
      id: 3,
      nome: "Rafael",
      email: "rafael@estilofino.com",
      servico: "Corte, Barba, Sobrancelha",
      status: "Ativo",
    },
    {
      id: 4,
      nome: "Beatriz",
      email: "beatriz@estilofino.com",
      servico: "Hidratação",
      status: "Inativo",
    },
  ]);

  const [pesquisa, setPesquisa] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    nome: "",
    email: "",
    servico: "",
    status: "Ativo",
  });

  const [mensagem, setMensagem] = useState("");

  // PESQUISA E FILTROS
  const funcionariosFiltrados = funcionarios.filter((funcionario) => {
    const termo = pesquisa.toLowerCase();

    const correspondePesquisa =
      funcionario.nome.toLowerCase().includes(termo) ||
      funcionario.email.toLowerCase().includes(termo) ||
      funcionario.servico.toLowerCase().includes(termo);

    const correspondeFiltro =
      filtro === "Todos" || funcionario.status === filtro;

    return correspondePesquisa && correspondeFiltro;
  });

  // ABRIR MODAL PARA NOVO FUNCIONÁRIO
  function novoFuncionario() {
    setEditando(null);

    setFormulario({
      nome: "",
      email: "",
      servico: "",
      status: "Ativo",
    });

    setModalAberto(true);
  }

  // EDITAR FUNCIONÁRIO
  function editarFuncionario(funcionario) {
    setEditando(funcionario.id);
    setFormulario({ ...funcionario });
    setModalAberto(true);
  }

  // SALVAR FUNCIONÁRIO
  function salvarFuncionario(e) {
    e.preventDefault();

    if (editando !== null) {
      setFuncionarios((lista) =>
        lista.map((funcionario) =>
          funcionario.id === editando
            ? { ...formulario, id: editando }
            : funcionario
        )
      );
    } else {
      setFuncionarios((lista) => [
        ...lista,
        {
          ...formulario,
          id: Date.now(),
        },
      ]);
    }

    setModalAberto(false);
    setMensagem("Alterações realizadas com sucesso!");

    setTimeout(() => setMensagem(""), 3000);
  }

  function salvarAlteracoes() {
    setMensagem("Alterações salvas com sucesso!");

    setTimeout(() => setMensagem(""), 3000);
  }

  return (
    <div className="dashboard">

      {/* MENU LATERAL */}

      <aside className="sidebar">

        <div className="logo">
          <h1>AgendaFácil</h1>
        </div>

        <nav className="menu">

          <a href="#" className="menu-item">
            <span>▦</span>
            Agenda
          </a>

          <a href="#" className="menu-item">
            <span>✂</span>
            Serviços
          </a>

          <a href="#" className="menu-item ativo">
            <span>♙</span>
            Funcionários
          </a>

          <a href="#" className="menu-item">
            <span>◷</span>
            Horários
          </a>

          <a href="#" className="menu-item">
            <span>▤</span>
            Fila de espera
          </a>

        </nav>

        <div className="sidebar-footer">

          <div className="usuario">

            <span className="icone-usuario">◎</span>

            <div>
              <strong>Nome da Empresa</strong>
              <small>Administrador</small>
            </div>

          </div>

          <button className="btn-sair">
            ⇥ <span>Sair</span>
          </button>

        </div>

      </aside>

      {/* CONTEÚDO PRINCIPAL */}

      <main className="main-content">

        <section className="painel">

          <header className="painel-header">

            <h2>Funcionários</h2>

            <div className="acoes">

              <input
                type="text"
                placeholder="Pesquisar"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className="campo-pesquisa"
              />

              <div className="filtro-container">

                <button
                  className="btn-filtros"
                  onClick={() => setMostrarFiltros(!mostrarFiltros)}
                >
                  Filtros
                </button>

                {mostrarFiltros && (

                  <div className="filtro-menu">

                    {["Todos", "Ativo", "Inativo"].map((status) => (

                      <button
                        key={status}
                        className={filtro === status ? "filtro-ativo" : ""}
                        onClick={() => {
                          setFiltro(status);
                          setMostrarFiltros(false);
                        }}
                      >
                        {status}
                      </button>

                    ))}

                  </div>

                )}

              </div>

              <button
                className="btn-editar"
                onClick={novoFuncionario}
                title="Adicionar funcionário"
              >
                +
              </button>

            </div>

          </header>

          {/* TABELA */}

          <div className="tabela-container">

            <table>

              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Serviço</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>

                {funcionariosFiltrados.length > 0 ? (

                  funcionariosFiltrados.map((funcionario) => (

                    <tr key={funcionario.id}>

                      <td>{funcionario.nome}</td>

                      <td>{funcionario.email}</td>

                      <td>{funcionario.servico}</td>

                      <td>
                        <span
                          className={`status ${
                            funcionario.status === "Ativo"
                              ? "status-ativo"
                              : "status-inativo"
                          }`}
                        >
                          {funcionario.status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="editar-linha"
                          onClick={() => editarFuncionario(funcionario)}
                          title="Editar funcionário"
                        >
                          ✎
                        </button>
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td colSpan="5" className="sem-resultados">
                      Nenhum funcionário encontrado.
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* RODAPÉ */}

          <footer className="painel-footer">

            {mensagem && (
              <span className="mensagem-sucesso">
                {mensagem}
              </span>
            )}

            <button
              className="btn-salvar"
              onClick={salvarAlteracoes}
            >
              Salvar Alterações
            </button>

          </footer>

        </section>

      </main>

      {/* MODAL */}

      {modalAberto && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h2>
                {editando !== null
                  ? "Editar Funcionário"
                  : "Novo Funcionário"}
              </h2>

              <button
                className="fechar-modal"
                onClick={() => setModalAberto(false)}
              >
                ×
              </button>

            </div>

            <form onSubmit={salvarFuncionario}>

              <label>Nome</label>

              <input
                type="text"
                value={formulario.nome}
                onChange={(e) =>
                  setFormulario({
                    ...formulario,
                    nome: e.target.value,
                  })
                }
                required
              />

              <label>Email</label>

              <input
                type="email"
                value={formulario.email}
                onChange={(e) =>
                  setFormulario({
                    ...formulario,
                    email: e.target.value,
                  })
                }
                required
              />

              <label>Serviço</label>

              <input
                type="text"
                value={formulario.servico}
                onChange={(e) =>
                  setFormulario({
                    ...formulario,
                    servico: e.target.value,
                  })
                }
                required
              />

              <label>Status</label>

              <select
                value={formulario.status}
                onChange={(e) =>
                  setFormulario({
                    ...formulario,
                    status: e.target.value,
                  })
                }
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>

              <button type="submit" className="modal-salvar">
                Salvar Funcionário
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;
