import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Cadastro from './pages/Cadastro.jsx';
import Servicos from './pages/Servicos.jsx';
import Funcionarios from './pages/Funcionarios.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/servicos" element={<Servicos />} />
      <Route path="/funcionarios" element={<Funcionarios />} />
    </Routes>
  </BrowserRouter>
  );
}