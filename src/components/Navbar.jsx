import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Nosotros', path: '/nosotros' },
    { name: 'Servicios', path: '/servicios' },
    { name: 'Mobiliario', path: '/mobiliario' },
    { name: 'Galería', path: '/galeria' },
    { name: 'Contacto', path: '/contacto' }
  ];

  return (
    <nav 
      className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg transition-all duration-500" 
      style={{ zIndex: 9999 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative w-14 h-14 bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 rounded-full flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                <Sparkles className="text-white" size={26} />
              </div>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
                GLOBAL BANQUETES
              </h1>
              <p className="text-xs text-gray-500 italic">Creando memorias inolvidables</p>
            </div>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1 items-center">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-gray-700 hover:text-amber-600 font-semibold transition-all duration-300 group ${
                    isActive ? 'text-amber-600' : ''
                  }`
                }
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-rose-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-amber-100 transition-all duration-300"
          >
            {isMenuOpen ? <X size={28} className="text-amber-600" /> : <Menu size={28} className="text-amber-600" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-3 px-4 text-gray-700 rounded-xl transition-all duration-300 transform hover:translate-x-2 ${
                    isActive 
                      ? 'bg-gradient-to-r from-amber-100 to-rose-100 text-amber-600 font-bold' 
                      : 'hover:bg-gradient-to-r hover:from-amber-50 hover:to-rose-50 hover:text-amber-600'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;