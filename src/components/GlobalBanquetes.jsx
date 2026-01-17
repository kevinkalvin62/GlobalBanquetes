import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart, Users, Sparkles, Camera, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // ← NUEVO: Para navegación

// 🖼️ CONFIGURACIÓN DE IMÁGENES
const IMAGES = {
  carousel: [
    'https://i.ibb.co/PZq75kY8/42.jpg',
    'https://i.ibb.co/6Q0TC8T/05.jpg',
    'https://i.ibb.co/rfchgMcR/24.jpg'
  ],
  services: {
    eventos: 'https://i.ibb.co/LzcMh1GS/35.jpg',
    banquetes: 'https://i.ibb.co/tpPnbCBm/17.jpg',
    ceremonias: 'https://i.ibb.co/7dgvg5rp/27.jpg'
  }
};

const GlobalBanquetes = () => {
  const navigate = useNavigate(); // ← NUEVO: Hook para navegación
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const sectionsRef = useRef({});

  // Scroll animations
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      Object.keys(sectionsRef.current).forEach(key => {
        const element = sectionsRef.current[key];
        if (element) {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.8;
          setVisibleSections(prev => ({ ...prev, [key]: isVisible }));
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % IMAGES.carousel.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % IMAGES.carousel.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + IMAGES.carousel.length) % IMAGES.carousel.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50">
      
      {/* Floating Particles Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-amber-200/20 to-rose-200/20 animate-float"
            style={{
              width: Math.random() * 100 + 50 + 'px',
              height: Math.random() * 100 + 50 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 10 + 's',
              animationDuration: Math.random() * 20 + 20 + 's'
            }}
          />
        ))}
      </div>

      {/* ❌ ELIMINADO: El Navbar ya no está aquí, ahora está en App.jsx */}

      {/* Hero Carousel */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="relative h-full w-full">
          {IMAGES.carousel.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-all duration-1500 ${
                idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              }`}
            >
              <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-transparent to-rose-900/40"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
          ))}

          {/* Carousel Content */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="text-center text-white max-w-4xl animate-fadeInUp">
              <div className="mb-6 inline-block">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-amber-300 animate-bounce" />
              </div>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-amber-200 via-rose-200 to-orange-200 bg-clip-text text-transparent drop-shadow-2xl">
                  Momentos
                </span>
                <br />
                <span className="drop-shadow-2xl">Inolvidables</span>
              </h2>
              <p className="text-xl md:text-3xl mb-10 drop-shadow-lg text-amber-100 font-light">
                Creamos experiencias que perduran para siempre
              </p>
              {/* ✅ CAMBIADO: onClick con navigate en lugar de href */}
              <button 
                onClick={() => navigate('/servicios')}
                className="group relative bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 hover:from-amber-500 hover:via-orange-500 hover:to-rose-500 text-white px-10 py-5 rounded-full text-lg font-bold shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Camera size={24} />
                  Explorar Servicios
                </span>
                <div className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </div>
          </div>

          {/* Carousel Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 backdrop-blur-md p-4 rounded-full transition-all duration-300 border border-white/20 hover:scale-110 group"
          >
            <ChevronLeft className="text-white group-hover:scale-110 transition-transform" size={32} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 backdrop-blur-md p-4 rounded-full transition-all duration-300 border border-white/20 hover:scale-110 group"
          >
            <ChevronRight className="text-white group-hover:scale-110 transition-transform" size={32} />
          </button>

          {/* Carousel Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
            {IMAGES.carousel.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-500 rounded-full ${
                  idx === currentSlide 
                    ? 'bg-white w-12 h-3 shadow-lg' 
                    : 'bg-white/40 w-3 h-3 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section 
        ref={el => sectionsRef.current['welcome'] = el}
        className={`py-24 px-4 relative overflow-hidden transition-all duration-1000 ${
          visibleSections['welcome'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 animate-bounce">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-rose-400 rounded-full flex items-center justify-center shadow-2xl">
              <Heart className="text-white" size={40} />
            </div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
            Bienvenidos a Global Banquetes
          </h2>
          
          <div className="flex justify-center mb-10">
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full"></div>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed">
            <p className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-amber-100">
              En Global Banquetes, nos dedicamos a crear <span className="font-bold text-amber-600">experiencias únicas</span> para tus momentos más importantes. 
              Desde nuestras humildes raíces hasta convertirnos en una empresa líder en organización de eventos.
            </p>
            <p className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-rose-100">
              Nuestros servicios están diseñados con <span className="font-bold text-rose-600">amor, detalle y profesionalismo</span> 
              para garantizar que cada evento sea inolvidable.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, label: '500+', text: 'Eventos Realizados', color: 'from-blue-400 to-cyan-400' },
              { icon: Heart, label: '100%', text: 'Satisfacción', color: 'from-rose-400 to-pink-400' },
              { icon: Star, label: '25+', text: 'Años de Experiencia', color: 'from-amber-400 to-orange-400' }
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="group cursor-pointer"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`relative bg-gradient-to-br ${stat.color} p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-500 overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="bg-white/30 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-500">
                      <stat.icon className="text-white" size={40} />
                    </div>
                    <h3 className="text-5xl font-bold text-white mb-2">{stat.label}</h3>
                    <p className="text-white/90 font-medium text-lg">{stat.text}</p>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Cards */}
      <section 
        ref={el => sectionsRef.current['services'] = el}
        className={`min-h-screen flex items-center py-24 px-4 relative overflow-hidden transition-all duration-1000 ${
          visibleSections['services'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
              Realiza tu Próxima Memoria
            </h2>
            <p className="text-2xl text-gray-600 font-light">
              con <span className="font-bold text-amber-600">Global Banquetes</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                title: 'Eventos', 
                img: IMAGES.services.eventos, 
                desc: 'Organización completa de eventos memorables',
                path: '/servicios'
              },
              { 
                title: 'Banquetes & Bebidas', 
                img: IMAGES.services.banquetes, 
                desc: 'Gastronomía excepcional para cada ocasión',
                path: '/servicios'
              },
              { 
                title: 'Ceremonias', 
                img: IMAGES.services.ceremonias, 
                desc: 'Ceremonias elegantes y personalizadas',
                path: '/servicios'
              }
            ].map((service, idx) => (
              <div
                key={idx}
                onClick={() => navigate(service.path)}
                className="group relative h-[550px] rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transform hover:-translate-y-3 transition-all duration-700 cursor-pointer"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                {/* Image */}
                <img 
                  src={service.img} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
                
                {/* Subtle Gradient Overlay - Solo en la parte inferior */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
                
                {/* Content - Siempre visible pero más limpio */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="transform transition-transform duration-500">
                    <h3 className="text-4xl font-bold text-white mb-3 drop-shadow-2xl">
                      {service.title}
                    </h3>
                    <p className="text-white/95 text-lg mb-6 drop-shadow-lg">
                      {service.desc}
                    </p>
                    <button className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 px-8 py-3 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                      Ver más
                    </button>
                  </div>
                </div>

                {/* Border on hover */}
                <div className="absolute inset-0 border-4 border-white/0 group-hover:border-white/30 transition-all duration-500 rounded-3xl pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent)]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-8 animate-bounce">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/40">
              <Sparkles className="text-white" size={48} />
            </div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white drop-shadow-2xl">
            ¿Listo para tu Evento Perfecto?
          </h2>
          <p className="text-2xl md:text-3xl mb-12 text-white/95 drop-shadow-lg font-light">
            Contáctanos hoy y hagamos realidad el evento de tus sueños
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {/* ✅ CAMBIADO: navigate en lugar de href */}
            <button 
              onClick={() => navigate('/contacto')}
              className="group relative bg-white text-amber-600 px-10 py-5 rounded-full text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Mail size={24} />
                Solicitar Cotización
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-rose-50 transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full"></div>
            </button>
            
            <button 
              onClick={() => navigate('/contacto')}
              className="group bg-white/20 backdrop-blur-md border-2 border-white text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-white hover:text-amber-600 transition-all duration-300 transform hover:scale-110"
            >
              <span className="flex items-center gap-3">
                <Phone size={24} />
                Llamar Ahora
              </span>
            </button>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 text-white">
            <div className="flex items-center gap-2">
              <Phone className="opacity-80" size={20} />
              <span className="text-lg">+52 222 459 8802</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="opacity-80" size={20} />
              <span className="text-lg">globalbanquetes@gmail.com</span>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float ease-in-out infinite;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default GlobalBanquetes;