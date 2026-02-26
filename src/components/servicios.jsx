import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Utensils, Wine, Cake, Coffee, Users, ChefHat, GlassWater, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Servicios = () => {
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionsRef = useRef({});

  const [serviciosDetallados, setServiciosDetallados] = useState({
    menus: [],
    canapes: [],
    postres: [],
    bebidas: [],
    meseros: [],
    bartenders: [],
    cocina: []
  });

  useEffect(() => {
    const loadServicios = async () => {
      try {
        const docRef = doc(db, 'configuracion', 'servicios-detallados');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setServiciosDetallados(docSnap.data());
        }
      } catch (error) {
        console.error('Error al cargar servicios:', error);
      }
    };
    loadServicios();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
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

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!modalOpen) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [modalOpen, selectedCategoria]);

  // ✅ NUEVO useEffect para cleanup cuando se desmonta el componente
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const cateringServicios = [
    {
      id: 'menus',
      titulo: 'MENÚS',
      descripcion: 'Menús personalizados para tu evento.',
      detalle: 'Incluye entradas, platos principales y postres diseñados especialmente para cada ocasión.',
      imagen: 'https://i.ibb.co/PZq75kY8/42.jpg',
      icono: Utensils,
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      id: 'canapes',
      titulo: 'CANAPÉS',
      descripcion: 'Elegantes bocadillos para eventos.',
      detalle: 'Pequeñas delicias gourmet ideales para cócteles o recepciones.',
      imagen: 'https://i.ibb.co/6Q0TC8T/05.jpg',
      icono: Sparkles,
      gradient: 'from-rose-500 to-pink-500'
    },
    {
      id: 'postres',
      titulo: 'POSTRES',
      descripcion: 'Dulces creaciones para tu evento.',
      detalle: 'Postres que incluyen tartas, cupcakes y más opciones para endulzar tu día.',
      imagen: 'https://i.ibb.co/rfchgMcR/24.jpg',
      icono: Cake,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'bebidas',
      titulo: 'BEBIDAS',
      descripcion: 'Coctelería y bebidas premium.',
      detalle: 'Desde cócteles personalizados hasta barras libres de alta calidad.',
      imagen: 'https://i.ibb.co/LzcMh1GS/35.jpg',
      icono: Wine,
      gradient: 'from-blue-500 to-cyan-500'
    }
  ];

  const personalServicios = [
    {
      id: 'meseros',
      titulo: 'SERVICIOS DE MESEROS',
      descripcion: 'Profesionales atentos para tu evento.',
      detalle: 'Servicio por 5 horas más 2 horas de montaje, ideal para bodas y reuniones.',
      imagen: 'https://i.ibb.co/tpPnbCBm/17.jpg',
      icono: Users,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'bartenders',
      titulo: 'BARTENDERS',
      descripcion: 'Expertos en coctelería para eventos.',
      detalle: 'Servicio por 5 horas más 1 hora de montaje, creando bebidas únicas.',
      imagen: 'https://i.ibb.co/7dgvg5rp/27.jpg',
      icono: GlassWater,
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'cocina',
      titulo: 'PERSONAL DE COCINA',
      descripcion: 'Chefs y ayudantes para tu menú.',
      detalle: 'Profesionales para asegurar la preparación y presentación de cada plato.',
      imagen: 'https://i.ibb.co/PZq75kY8/42.jpg',
      icono: ChefHat,
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const openModal = (categoria) => {
    setSelectedCategoria(categoria);
    setCurrentSlide(0);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCategoria(null);
    document.body.style.overflow = 'auto';
  };

  const nextSlide = () => {
    if (selectedCategoria && serviciosDetallados[selectedCategoria.id]) {
      const maxSlides = serviciosDetallados[selectedCategoria.id].length;
      setCurrentSlide((prev) => (prev + 1) % maxSlides);
    }
  };

  const prevSlide = () => {
    if (selectedCategoria && serviciosDetallados[selectedCategoria.id]) {
      const maxSlides = serviciosDetallados[selectedCategoria.id].length;
      setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
    }
  };

  const ServiceCard = ({ servicio, index }) => {
    const Icono = servicio.icono;

    return (
      <div
        className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-700 cursor-pointer bg-white"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="relative h-48 md:h-64 overflow-hidden">
          <img
            src={servicio.imagen}
            alt={servicio.titulo}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          <div className={`absolute top-3 right-3 md:top-4 md:right-4 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${servicio.gradient} rounded-full flex items-center justify-center shadow-xl`}>
            <Icono className="text-white" size={24} />
          </div>
        </div>

        <div className="p-4 md:p-6">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            {servicio.titulo}
          </h3>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            {servicio.descripcion}
          </p>

          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            {/* Solo mostrar "Ver Servicios" si hay servicios detallados */}
            {serviciosDetallados[servicio.id]?.length > 0 && (
              <button
                onClick={() => openModal(servicio)}
                className={`flex-1 bg-gradient-to-r ${servicio.gradient} text-white py-2.5 md:py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-sm md:text-base`}
              >
                Ver Servicios
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/contacto');
              }}
              className={`flex-1 bg-white border-2 border-gray-300 text-gray-700 py-2.5 md:py-3 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 text-sm md:text-base`}
            >
              Contacto
            </button>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50">

      {/* Floating Particles Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-amber-200/20 to-rose-200/20 animate-float"
            style={{
              width: Math.random() * 80 + 40 + 'px',
              height: Math.random() * 80 + 40 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 10 + 's',
              animationDuration: Math.random() * 20 + 20 + 's'
            }}
          />
        ))}
      </div>

      {/* Header Hero */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://i.ibb.co/tpPnbCBm/17.jpg"
            alt="Servicios Header"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/80"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10 px-4 py-12 md:py-16">
          <div className="inline-block mb-6 md:mb-8 animate-bounce">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 shadow-2xl">
              <Sparkles className="text-amber-300" size={32} />
            </div>
          </div>

          <h1 className="text-4xl md:text-7xl font-bold mb-4 md:mb-6 text-white drop-shadow-2xl">
            Nuestros Servicios
          </h1>
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="h-1 w-24 md:w-32 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full"></div>
          </div>
          <p className="text-lg md:text-2xl text-white/90 drop-shadow-lg font-light max-w-3xl mx-auto px-4">
            Catering profesional y personal especializado para hacer de tu evento una experiencia inolvidable
          </p>
        </div>
      </section>

      {/* Catering Section */}
      <section
        ref={el => sectionsRef.current['catering'] = el}
        className={`py-12 md:py-24 px-4 relative transition-all duration-1000 ${visibleSections['catering'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
              Global Banquetes
            </h2>
            <h3 className="text-2xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
              Catering
            </h3>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-4">
              Ofrecemos una amplia variedad de menús, canapés, postres y bebidas para eventos especiales.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {cateringServicios.map((servicio, idx) => (
              <ServiceCard key={servicio.id} servicio={servicio} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Personal Section */}
      <section
        ref={el => sectionsRef.current['personal'] = el}
        className={`py-12 md:py-24 px-4 relative transition-all duration-1000 ${visibleSections['personal'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h3 className="text-2xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
              Personal para Eventos
            </h3>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-4">
              Profesionales capacitados y experimentados para garantizar el éxito de tu celebración
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {personalServicios.map((servicio, idx) => (
              <ServiceCard key={servicio.id} servicio={servicio} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent)]"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 md:mb-8 animate-bounce">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/40">
              <Coffee className="text-white" size={32} />
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-white drop-shadow-2xl px-4">
            ¿Listo para tu Evento Perfecto?
          </h2>
          <p className="text-lg md:text-2xl mb-8 md:mb-10 text-white/95 drop-shadow-lg font-light px-4">
            Contáctanos y diseñaremos el servicio ideal para tu celebración
          </p>

          <button
            onClick={() => navigate('/contacto')}
            className="group relative bg-white text-amber-600 px-8 md:px-10 py-4 md:py-5 rounded-full text-lg md:text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2 md:gap-3">
              <Sparkles size={20} />
              Solicitar Información
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-rose-50 transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full"></div>
          </button>
        </div>
      </section>

      {/* 🔥 MODAL RESPONSIVE */}
      {modalOpen && selectedCategoria && serviciosDetallados[selectedCategoria.id]?.length > 0 && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center animate-fadeIn"
          onClick={closeModal}
        >
          {/* Close Button Superior */}
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 md:top-4 md:right-4 bg-white hover:bg-gray-100 p-2.5 md:p-3 rounded-full transition-all duration-300 z-50 shadow-2xl"
          >
            <X className="text-gray-800" size={24} />
          </button>

          {/* Previous Button */}
          {serviciosDetallados[selectedCategoria.id].length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm p-2 md:p-4 rounded-full transition-all duration-300 hover:scale-110 z-50 shadow-xl"
            >
              <ChevronLeft className="text-gray-800" size={24} />
            </button>
          )}

          {/* Next Button */}
          {serviciosDetallados[selectedCategoria.id].length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm p-2 md:p-4 rounded-full transition-all duration-300 hover:scale-110 z-50 shadow-xl"
            >
              <ChevronRight className="text-gray-800" size={24} />
            </button>
          )}

          {/* Content Container */}
          <div
            className="w-full h-full md:h-auto md:max-w-4xl md:w-full relative p-3 md:p-4 flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden w-full max-h-[92vh] md:max-h-[85vh] flex flex-col">

              {/* Header */}
              <div className={`bg-gradient-to-r ${selectedCategoria.gradient} p-4 md:p-8 text-white flex-shrink-0`}>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                    {React.createElement(selectedCategoria.icono, { size: 28 })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-3xl font-bold mb-1">{selectedCategoria.titulo}</h2>
                    <p className="text-white/90 text-sm md:text-base line-clamp-2">{selectedCategoria.detalle}</p>
                  </div>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="p-4 md:p-8 overflow-y-auto flex-1">
                {serviciosDetallados[selectedCategoria.id][currentSlide] && (
                  <div className="space-y-4 md:space-y-6 animate-fadeIn">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${selectedCategoria.gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white text-lg md:text-xl font-bold">{currentSlide + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">
                          {serviciosDetallados[selectedCategoria.id][currentSlide].nombre}
                        </h3>
                        <p className="text-gray-600 text-base md:text-lg leading-relaxed whitespace-pre-line">
                          {serviciosDetallados[selectedCategoria.id][currentSlide].descripcion}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-4 md:px-8 py-4 md:py-6 flex items-center justify-between flex-shrink-0 border-t border-gray-200">
                <div className="flex gap-1.5 md:gap-2 overflow-x-auto max-w-[60%] md:max-w-none">
                  {serviciosDetallados[selectedCategoria.id].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`transition-all duration-300 rounded-full flex-shrink-0 ${idx === currentSlide
                        ? 'bg-gradient-to-r ' + selectedCategoria.gradient + ' w-8 md:w-12 h-2 md:h-3'
                        : 'bg-gray-300 w-2 md:w-3 h-2 md:h-3 hover:bg-gray-400'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 font-medium text-sm md:text-base flex-shrink-0 ml-3">
                  {currentSlide + 1} / {serviciosDetallados[selectedCategoria.id].length}
                </span>
              </div>
            </div>
          </div>

          {/* Close Button Inferior - Solo móvil */}
          <button
            onClick={closeModal}
            className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white hover:bg-gray-100 px-6 py-3 rounded-full transition-all duration-300 z-50 shadow-2xl flex items-center gap-2"
          >
            <X className="text-gray-800" size={20} />
            <span className="text-gray-800 font-bold">Cerrar</span>
          </button>

          {/* Navigation hint - Solo desktop */}
          <div className="hidden md:block absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-white/80 text-sm">Usa ← → o ESC para navegar</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-float {
          animation: float ease-in-out infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Servicios;