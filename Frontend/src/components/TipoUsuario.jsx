import { useState } from 'react';

export default function TipoUsuario() {
  const [tipo, setTipo] = useState('cliente');

  return (
    <div className="flex items-center justify-between w-[300px] mx-auto h-[45px] bg-white border border-[#2563EB] rounded-full relative shadow-sm my-4 overflow-hidden">
      
      {/* Botão Sou Cliente */}
      <button
        type="button"
        onClick={() => setTipo('cliente')}
        className={`w-1/2 h-full text-sm transition-all duration-300 z-10 ${
          tipo === 'cliente'
            ? 'text-white font-bold'
            : 'text-gray-500 font-normal hover:text-black'
        }`}
      >
        Sou Cliente
      </button>

      {/* Botão Sou Empresa */}
      <button
        type="button"
        onClick={() => setTipo('empresa')}
        className={`w-1/2 h-full text-sm transition-all duration-300 z-10 ${
          tipo === 'empresa'
            ? 'text-white font-bold'
            : 'text-gray-500 font-normal hover:text-black'
        }`}
      >
        Sou Empresa
      </button>

      {/* Fundo deslizante: Agora é só um bloco reto! O 'overflow-hidden' do pai corta os cantos externos automaticamente */}
      <div
        className={`absolute top-0 bottom-0 w-1/2 bg-[#2563EB] transition-all duration-300 ease-in-out ${
          tipo === 'cliente' ? 'left-0' : 'left-1/2'
        }`}
      />
    </div>
  );
}