import React, { useState } from "react";
import "./Agenda.css";

function Agenda() {

    const [dataAtual, setDataAtual] = useState(new Date(2026, 10, 1));
    const [dataSelecionada, setDataSelecionada] = useState(new Date(2026, 10, 10));

    const agendamentos = {
        "2026-11-10": [
            { cliente: "Cliente", servico: "Serviço", funcionario: "Funcionário", horario: "09:00", status: "Status" },
            { cliente: "Cliente", servico: "Serviço", funcionario: "Funcionário", horario: "10:00", status: "Status" },
            { cliente: "Cliente", servico: "Serviço", funcionario: "Funcionário", horario: "11:00", status: "Status" },
            { cliente: "Cliente", servico: "Serviço", funcionario: "Funcionário", horario: "12:00", status: "Status" },
            { cliente: "Cliente", servico: "Serviço", funcionario: "Funcionário", horario: "13:00", status: "Status" }
        ]
    };

    // Formatar data
    const formatarData = (data) => {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const dia = String(data.getDate()).padStart(2, "0");

        return `${ano}-${mes}-${dia}`;
    };

    // Alterar mês
    const mudarMes = (quantidade) => {
        setDataAtual(new Date(
            dataAtual.getFullYear(),
            dataAtual.getMonth() + quantidade,
            1
        ));
    };

    // Gerar calendário
    const gerarDias = () => {

        const ano = dataAtual.getFullYear();
        const mes = dataAtual.getMonth();

        const primeiroDia = new Date(ano, mes, 1).getDay();
        const ultimoDia = new Date(ano, mes + 1, 0).getDate();

        const ultimoDiaAnterior = new Date(ano, mes, 0).getDate();

        const dias = [];

        for (let i = primeiroDia - 1; i >= 0; i--) {

            dias.push({
                numero: ultimoDiaAnterior - i,
                mes: mes - 1,
                ano,
                outroMes: true
            });

        }

        for (let i = 1; i <= ultimoDia; i++) {

            dias.push({
                numero: i,
                mes,
                ano,
                outroMes: false
            });

        }

        let proximoDia = 1;

        while (dias.length < 42) {

            dias.push({
                numero: proximoDia++,
                mes: mes + 1,
                ano,
                outroMes: true
            });

        }

        return dias.map(dia => {

            let data = new Date(dia.ano, dia.mes, dia.numero);

            return {
                ...dia,
                data
            };

        });

    };

    const dias = gerarDias();

    // Nome do mês
    const nomeMes = dataAtual.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric"
    });

    // Agendamentos da data selecionada
    const listaAgendamentos = agendamentos[formatarData(dataSelecionada)] || [];

    return (

        <div className="agenda-container">

            {/* MENU LATERAL */}

            <aside className="sidebar">

                <h2 className="logo">AgendaFácil</h2>

                <nav className="menu">

                    <a href="#" className="menu-item ativo">
                        <span>▦</span>
                        Agenda
                    </a>

                    <a href="#" className="menu-item">
                        <span>◷</span>
                        Meus Horários
                    </a>

                    <a href="#" className="menu-item">
                        <span>▤</span>
                        Fila de espera
                    </a>

                </nav>

                <div className="sidebar-bottom">

                    <div className="usuario">
                        <span className="icone-usuario">◎</span>

                        <div>
                            <p>Nome do Colaborador</p>
                            <small>Funcionário</small>
                        </div>
                    </div>

                    <a href="#" className="sair">
                        ⇥ Sair
                    </a>

                </div>

            </aside>


            {/* CONTEÚDO PRINCIPAL */}

            <main className="conteudo">

                {/* CALENDÁRIO */}

                <section className="calendario-card">

                    <h3>Agenda</h3>

                    <div className="calendario-header">

                        <button onClick={() => mudarMes(-1)}>
                            ‹
                        </button>

                        <h2>
                            {nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)}
                        </h2>

                        <button onClick={() => mudarMes(1)}>
                            ›
                        </button>

                    </div>

                    <div className="dias-semana">

                        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(dia => (
                            <span key={dia}>{dia}</span>
                        ))}

                    </div>

                    <div className="calendario-grid">

                        {dias.map((dia, index) => {

                            const selecionado =
                                formatarData(dia.data) === formatarData(dataSelecionada);

                            return (

                                <div
                                    key={index}
                                    className={`dia 
                                        ${dia.outroMes ? "outro-mes" : ""}
                                        ${selecionado ? "selecionado" : ""}
                                    `}
                                    onClick={() => setDataSelecionada(dia.data)}
                                >

                                    {String(dia.numero).padStart(2, "0")}

                                </div>

                            );

                        })}

                    </div>

                </section>


                {/* AGENDAMENTOS DO DIA */}

                <section className="hoje-card">

                    <h3>Hoje</h3>

                    <div className="lista-agendamentos">

                        {listaAgendamentos.length > 0 ? (

                            listaAgendamentos.map((item, index) => (

                                <div className="agendamento" key={index}>

                                    <div className="agendamento-header">

                                        <strong>{item.cliente}</strong>

                                        <span>{item.horario}</span>

                                    </div>

                                    <p>{item.servico}</p>

                                    <div className="agendamento-footer">

                                        <span>{item.funcionario}</span>

                                        <span>{item.status}</span>

                                    </div>

                                </div>

                            ))

                        ) : (

                            <p className="sem-agendamento">
                                Nenhum agendamento nesta data.
                            </p>

                        )}

                    </div>

                </section>

            </main>

        </div>

    );

}

export default Agenda;