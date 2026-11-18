export default function Botao({ texto }) {
  return (
    <button className="w-full h-11 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm text-base">
      {texto}
    </button>
  );
}