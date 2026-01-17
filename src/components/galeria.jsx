import React, { useState, useEffect } from 'react';
import { X, Camera, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const Galeria = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Todas las imágenes de tu álbum de ImgBB
  const imagenes = [
    { id: 1, url: 'https://i.ibb.co/S7NGFVcF/40.jpg', titulo: 'Imagen 40' },
    { id: 2, url: 'https://i.ibb.co/Q3zfKKkr/39.jpg', titulo: 'Imagen 39' },
    { id: 3, url: 'https://i.ibb.co/BWygTs1/38.jpg', titulo: 'Imagen 38' },
    { id: 4, url: 'https://i.ibb.co/21gt2Ypr/37.jpg', titulo: 'Imagen 37' },
    { id: 5, url: 'https://i.ibb.co/sJw2qkVY/36.jpg', titulo: 'Imagen 36' },
    { id: 6, url: 'https://i.ibb.co/fYybGHcM/35.jpg', titulo: 'Imagen 35' },
    { id: 7, url: 'https://i.ibb.co/Y4PB3Hph/34.jpg', titulo: 'Imagen 34' },
    { id: 8, url: 'https://i.ibb.co/WNZrQVT8/33.jpg', titulo: 'Imagen 33' },
    { id: 9, url: 'https://i.ibb.co/svz6SY2r/32.jpg', titulo: 'Imagen 32' },
    { id: 10, url: 'https://i.ibb.co/FLtc1WqY/31.jpg', titulo: 'Imagen 31' },
    { id: 11, url: 'https://i.ibb.co/tPX9BBkR/30.jpg', titulo: 'Imagen 30' },
    { id: 12, url: 'https://i.ibb.co/sdG5rcPV/29.jpg', titulo: 'Imagen 29' },
    { id: 13, url: 'https://i.ibb.co/G4h8Fx3L/28.jpg', titulo: 'Imagen 28' },
    { id: 14, url: 'https://i.ibb.co/PvTxTn1W/27.jpg', titulo: 'Imagen 27' },
    { id: 15, url: 'https://i.ibb.co/bxdwtz5/26.jpg', titulo: 'Imagen 26' },
    { id: 16, url: 'https://i.ibb.co/XxKTVntP/25.jpg', titulo: 'Imagen 25' },
    { id: 17, url: 'https://i.ibb.co/WpPXQFP4/24.jpg', titulo: 'Imagen 24' },
    { id: 18, url: 'https://i.ibb.co/Y6RCTW6/23.jpg', titulo: 'Imagen 23' },
    { id: 19, url: 'https://i.ibb.co/4gRmg83r/22.jpg', titulo: 'Imagen 22' },
    { id: 20, url: 'https://i.ibb.co/0pjWbZFW/21.jpg', titulo: 'Imagen 21' },
    { id: 21, url: 'https://i.ibb.co/Y73BPFR4/20.jpg', titulo: 'Imagen 20' },
    { id: 22, url: 'https://i.ibb.co/KpM0fxWJ/19.jpg', titulo: 'Imagen 19' },
    { id: 23, url: 'https://i.ibb.co/B5Cd34Q3/18.jpg', titulo: 'Imagen 18' },
    { id: 24, url: 'https://i.ibb.co/LdhBCpSk/17.jpg', titulo: 'Imagen 17' },
    { id: 25, url: 'https://i.ibb.co/k6vRfjbx/16.jpg', titulo: 'Imagen 16' },
    { id: 26, url: 'https://i.ibb.co/236QBP9L/15.jpg', titulo: 'Imagen 15' },
    { id: 27, url: 'https://i.ibb.co/cmkFXsq/14.jpg', titulo: 'Imagen 14' },
    { id: 28, url: 'https://i.ibb.co/ynsyPjf5/13.jpg', titulo: 'Imagen 13' },
    { id: 29, url: 'https://i.ibb.co/zHDSVK38/12.jpg', titulo: 'Imagen 12' },
    { id: 30, url: 'https://i.ibb.co/0V2Zmmtp/11.jpg', titulo: 'Imagen 11' },
    { id: 31, url: 'https://i.ibb.co/5X3rdtqN/10.jpg', titulo: 'Imagen 10' },
    { id: 32, url: 'https://i.ibb.co/BHcB1fyy/09.jpg', titulo: 'Imagen 09' },
    { id: 33, url: 'https://i.ibb.co/TnLpb1MQ/08.jpg', titulo: 'Imagen 08' },
    { id: 34, url: 'https://i.ibb.co/nLYMMTfp/07.jpg', titulo: 'Imagen 07' },
    { id: 35, url: 'https://i.ibb.co/GdpfVyB8/06.jpg', titulo: 'Imagen 06' },
    { id: 36, url: 'https://i.ibb.co/6Q0TC8T/05.jpg', titulo: 'Imagen 05' },
    { id: 37, url: 'https://i.ibb.co/s6HYjqZ/04.jpg', titulo: 'Imagen 04' },
    { id: 38, url: 'https://i.ibb.co/zKJL7nQ/03.jpg', titulo: 'Imagen 03' },
    { id: 39, url: 'https://i.ibb.co/n5kgQsZ/02.jpg', titulo: 'Imagen 02' },
    { id: 40, url: 'https://i.ibb.co/xFDKcw0/01.jpg', titulo: 'Imagen 01' },
    { id: 41, url: 'https://i.ibb.co/PZq75kY8/42.jpg', titulo: 'Imagen 42' },
    { id: 42, url: 'https://i.ibb.co/2skRjzP/41.jpg', titulo: 'Imagen 41' },
    { id: 43, url: 'https://i.ibb.co/nQnWDqyQ/43.jpg', titulo: 'Imagen 43' },
    { id: 44, url: 'https://i.ibb.co/RMXRDhk/44.jpg', titulo: 'Imagen 44' },
    { id: 45, url: 'https://i.ibb.co/pW9XMb1n/45.jpg', titulo: 'Imagen 45' },
    { id: 46, url: 'https://i.ibb.co/rT3zypd/46.jpg', titulo: 'Imagen 46' },
    { id: 47, url: 'https://i.ibb.co/MRPxjKF/47.jpg', titulo: 'Imagen 47' },
    { id: 48, url: 'https://i.ibb.co/PckKFRVC/48.jpg', titulo: 'Imagen 48' },
    { id: 49, url: 'https://i.ibb.co/NKhRdtJ1/49.jpg', titulo: 'Imagen 49' },
    { id: 50, url: 'https://i.ibb.co/qh45Y36/50.jpg', titulo: 'Imagen 50' },
    { id: 51, url: 'https://i.ibb.co/HW3ypQB/51.jpg', titulo: 'Imagen 51' },
    { id: 52, url: 'https://i.ibb.co/WfryFQb/52.jpg', titulo: 'Imagen 52' },
    { id: 53, url: 'https://i.ibb.co/S6LGnrZC/53.jpg', titulo: 'Imagen 53' },
    { id: 54, url: 'https://i.ibb.co/3YWMWM1/54.jpg', titulo: 'Imagen 54' },
    { id: 55, url: 'https://i.ibb.co/8F6s8s3/55.jpg', titulo: 'Imagen 55' },
    { id: 56, url: 'https://i.ibb.co/DfwYmWQ/56.jpg', titulo: 'Imagen 56' },
    { id: 57, url: 'https://i.ibb.co/p0Zv7K4/57.jpg', titulo: 'Imagen 57' }
  ];

  const handleImageClick = (imagen) => {
    setSelectedImage(imagen);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    const currentIndex = imagenes.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % imagenes.length;
    setSelectedImage(imagenes[nextIndex]);
  };

  const prevImage = () => {
    const currentIndex = imagenes.findIndex(img => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + imagenes.length) % imagenes.length;
    setSelectedImage(imagenes[prevIndex]);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedImage) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage]);

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

      {/* Header Section - Compacto */}
      <section className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-rose-400 rounded-full flex items-center justify-center shadow-lg">
              <Camera className="text-white" size={24} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
            Galería de Momentos
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cada imagen cuenta una historia de dedicación, estilo y perfección
          </p>
          
          {/* Image counter */}
          <div className="mt-4 inline-block bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
            <span className="text-gray-700 font-semibold">{imagenes.length} fotografías</span>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-8 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {imagenes.map((imagen, idx) => (
              <div
                key={imagen.id}
                className="group relative aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-500 cursor-pointer"
                style={{ animationDelay: `${idx * 0.02}s` }}
                onClick={() => handleImageClick(imagen)}
              >
                {/* Image */}
                <img 
                  src={imagen.url} 
                  alt={imagen.titulo} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <ZoomIn className="text-amber-400" size={18} />
                      <span className="text-white/90 text-sm font-medium">Ver imagen</span>
                    </div>
                  </div>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all duration-300 z-50 group"
          >
            <X className="text-white group-hover:rotate-90 transition-transform duration-300" size={28} />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-full transition-all duration-300 hover:scale-110 group"
          >
            <ChevronLeft className="text-white group-hover:-translate-x-1 transition-transform" size={32} />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-full transition-all duration-300 hover:scale-110 group"
          >
            <ChevronRight className="text-white group-hover:translate-x-1 transition-transform" size={32} />
          </button>

          {/* Image */}
          <div className="max-w-6xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedImage.url} 
              alt={selectedImage.titulo}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
            <span className="text-white font-medium">
              {imagenes.findIndex(img => img.id === selectedImage.id) + 1} / {imagenes.length}
            </span>
          </div>

          {/* Navigation hint */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
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
      `}</style>
    </div>
  );
};

export default Galeria;