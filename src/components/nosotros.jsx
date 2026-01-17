import React, { useState, useEffect, useRef } from 'react';
import { Heart, Award, Target, Sparkles, TrendingUp, Shield } from 'lucide-react';

const Nosotros = () => {
  const [visibleSections, setVisibleSections] = useState({});
  const sectionsRef = useRef({});

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50">
      
      {/* Floating Particles Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
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
            src="https://i.ibb.co/PZq75kY8/42.jpg" 
            alt="Header Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 via-gray-800/60 to-gray-900/70"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10 py-16">
          <div className="inline-block mb-8">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 shadow-2xl">
              <Sparkles className="text-amber-300" size={40} />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-2xl">
            Acerca de Nosotros
          </h1>
          <div className="flex justify-center mb-6">
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full"></div>
          </div>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg font-light max-w-3xl mx-auto">
            Somos Global Banquetes, expertos en catering con más de 25 años de experiencia
          </p>
        </div>
      </section>

      {/* Historia Section */}
      <section 
        ref={el => sectionsRef.current['historia'] = el}
        className={`py-24 px-4 relative transition-all duration-1000 ${
          visibleSections['historia'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Image Container */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-rose-400 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src="https://i.ibb.co/6Q0TC8T/05.jpg" 
                  alt="Catering Image" 
                  className="w-full h-[500px] object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              </div>
            </div>

            {/* Text Container */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-100 to-rose-100 px-6 py-3 rounded-full mb-6">
                  <Heart className="text-rose-500" size={24} />
                  <span className="font-semibold text-gray-700">Nuestra Historia</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
                  Una Tradición de Excelencia
                </h2>
                
                <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                  <p className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-amber-100">
                    Global Banquetes nació con la visión de ofrecer <span className="font-bold text-amber-600">experiencias gastronómicas únicas y memorables</span>. Fundada hace más de 25 años por un equipo apasionado y comprometido, nuestra empresa ha crecido hasta convertirse en un referente en la industria del catering.
                  </p>
                  <p className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-rose-100">
                    Nuestro enfoque en la <span className="font-bold text-rose-600">excelencia y la innovación</span> nos ha llevado a trabajar con clientes de alto nivel y a participar en eventos de gran prestigio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Vision & Mission Section */}
      <section 
        ref={el => sectionsRef.current['vision'] = el}
        className={`py-24 px-4 transition-all duration-1000 ${
          visibleSections['vision'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Visión */}
            <div className="group relative bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl p-10 border border-purple-100 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <Target className="text-white" size={32} />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Nuestra Visión
                </h2>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  Ser líderes en la creación de <span className="font-bold text-purple-600">experiencias gastronómicas de clase mundial</span>, 
                  destacándonos por nuestra calidad, creatividad y compromiso con nuestros clientes.
                </p>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>

            {/* Misión */}
            <div className="group relative bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl p-10 border border-amber-100 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <TrendingUp className="text-white" size={32} />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Nuestra Misión
                </h2>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  Crear momentos inolvidables a través de <span className="font-bold text-amber-600">servicios de catering excepcionales</span>, 
                  combinando innovación, calidad y un servicio personalizado que supere las expectativas de nuestros clientes.
                </p>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>

          </div>
        </div>
      </section>

      {/* Valores Section */}
      <section 
        ref={el => sectionsRef.current['valores'] = el}
        className={`py-24 px-4 transition-all duration-1000 ${
          visibleSections['valores'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-3 rounded-full mb-6">
              <Award className="text-amber-500" size={24} />
              <span className="font-semibold text-gray-700">Nuestros Valores</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
              Lo Que Nos Define
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                title: 'Pasión por la excelencia', 
                desc: 'Cada detalle cuenta en la búsqueda de la perfección',
                icon: Sparkles,
                gradient: 'from-amber-500 to-orange-500'
              },
              { 
                title: 'Compromiso con la innovación', 
                desc: 'Constantemente evolucionamos para ofrecer lo mejor',
                icon: TrendingUp,
                gradient: 'from-purple-500 to-pink-500'
              },
              { 
                title: 'Respeto y dedicación', 
                desc: 'La satisfacción del cliente es nuestra prioridad',
                icon: Heart,
                gradient: 'from-rose-500 to-red-500'
              },
              { 
                title: 'Calidad garantizada', 
                desc: 'Comprometidos con los más altos estándares',
                icon: Award,
                gradient: 'from-blue-500 to-cyan-500'
              },
              { 
                title: 'Responsabilidad social', 
                desc: 'Impacto positivo en nuestra comunidad',
                icon: Target,
                gradient: 'from-green-500 to-emerald-500'
              },
              { 
                title: 'Confianza y transparencia', 
                desc: 'Relaciones duraderas basadas en la honestidad',
                icon: Shield,
                gradient: 'from-indigo-500 to-purple-500'
              }
            ].map((valor, idx) => (
              <div 
                key={idx}
                className="group relative bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-gray-100 transform hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${valor.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${valor.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                    <valor.icon className="text-white" size={32} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {valor.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {valor.desc}
                  </p>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
            ))}
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

export default Nosotros;