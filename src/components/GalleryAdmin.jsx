import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Loader, Image as ImageIcon, Plus, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 12;

  const [uploadProgress, setUploadProgress] = useState({
    total: 0,
    current: 0,
    files: []
  });

  useEffect(() => {
    loadGalleryData();
  }, []);

  useEffect(() => {
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const galleryRef = doc(db, 'configuracion', 'galeria');
      const gallerySnap = await getDoc(galleryRef);

      if (gallerySnap.exists()) {
        const meta = gallerySnap.data();

        // ✅ Nuevo formato con chunks (incluye cuando totalChunks es 1)
        if (meta.totalChunks && meta.totalChunks >= 1) {
          let allImages = [];
          for (let i = 0; i < meta.totalChunks; i++) {
            const chunkRef = doc(db, 'configuracion', `galeria-chunk-${i}`);
            const chunkSnap = await getDoc(chunkRef);
            if (chunkSnap.exists()) {
              allImages = [...allImages, ...(chunkSnap.data().images || [])];
            }
          }
          if (allImages.length > 0) {
            setImagenes(allImages);
          } else {
            loadFallbackImages();
          }
          // ✅ Formato antiguo (compatibilidad)
        } else if (meta.images && meta.images.length > 0) {
          setImagenes(meta.images);
        } else {
          loadFallbackImages();
        }
      } else {
        loadFallbackImages();
      }
    } catch (error) {
      console.error('Error al cargar galería:', error);
      loadFallbackImages();
    } finally {
      setLoading(false);
    }
  };

  // ✅ Guarda dividiendo en chunks de 100 para no superar el límite de 1MB de Firestore
  const saveImages = async (imagesToSave) => {
    try {
      const chunkSize = 100;
      const chunks = [];
      for (let i = 0; i < imagesToSave.length; i += chunkSize) {
        chunks.push(imagesToSave.slice(i, i + chunkSize));
      }

      // Guardar metadata
      const metaRef = doc(db, 'configuracion', 'galeria');
      await setDoc(metaRef, {
        totalImages: imagesToSave.length,
        totalChunks: chunks.length,
        updatedAt: new Date().toISOString()
      });

      // Guardar cada chunk
      for (let i = 0; i < chunks.length; i++) {
        const chunkRef = doc(db, 'configuracion', `galeria-chunk-${i}`);
        await setDoc(chunkRef, { images: chunks[i] });
      }
    } catch (error) {
      console.error('Error al guardar imágenes:', error);
      alert('Error al guardar en Firebase');
    }
  };

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

  // ✅ Subida múltiple
  const handleMultipleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
      alert('Por favor configura Cloudinary primero');
      return;
    }

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) { alert(`${file.name} no es imagen válida`); return false; }
      if (file.size > 10 * 1024 * 1024) { alert(`${file.name} supera 10MB`); return false; }
      return true;
    });

    if (validFiles.length === 0) { event.target.value = ''; return; }

    try {
      setUploading(true);
      setUploadProgress({
        total: validFiles.length,
        current: 0,
        files: validFiles.map(f => ({ name: f.name, status: 'pending' }))
      });

      const uploadedImages = [];

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];

        setUploadProgress(prev => ({
          ...prev,
          current: i,
          files: prev.files.map((f, idx) => idx === i ? { ...f, status: 'uploading' } : f)
        }));

        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', cloudinaryConfig.uploadPreset);

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
            { method: 'POST', body: formData }
          );
          const data = await response.json();

          if (data.secure_url) {
            uploadedImages.push({
              id: data.public_id || `${Date.now()}-${i}`,
              url: data.secure_url,
              thumbnail: data.secure_url.replace('/upload/', '/upload/w_400,h_400,c_fill/'),
              name: file.name,
              createdAt: new Date().toISOString()
            });

            setUploadProgress(prev => ({
              ...prev,
              files: prev.files.map((f, idx) => idx === i ? { ...f, status: 'success' } : f)
            }));
          } else {
            throw new Error('Error al subir imagen');
          }
        } catch (err) {
          console.error(`Error al subir ${file.name}:`, err);
          setUploadProgress(prev => ({
            ...prev,
            files: prev.files.map((f, idx) => idx === i ? { ...f, status: 'error' } : f)
          }));
        }
      }

      if (uploadedImages.length > 0) {
        const updatedImages = [...uploadedImages, ...images];
        setImages(updatedImages);
        await saveImages(updatedImages);

        const failCount = validFiles.length - uploadedImages.length;
        if (failCount > 0) {
          alert(`✓ ${uploadedImages.length} subida(s).\n⚠️ ${failCount} fallaron.`);
        } else {
          alert(`✓ ${uploadedImages.length} imagen(es) subida(s) exitosamente`);
        }
        setCurrentPage(1);
      }

      setTimeout(() => setUploadProgress({ total: 0, current: 0, files: [] }), 2000);
    } catch (error) {
      console.error('Error general:', error);
      alert('Error al subir las imágenes. Verifica tu configuración de Cloudinary.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const addImageByURL = () => {
    const url = prompt('Ingresa la URL de la imagen:');
    if (url) {
      const newImage = {
        id: Date.now().toString(),
        url,
        thumbnail: url,
        name: 'Imagen ' + (images.length + 1),
        createdAt: new Date().toISOString()
      };
      const updatedImages = [newImage, ...images];
      setImages(updatedImages);
      saveImages(updatedImages);
    }
  };

  const deleteImage = async (imageId) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return;
    const updatedImages = images.filter(img => img.id !== imageId);
    setImages(updatedImages);
    await saveImages(updatedImages);
  };

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
        <p className="text-sm text-gray-600">Gestiona las imágenes que se muestran en la galería del sitio</p>
      </div>

      {/* Configuración Cloudinary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-600 mt-1 flex-shrink-0" size={20} />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">Configuración de Cloudinary</h3>
            <p className="text-sm text-blue-800 mb-4">
              Cloudinary es un servicio gratuito para almacenar imágenes. Plan gratuito: 25GB.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-1">Cloud Name</label>
                <input
                  type="text"
                  value={cloudinaryConfig.cloudName}
                  onChange={(e) => setCloudinaryConfig(prev => ({ ...prev, cloudName: e.target.value }))}
                  placeholder="tu-cloud-name"
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-1">Upload Preset</label>
                <input
                  type="text"
                  value={cloudinaryConfig.uploadPreset}
                  onChange={(e) => setCloudinaryConfig(prev => ({ ...prev, uploadPreset: e.target.value }))}
                  placeholder="tu-upload-preset"
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
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
        <label className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 cursor-pointer text-white ${uploading || !cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
          }`}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleMultipleImageUpload}
            disabled={uploading || !cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset}
            className="hidden"
          />
          {uploading ? <><Loader className="animate-spin" size={20} />Subiendo...</> : <><Upload size={20} />Subir Imágenes</>}
        </label>

        <button
          onClick={addImageByURL}
          className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Agregar por URL
        </button>
      </div>

      {/* Progreso de subida */}
      {uploadProgress.total > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-800">
              Subiendo: {uploadProgress.current + 1} / {uploadProgress.total}
            </h4>
            <span className="text-sm text-gray-600">
              {Math.round(((uploadProgress.current + 1) / uploadProgress.total) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((uploadProgress.current + 1) / uploadProgress.total) * 100}%` }}
            />
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {uploadProgress.files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 truncate flex-1">{file.name}</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${file.status === 'success' ? 'bg-green-100 text-green-700' :
                    file.status === 'error' ? 'bg-red-100 text-red-700' :
                      file.status === 'uploading' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                  }`}>
                  {file.status === 'success' ? '✓ Subida' :
                    file.status === 'error' ? '✗ Error' :
                      file.status === 'uploading' ? '⟳ Subiendo...' : '⋯ Pendiente'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid de imágenes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            Imágenes en la Galería ({images.length})
          </h3>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-gray-600">Página {currentPage} de {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
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
            <p className="text-sm text-gray-400">Configura Cloudinary y sube tus primeras imágenes</p>
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
                        e.target.onerror = null; // ✅ Evita loop infinito
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ESin imagen%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-600 truncate">{image.name}</p>
                    <button
                      onClick={() => deleteImage(image.id)}
                      className="mt-2 w-full bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-sm">Primera</button>
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"><ChevronLeft size={20} /></button>
                <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg font-semibold">{currentPage} / {totalPages}</span>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"><ChevronRight size={20} /></button>
                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-sm">Última</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Consejos */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">💡 Consejos:</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>✅ Selecciona múltiples imágenes con Ctrl/Cmd + Click</li>
          <li>✅ Las imágenes se suben una por una para evitar errores</li>
          <li>✅ Verás el progreso en tiempo real</li>
          <li>✅ Tamaño máximo por imagen: 10MB</li>
          <li>✅ Plan gratuito de Cloudinary: 25GB de almacenamiento</li>
        </ul>
      </div>
    </div>
  );
};

export default GalleryAdmin;