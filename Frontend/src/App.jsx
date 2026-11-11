import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Cadastro from './pages/Cadastro.jsx';
import Servicos from './pages/Servicos.jsx';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/servicos" element={<Servicos />} />
      </Routes>
    </BrowserRouter>
  );
}