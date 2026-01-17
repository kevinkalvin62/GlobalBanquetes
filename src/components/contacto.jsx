import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Send, Sparkles, MessageCircle, Clock, CheckCircle } from 'lucide-react';

const Contacto = () => {
  const [visibleSections, setVisibleSections] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cell: '',
    reference: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('idle'); // idle, sending, success, error
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      const response = await fetch('https://formspree.io/f/xeoojlop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormStatus('success');
        setFormData({
          name: '',
          email: '',
          cell: '',
          reference: '',
          message: ''
        });
        setTimeout(() => setFormStatus('idle'), 5000);
      } else {
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 5000);
      }
    } catch (error) {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Correo Electrónico',
      info: 'globalbanquetes@gmail.com',
      gradient: 'from-blue-500 to-cyan-500',
      link: 'mailto:globalbanquetes@gmail.com'
    },
    {
      icon: Phone,
      title: 'Teléfono',
      info: '+52 222 459 8802',
      gradient: 'from-green-500 to-emerald-500',
      link: 'tel:+522224598802'
    },
    {
      icon: MapPin,
      title: 'Ubicación',
      info: 'Ciudad de México',
      gradient: 'from-purple-500 to-pink-500',
      link: '#'
    }
  ];

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
      <section className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-rose-400 rounded-full flex items-center justify-center shadow-lg">
              <MessageCircle className="text-white" size={24} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
            Contáctanos
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para hacer realidad el evento de tus sueños
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section 
        ref={el => sectionsRef.current['info'] = el}
        className={`py-8 px-4 transition-all duration-1000 ${
          visibleSections['info'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {contactInfo.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                className="group relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                    <item.icon className="text-white" size={28} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600">
                    {item.info}
                  </p>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section 
        ref={el => sectionsRef.current['contact'] = el}
        className={`py-8 px-4 transition-all duration-1000 ${
          visibleSections['contact'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Side - Information */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-rose-100 px-4 py-2 rounded-full mb-4">
                  <Sparkles className="text-amber-500" size={20} />
                  <span className="font-semibold text-gray-700">¿Por qué elegirnos?</span>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Compromiso con la Excelencia
                </h2>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  En Global Banquetes tenemos el compromiso y el placer de escucharlo y ofrecerle la mejor solución a sus dudas. Por medio de esta sencilla forma de envío usted podrá realizar un primer contacto con nuestra área de atención a clientes.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                {[
                  { icon: Clock, text: 'Respuesta en menos de 24 horas' },
                  { icon: CheckCircle, text: 'Asesoría personalizada gratuita' },
                  { icon: Sparkles, text: 'Cotizaciones sin compromiso' }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="bg-gradient-to-br from-amber-400 to-rose-400 p-2 rounded-lg shadow-md">
                      <feature.icon className="text-white" size={20} />
                    </div>
                    <p className="text-gray-700 pt-1">{feature.text}</p>
                  </div>
                ))}
              </div>

              {/* Additional Contact */}
              <div className="mt-8 p-6 bg-gradient-to-br from-amber-50 to-rose-50 rounded-2xl border border-amber-100">
                <h3 className="font-bold text-gray-800 mb-3">¿Prefieres llamarnos?</h3>
                <a href="tel:+522224598802" className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                  +52 222 459 8802
                </a>
                <p className="text-sm text-gray-600 mt-2">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Send className="text-amber-500" size={28} />
                Envíanos un Mensaje
              </h2>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nombre completo"
                      required
                      className="w-full px-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all duration-300 outline-none"
                    />
                  </div>
                  
                  <div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Correo electrónico"
                      required
                      className="w-full px-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all duration-300 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="tel"
                    id="cell"
                    name="cell"
                    value={formData.cell}
                    onChange={handleInputChange}
                    placeholder="Teléfono / Celular"
                    required
                    className="w-full px-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all duration-300 outline-none"
                  />
                </div>

                <div>
                  <select
                    id="reference"
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all duration-300 outline-none"
                  >
                    <option value="">¿Cómo se enteró de nosotros?</option>
                    <option value="internet">Internet</option>
                    <option value="redes-sociales">Redes Sociales</option>
                    <option value="amigos">Amigos / Familiares</option>
                    <option value="recomendacion">Recomendación</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>

                <div>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    placeholder="Cuéntanos sobre tu evento..."
                    required
                    className="w-full px-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all duration-300 outline-none resize-none"
                  ></textarea>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={formStatus === 'sending'}
                  className={`w-full group relative bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden ${
                    formStatus === 'sending' ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {formStatus === 'sending' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Enviando...
                      </>
                    ) : formStatus === 'success' ? (
                      <>
                        <CheckCircle size={20} />
                        ¡Mensaje Enviado!
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Enviar Mensaje
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>

                {formStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                    Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.
                  </div>
                )}

                {formStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                    ¡Gracias por contactarnos! Te responderemos pronto.
                  </div>
                )}
              </div>
            </div>
          </div>
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

export default Contacto;