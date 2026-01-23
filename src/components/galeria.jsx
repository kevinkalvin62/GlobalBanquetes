import React, { useState, useEffect } from 'react';
import { X, Camera, ChevronLeft, ChevronRight, ZoomIn, Loader } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Galeria = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar imágenes desde Firebase al montar el componente
  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      
      // Cargar galería desde Firebase
      const galleryRef = doc(db, 'configuracion', 'galeria');
      const gallerySnap = await getDoc(galleryRef);
      
      if (gallerySnap.exists()) {
        const data = gallerySnap.data();
        if (data.images && data.images.length > 0) {
          setImagenes(data.images);
        } else {
          // Si no hay imágenes en Firebase, cargar las de respaldo
          loadFallbackImages();
        }
      } else {
        // Si no existe el documento, cargar imágenes de respaldo
        loadFallbackImages();
      }
    } catch (error) {
      console.error('Error al cargar galería:', error);
      loadFallbackImages();
    } finally {
      setLoading(false);
    }
  };

  // Imágenes de respaldo (tus URLs originales de ImgBB)
  const loadFallbackImages = () => {
    const fallbackImages = [
      { id: 1, url: 'https://i.ibb.co/S7NGFVcF/40.jpg', name: 'Imagen 40', thumbnail: 'https://i.ibb.co/S7NGFVcF/40.jpg' },
      { id: 2, url: 'https://i.ibb.co/Q3zfKKkr/39.jpg', name: 'Imagen 39', thumbnail: 'https://i.ibb.co/Q3zfKKkr/39.jpg' },
      { id: 3, url: 'https://i.ibb.co/BWygTs1/38.jpg', name: 'Imagen 38', thumbnail: 'https://i.ibb.co/BWygTs1/38.jpg' },
      { id: 4, url: 'https://i.ibb.co/21gt2Ypr/37.jpg', name: 'Imagen 37', thumbnail: 'https://i.ibb.co/21gt2Ypr/37.jpg' },
      { id: 5, url: 'https://i.ibb.co/sJw2qkVY/36.jpg', name: 'Imagen 36', thumbnail: 'https://i.ibb.co/sJw2qkVY/36.jpg' },
      { id: 6, url: 'https://i.ibb.co/fYybGHcM/35.jpg', name: 'Imagen 35', thumbnail: 'https://i.ibb.co/fYybGHcM/35.jpg' },
      { id: 7, url: 'https://i.ibb.co/Y4PB3Hph/34.jpg', name: 'Imagen 34', thumbnail: 'https://i.ibb.co/Y4PB3Hph/34.jpg' },
      { id: 8, url: 'https://i.ibb.co/WNZrQVT8/33.jpg', name: 'Imagen 33', thumbnail: 'https://i.ibb.co/WNZrQVT8/33.jpg' },
      { id: 9, url: 'https://i.ibb.co/svz6SY2r/32.jpg', name: 'Imagen 32', thumbnail: 'https://i.ibb.co/svz6SY2r/32.jpg' },
      { id: 10, url: 'https://i.ibb.co/FLtc1WqY/31.jpg', name: 'Imagen 31', thumbnail: 'https://i.ibb.co/FLtc1WqY/31.jpg' },
      { id: 11, url: 'https://i.ibb.co/tPX9BBkR/30.jpg', name: 'Imagen 30', thumbnail: 'https://i.ibb.co/tPX9BBkR/30.jpg' },
      { id: 12, url: 'https://i.ibb.co/sdG5rcPV/29.jpg', name: 'Imagen 29', thumbnail: 'https://i.ibb.co/sdG5rcPV/29.jpg' },
      { id: 13, url: 'https://i.ibb.co/G4h8Fx3L/28.jpg', name: 'Imagen 28', thumbnail: 'https://i.ibb.co/G4h8Fx3L/28.jpg' },
      { id: 14, url: 'https://i.ibb.co/PvTxTn1W/27.jpg', name: 'Imagen 27', thumbnail: 'https://i.ibb.co/PvTxTn1W/27.jpg' },
      { id: 15, url: 'https://i.ibb.co/bxdwtz5/26.jpg', name: 'Imagen 26', thumbnail: 'https://i.ibb.co/bxdwtz5/26.jpg' },
      { id: 16, url: 'https://i.ibb.co/XxKTVntP/25.jpg', name: 'Imagen 25', thumbnail: 'https://i.ibb.co/XxKTVntP/25.jpg' },
      { id: 17, url: 'https://i.ibb.co/WpPXQFP4/24.jpg', name: 'Imagen 24', thumbnail: 'https://i.ibb.co/WpPXQFP4/24.jpg' },
      { id: 18, url: 'https://i.ibb.co/Y6RCTW6/23.jpg', name: 'Imagen 23', thumbnail: 'https://i.ibb.co/Y6RCTW6/23.jpg' },
      { id: 19, url: 'https://i.ibb.co/4gRmg83r/22.jpg', name: 'Imagen 22', thumbnail: 'https://i.ibb.co/4gRmg83r/22.jpg' },
      { id: 20, url: 'https://i.ibb.co/0pjWbZFW/21.jpg', name: 'Imagen 21', thumbnail: 'https://i.ibb.co/0pjWbZFW/21.jpg' }
      // Agrega el resto de tus imágenes aquí...
    ];
    setImagenes(fallbackImages);
  };

  const handleImageClick = (imagen) => {
  console.log('Imagen seleccionada:', imagen); 
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
  }, [selectedImage, imagenes]);

  // Mostrar loader mientras carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-amber-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600 text-lg">Cargando galería...</p>
        </div>
      </div>
    );
  }

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
          {imagenes.length === 0 ? (
            <div className="text-center py-20">
              <Camera className="mx-auto text-gray-400 mb-4" size={64} />
              <p className="text-gray-500 text-lg">No hay imágenes en la galería</p>
            </div>
          ) : (
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
                    src={imagen.thumbnail || imagen.url} 
                    alt={imagen.name || `Imagen ${idx + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => {
                      // Si falla el thumbnail, usar la URL principal
                      e.target.src = imagen.url;
                    }}
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
          )}
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
<div className="w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
  <img 
    src={selectedImage.url} 
    alt={selectedImage.name || 'Imagen'}
    className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
    onError={(e) => {
      console.error('Error al cargar imagen:', selectedImage);
      e.target.src = selectedImage.thumbnail || selectedImage.url;
    }}
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