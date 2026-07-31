export default function Footer() {
  return (
    <footer className="bg-nordic text-white border-t border-nordic/20 mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4 md:px-12 py-12 max-w-7xl mx-auto w-full">
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <a href="#" className="text-xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined fill-icon text-hint-of-green text-2xl">
              real_estate_agent
            </span>
            EstateFlow
          </a>
          <p className="text-sm text-white/70 max-w-xs leading-relaxed">
            Tu socio de confianza para encontrar la propiedad ideal. Soluciones inmobiliarias profesionales, transparentes y eficientes.
          </p>
        </div>

        {/* Links Columns */}
        <div className="flex flex-col gap-3">
          <h4 className="text-base font-semibold text-hint-of-green">Empresa</h4>
          <a href="#" className="text-sm text-white/70 hover:text-hint-of-green transition-colors">
            Nosotros
          </a>
          <a href="#" className="text-sm text-white/70 hover:text-hint-of-green transition-colors">
            Contacto
          </a>
          <a href="#" className="text-sm text-white/70 hover:text-hint-of-green transition-colors">
            Carreras
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-base font-semibold text-hint-of-green">Recursos</h4>
          <a href="#" className="text-sm text-white/70 hover:text-hint-of-green transition-colors">
            Guía de Vecindarios
          </a>
          <a href="#" className="text-sm text-white/70 hover:text-hint-of-green transition-colors">
            Reportes de Mercado
          </a>
          <a href="#" className="text-sm text-white/70 hover:text-hint-of-green transition-colors">
            Calculadora Hipotecaria
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-base font-semibold text-hint-of-green">Legales</h4>
          <a href="#" className="text-sm text-white/70 hover:text-hint-of-green transition-colors">
            Política de Privacidad
          </a>
          <a href="#" className="text-sm text-white/70 hover:text-hint-of-green transition-colors">
            Términos de Servicio
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 px-4 md:px-12 py-4">
        <div className="max-w-7xl mx-auto text-xs text-white/50 text-center md:text-left">
          © {new Date().getFullYear()} EstateFlow Real Estate. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
