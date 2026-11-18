import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// Público
import LandingPage from './pages/LandingPage/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Cadastro from './pages/Cadastro.jsx';

// Cliente
import Clientes from './pages/Cliente/Clientes.jsx';
import MeusHorarios from './pages/Cliente/MeusHorarios.jsx';
import MinhaConta from './pages/Cliente/MinhaConta.jsx';

// Empresa
import AgendaEmpresa from './pages/Empresa/AgendaEmpresa.jsx';
import Servicos from './pages/Empresa/Servicos.jsx';
import EmpresaFuncionarios from './pages/Empresa/EmpresaFuncionarios.jsx';
import Horarios from './pages/Empresa/Horarios.jsx';

// Funcionário
import AgendaFuncionario from './pages/Funcionario/AgendaFuncionario.jsx';
import HorariosFuncionario from './pages/Funcionario/HorariosFuncionario.jsx';
import FilaDeEspera from './pages/Funcionario/FilaDeEspera.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Público */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Cliente */}
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/meus-horarios" element={<MeusHorarios />} />
        <Route path="/minha-conta" element={<MinhaConta />} />

        {/* Empresa */}
        <Route path="/agenda-empresa" element={<AgendaEmpresa />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/funcionarios" element={<EmpresaFuncionarios />} />
        <Route path="/horarios" element={<Horarios />} />

        {/* Funcionário */}
        <Route path="/agenda" element={<AgendaFuncionario />} />
        <Route path="/agenda-funcionario" element={<AgendaFuncionario />} />
        <Route path="/horarios-funcionario" element={<HorariosFuncionario />} />
        <Route path="/fila-espera" element={<FilaDeEspera />} />
        <Route path="/fila-de-espera" element={<FilaDeEspera />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}