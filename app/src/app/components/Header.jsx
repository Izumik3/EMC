export default function Header() {
  return (
    <header className="w-full bg-gradient-to-b from-[#FFFFFF] to-[#D8D8D8] p-4  font-light">
      <div className="max-w-content w-[90%] mx-auto flex items-center justify-between">
        <a href="/"><div className="text-[24px]">ЭЛЕКТРОННЫЙ МАСТЕР-КОНСУЛЬТАНТ</div></a>
        
        <button className="w-8 h-6 flex flex-col justify-between">
          <span className="h-1 bg-black rounded"></span>
          <span className="h-1 bg-black rounded"></span>
          <span className="h-1 bg-black rounded"></span>
        </button>
      </div>
    </header>
  );
}