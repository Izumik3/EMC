export default function Footer() {
  return (
    <footer className="w-full bg-footer text-white py-6 mt-10">
      <div className="max-w-content w-[90%] mx-auto text-[16px] font-light">
        <div className=" mb-3">Электронный мастер-консультант</div>

        <div className="border-t border-white pt-4 mt-4">
          <a className="block text-sm opacity-80 hover:opacity-100 hover:underline"
            href="#">Политика конфиденциальности</a>
          <a className="block text-sm opacity-80 hover:opacity-100 hover:underline"
            href="#">Пользовательское соглашение</a>
          <a className="block text-sm opacity-80 hover:opacity-100 hover:underline"
            href="#">© Московский Политех</a>
        </div>
      </div>
    </footer>
  );
}