import { Link } from 'react-router-dom';
import Botao from '../components/Botao';
import '../CSS/login.css';

export default function Login(){
  return(
    <>
      <header>
        <h1><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>AgendaFácil</Link></h1>
        <Link to="/cadastro">Cadastro</Link>
      </header>
      <main>
          <div className="container">
              <h2>Login</h2>
              <p className="subtitulo">Faça login para acessar a plataforma</p>

              <input type="email" name="email" id="email" placeholder="Email"></input>
              <input type="password" name="senha" id="senha" placeholder="Senha"></input>

              <Botao texto="Entrar"/>
              
              <p className="msg">Ainda não possui uma conta? <Link to="/cadastro">Cadastre-se</Link></p>
              <p className="msg">Esqueci meu email ou senha</p>
          </div>
      </main>
    </>
  )
}