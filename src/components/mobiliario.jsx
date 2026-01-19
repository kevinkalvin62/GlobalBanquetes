import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, Star, TrendingUp, Package, ChevronRight } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Mobiliario = () => {
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState({});
  const [selectedPackage, setSelectedPackage] = useState(null);
  const sectionsRef = useRef({});

  // 🔥 Estado para paquetes desde Firebase
  const [paquetes, setPaquetes] = useState([
    {
      id: 1,
      nombre: 'Paquete Vintage Top T1',
      precio: '$21,915',
      imagen: 'https://i.ibb.co/rfchgMcR/24.jpg',
      descripcion: 'La elegancia clásica para tu evento especial',
      caracteristicas: [
        'Mesa vintage con detalles especiales',
        'Cubiertos y mantelería premium',
        'Incluye decoración y flores',
        'Vajilla de porcelana fina',
        'Cristalería exclusiva',
        'Servilletas de tela bordadas'
      ],
      destacado: true,
      gradient: 'from-purple-500 to-pink-500',
      badge: 'Más Popular'
    },
    {
      id: 2,
      nombre: 'Paquete Vintage Top',
      precio: 'Consultar',
      imagen: 'https://i.ibb.co/7dgvg5rp/27.jpg',
      descripcion: 'Sofisticación y estilo en cada detalle',
      caracteristicas: [
        'Mesa vintage con decoración',
        'Servicios premium incluidos',
        'Decoración floral personalizada',
        'Cubiertos de acero inoxidable',
        'Mantelería de alta calidad',
        'Centro de mesa elegante'
      ],
      destacado: false,
      gradient: 'from-amber-500 to-orange-500',
      badge: 'Recomendado'
    },
    {
      id: 3,
      nombre: 'Paquete Tradicional',
      precio: 'Desde $14,049',
      imagen: 'https://i.ibb.co/LzcMh1GS/35.jpg',
      descripcion: 'Estilo clásico con calidez y tradición',
      caracteristicas: [
        'Mesa y sillas de estilo rústico',
        'Mantelería y vajilla premium',
        'Decoración floral básica',
        'Cubiertos estándar de calidad',
        'Cristalería funcional',
        'Servilletas de papel premium'
      ],
      destacado: false,
      gradient: 'from-rose-500 to-red-500',
      badge: 'Mejor Precio'
    }
  ]);

  // 🔥 Cargar paquetes desde Firebase
  useEffect(() => {
    const loadPaquetes = async () => {
      try {
        const docRef = doc(db, 'configuracion', 'paquetes-mobiliario');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.paquetes && data.paquetes.length > 0) {
            setPaquetes(data.paquetes);
          }
        }
      } catch (error) {
        console.error('Error al cargar paquetes:', error);
      }
    };

    loadPaquetes();
  }, []);

  // Scroll animations
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

  const categorias = [
    {
      nombre: 'Mesas',
      icono: Package,
      descripcion: 'Variedad de estilos',
      gradient: 'from-blue-400 to-cyan-400'
    },
    {
      nombre: 'Sillas',
      icono: Star,
      descripcion: 'Comfort y elegancia',
      gradient: 'from-purple-400 to-pink-400'
    },
    {
      nombre: 'Mantelería',
      icono: Sparkles,
      descripcion: 'Textiles de calidad',
      gradient: 'from-amber-400 to-orange-400'
    },
    {
      nombre: 'Vajilla',
      icono: TrendingUp,
      descripcion: 'Diseños exclusivos',
      gradient: 'from-rose-400 to-red-400'
    }
  ];

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

      {/* Header Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://i.ibb.co/tpPnbCBm/17.jpg" 
            alt="Header Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/80"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10 py-16">
          <div className="inline-block mb-8">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 shadow-2xl">
              <Package className="text-amber-300" size={40} />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-2xl">
            Nuestros Paquetes
          </h1>
          <div className="flex justify-center mb-6">
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full"></div>
          </div>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg font-light max-w-3xl mx-auto">
            Mobiliario y decoración de primera calidad para tu evento perfecto
          </p>
        </div>
      </section>

      {/* Categorías Quick View */}
      <section 
        ref={el => sectionsRef.current['categorias'] = el}
        className={`py-16 px-4 relative transition-all duration-1000 ${
          visibleSections['categorias'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categorias.map((categoria, idx) => (
              <div
                key={idx}
                className="group cursor-pointer"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`relative bg-gradient-to-br ${categoria.gradient} p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  
                  <div className="relative z-10 text-center">
                    <div className="bg-white/30 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform duration-500">
                      <categoria.icono className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{categoria.nombre}</h3>
                    <p className="text-white/80 text-sm">{categoria.descripcion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Paquetes Section */}
      <section 
        ref={el => sectionsRef.current['paquetes'] = el}
        className={`py-16 px-4 relative transition-all duration-1000 ${
          visibleSections['paquetes'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
              Paquetes Disponibles
            </h2>
            <p className="text-xl text-gray-600">
              Elige el paquete perfecto para tu celebración
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paquetes.map((paquete, idx) => (
              <div
                key={paquete.id}
                className={`group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-700 cursor-pointer ${
                  paquete.destacado ? 'md:scale-105' : ''
                }`}
                style={{ animationDelay: `${idx * 0.15}s` }}
                onClick={() => setSelectedPackage(paquete.id === selectedPackage ? null : paquete.id)}
              >
                {/* Badge */}
                {paquete.badge && (
                  <div className={`absolute top-4 right-4 z-20 bg-gradient-to-r ${paquete.gradient} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}>
                    {paquete.badge}
                  </div>
                )}

                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={paquete.imagen} 
                    alt={paquete.nombre} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="bg-white/90 backdrop-blur-sm p-6">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {paquete.nombre}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {paquete.descripcion}
                    </p>
                    <div className="flex justify-center">
                      <div className={`inline-block bg-gradient-to-r ${paquete.gradient} text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg`}>
                        {paquete.precio}
                      </div>
                    </div>
                  </div>

                  {/* Características */}
                  <div className={`space-y-2 transition-all duration-500 ${
                    selectedPackage === paquete.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}>
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Sparkles size={18} className="text-amber-500" />
                        Incluye:
                      </h4>
                      <ul className="space-y-2">
                        {paquete.caracteristicas?.map((caracteristica, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <Check size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{caracteristica}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Ver más button */}
                  <button 
                    className={`w-full mt-4 bg-gradient-to-r ${paquete.gradient} text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}
                  >
                    {selectedPackage === paquete.id ? 'Ver menos' : 'Ver detalles'}
                    <ChevronRight size={20} className={`transform transition-transform ${selectedPackage === paquete.id ? 'rotate-90' : ''}`} />
                  </button>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent)]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-8">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/40">
              <Sparkles className="text-white" size={40} />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-2xl">
            ¿Necesitas un Paquete Personalizado?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-white/95 drop-shadow-lg font-light">
            Contáctanos y crearemos el paquete perfecto para tu evento
          </p>
          
          <button 
            onClick={() => navigate('/contacto')}
            className="group relative bg-white text-amber-600 px-10 py-5 rounded-full text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Package size={24} />
              Solicitar Cotización
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-rose-50 transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full"></div>
          </button>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Mobiliario;