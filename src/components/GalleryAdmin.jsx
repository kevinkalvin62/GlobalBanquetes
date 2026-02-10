import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Loader, Image as ImageIcon, Plus, AlertCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const GalleryAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [cloudinaryConfig, setCloudinaryConfig] = useState({
    cloudName: '',
    uploadPreset: ''
  });
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 12; // Mostrar 12 imágenes por página

  // 🔥 NUEVO: Estado para progreso de subida múltiple
  const [uploadProgress, setUploadProgress] = useState({
    total: 0,
    current: 0,
    files: []
  });

  useEffect(() => {
    loadGalleryData();
  }, []);

  // ✅ NUEVO useEffect para cleanup cuando se desmonta el componente
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const loadGalleryData = async () => {
    try {
      setLoading(true);
      
      // Cargar configuración de Cloudinary
      const configRef = doc(db, 'configuracion', 'cloudinary');
      const configSnap = await getDoc(configRef);
      if (configSnap.exists()) {
        setCloudinaryConfig(configSnap.data());
      }

      // Cargar galería
      const galleryRef = doc(db, 'configuracion', 'galeria');
      const gallerySnap = await getDoc(galleryRef);
      if (gallerySnap.exists()) {
        setImages(gallerySnap.data().images || []);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Guardar configuración de Cloudinary
  const handleSaveConfig = async () => {
    try {
      const configRef = doc(db, 'configuracion', 'cloudinary');
      await setDoc(configRef, cloudinaryConfig);
      alert('✓ Configuración guardada correctamente');
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      alert('Error al guardar la configuración');
    }
  };

  // 🔥 NUEVO: Subir múltiples imágenes
  const handleMultipleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
      alert('Por favor configura Cloudinary primero (Cloud Name y Upload Preset)');
      return;
    }

    // Validar archivos
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} no es una imagen válida`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} es muy grande. Máximo 10MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      event.target.value = '';
      return;
    }

    try {
      setUploading(true);
      setUploadProgress({
        total: validFiles.length,
        current: 0,
        files: validFiles.map(f => ({ name: f.name, status: 'pending' }))
      });

      const uploadedImages = [];

      // Subir archivos uno por uno
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        
        // Actualizar progreso
        setUploadProgress(prev => ({
          ...prev,
          current: i,
          files: prev.files.map((f, idx) => 
            idx === i ? { ...f, status: 'uploading' } : f
          )
        }));

        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', cloudinaryConfig.uploadPreset);

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
            {
              method: 'POST',
              body: formData
            }
          );

          const data = await response.json();

          if (data.secure_url) {
            const newImage = {
              id: data.public_id || `${Date.now()}-${i}`,
              url: data.secure_url,
              thumbnail: data.secure_url.replace('/upload/', '/upload/w_400,h_400,c_fill/'),
              name: file.name,
              createdAt: new Date().toISOString()
            };

            uploadedImages.push(newImage);

            // Actualizar estado del archivo
            setUploadProgress(prev => ({
              ...prev,
              files: prev.files.map((f, idx) => 
                idx === i ? { ...f, status: 'success' } : f
              )
            }));
          } else {
            throw new Error('Error al subir imagen');
          }
        } catch (error) {
          console.error(`Error al subir ${file.name}:`, error);
          setUploadProgress(prev => ({
            ...prev,
            files: prev.files.map((f, idx) => 
              idx === i ? { ...f, status: 'error' } : f
            )
          }));
        }
      }

      // Guardar todas las imágenes subidas exitosamente
      if (uploadedImages.length > 0) {
        const updatedImages = [...uploadedImages, ...images];
        setImages(updatedImages);
        await saveImages(updatedImages);
        
        const successCount = uploadedImages.length;
        const failCount = validFiles.length - successCount;
        
        if (failCount > 0) {
          alert(`✓ ${successCount} imagen(es) subida(s) exitosamente.\n⚠️ ${failCount} imagen(es) falló(fallaron).`);
        } else {
          alert(`✓ ${successCount} imagen(es) subida(s) exitosamente`);
        }
        
        setCurrentPage(1); // Volver a la primera página
      }

      // Limpiar progreso después de 2 segundos
      setTimeout(() => {
        setUploadProgress({ total: 0, current: 0, files: [] });
      }, 2000);

    } catch (error) {
      console.error('Error general al subir imágenes:', error);
      alert('Error al subir las imágenes. Verifica tu configuración de Cloudinary.');
    } finally {
      setUploading(false);
      event.target.value = ''; // Limpiar input
    }
  };

  // Subir imagen individual (mantenido por compatibilidad)
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
      alert('Por favor configura Cloudinary primero (Cloud Name y Upload Preset)');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen es muy grande. Máximo 10MB');
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', cloudinaryConfig.uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        const newImage = {
          id: data.public_id || Date.now().toString(),
          url: data.secure_url,
          thumbnail: data.secure_url.replace('/upload/', '/upload/w_400,h_400,c_fill/'),
          name: file.name,
          createdAt: new Date().toISOString()
        };

        const updatedImages = [newImage, ...images];
        setImages(updatedImages);
        await saveImages(updatedImages);
        alert('✓ Imagen subida exitosamente');
        setCurrentPage(1); // Volver a la primera página
      } else {
        throw new Error('Error al subir imagen');
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Error al subir la imagen. Verifica tu configuración de Cloudinary.');
    } finally {
      setUploading(false);
      event.target.value = ''; // Limpiar input
    }
  };

  // Agregar imagen por URL
  const addImageByURL = () => {
    const url = prompt('Ingresa la URL de la imagen:');
    if (url) {
      const newImage = {
        id: Date.now().toString(),
        url: url,
        thumbnail: url,
        name: 'Imagen ' + (images.length + 1),
        createdAt: new Date().toISOString()
      };

      const updatedImages = [newImage, ...images];
      setImages(updatedImages);
      saveImages(updatedImages);
    }
  };

  // Eliminar imagen
  const deleteImage = async (imageId) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen de la galería?')) return;

    const updatedImages = images.filter(img => img.id !== imageId);
    setImages(updatedImages);
    await saveImages(updatedImages);
  };

  // Guardar imágenes en Firebase
  const saveImages = async (imagesToSave) => {
    try {
      const galleryRef = doc(db, 'configuracion', 'galeria');
      await setDoc(galleryRef, { images: imagesToSave });
    } catch (error) {
      console.error('Error al guardar imágenes:', error);
    }
  };

  // Calcular imágenes para la página actual
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);
  const totalPages = Math.ceil(images.length / imagesPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin text-amber-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Galería de Fotos</h2>
        <p className="text-sm text-gray-600">
          Gestiona las imágenes que se muestran en la galería del sitio
        </p>
      </div>

      {/* Configuración de Cloudinary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-600 mt-1 flex-shrink-0" size={20} />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">Configuración de Cloudinary</h3>
            <p className="text-sm text-blue-800 mb-4">
              Cloudinary es un servicio gratuito para almacenar imágenes. Plan gratuito: 25GB de almacenamiento.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-1">
                  Cloud Name
                </label>
                <input
                  type="text"
                  value={cloudinaryConfig.cloudName}
                  onChange={(e) => setCloudinaryConfig(prev => ({ ...prev, cloudName: e.target.value }))}
                  placeholder="tu-cloud-name"
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-900 mb-1">
                  Upload Preset
                </label>
                <input
                  type="text"
                  value={cloudinaryConfig.uploadPreset}
                  onChange={(e) => setCloudinaryConfig(prev => ({ ...prev, uploadPreset: e.target.value }))}
                  placeholder="tu-upload-preset"
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>

              <button
                onClick={handleSaveConfig}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Guardar Configuración
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-3">
        {/* 🔥 NUEVO: Botón para subir múltiples imágenes */}
        <label className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
          uploading || !cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleMultipleImageUpload}
            disabled={uploading || !cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset}
            className="hidden"
          />
          {uploading ? (
            <>
              <Loader className="animate-spin" size={20} />
              Subiendo...
            </>
          ) : (
            <>
              <Upload size={20} />
              Subir Imágenes (Múltiples)
            </>
          )}
        </label>

        <button
          onClick={addImageByURL}
          className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Agregar por URL
        </button>
      </div>

      {/* 🔥 NUEVO: Indicador de progreso de subida */}
      {uploadProgress.total > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-800">
              Subiendo imágenes: {uploadProgress.current + 1} / {uploadProgress.total}
            </h4>
            <span className="text-sm text-gray-600">
              {Math.round(((uploadProgress.current + 1) / uploadProgress.total) * 100)}%
            </span>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((uploadProgress.current + 1) / uploadProgress.total) * 100}%` }}
            ></div>
          </div>

          {/* Lista de archivos */}
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {uploadProgress.files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 truncate flex-1">{file.name}</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                  file.status === 'success' ? 'bg-green-100 text-green-700' :
                  file.status === 'error' ? 'bg-red-100 text-red-700' :
                  file.status === 'uploading' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {file.status === 'success' ? '✓ Subida' :
                   file.status === 'error' ? '✗ Error' :
                   file.status === 'uploading' ? '⟳ Subiendo...' :
                   '⋯ Pendiente'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Galería de imágenes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            Imágenes en la Galería ({images.length})
          </h3>
          
          {/* Paginación superior */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {images.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <ImageIcon className="mx-auto text-gray-400 mb-3" size={48} />
            <p className="text-gray-500 mb-2">No hay imágenes en la galería</p>
            <p className="text-sm text-gray-400">
              Configura Cloudinary y sube tus primeras imágenes
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentImages.map((image) => (
                <div key={image.id} className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={image.thumbnail || image.url}
                      alt={image.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>

                  <div className="p-3">
                    <p className="text-xs text-gray-600 truncate" title={image.name}>
                      {image.name}
                    </p>

                    <button
                      onClick={() => deleteImage(image.id)}
                      className="mt-2 w-full bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </div>

                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Vista previa
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación inferior */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Primera
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg font-semibold">
                  {currentPage} / {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Última
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Consejos */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">💡 Consejos para subida múltiple:</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>✅ Puedes seleccionar múltiples imágenes a la vez (Ctrl/Cmd + Click)</li>
          <li>✅ Las imágenes se suben una por una para evitar errores</li>
          <li>✅ Verás el progreso de cada imagen en tiempo real</li>
          <li>✅ Tamaño máximo por imagen: 10MB</li>
          <li>✅ Plan gratuito de Cloudinary: 25GB de almacenamiento</li>
        </ul>
      </div>
    </div>
  );
};

export default GalleryAdmin;