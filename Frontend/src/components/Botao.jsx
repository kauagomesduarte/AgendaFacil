export default function Botao(props) {
  return (
    <div className="flex justify-center w-full my-4">
      <button className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all w-[300px] h-[40px] text-lg">
        {props.texto}
      </button>
    </div>
  );
}