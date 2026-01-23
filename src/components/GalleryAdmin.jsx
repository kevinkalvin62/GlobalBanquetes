import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Loader, Image as ImageIcon, Plus, AlertCircle } from 'lucide-react';
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

  useEffect(() => {
    loadGalleryData();
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

  // Subir imagen a Cloudinary
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
      alert('Por favor configura Cloudinary primero (Cloud Name y Upload Preset)');
      return;
    }

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 10MB)
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
      } else {
        throw new Error('Error al subir imagen');
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Error al subir la imagen. Verifica tu configuración de Cloudinary.');
    } finally {
      setUploading(false);
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
                <p className="text-xs text-blue-700 mt-1">
                  Tu Cloud Name de Cloudinary
                </p>
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
                <p className="text-xs text-blue-700 mt-1">
                  Tu Upload Preset (debe ser "unsigned")
                </p>
              </div>

              <button
                onClick={handleSaveConfig}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Guardar Configuración
              </button>
            </div>

            <div className="mt-4 p-3 bg-white rounded border border-blue-200">
              <p className="text-xs font-semibold text-blue-900 mb-2">📋 Configuración de Cloudinary (solo una vez):</p>
              <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                <li>Ve a <a href="https://cloudinary.com/users/register_free" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">cloudinary.com</a> y crea una cuenta gratis</li>
                <li>En el Dashboard, copia tu "Cloud Name"</li>
                <li>Ve a Settings → Upload → Upload Presets</li>
                <li>Crea un nuevo preset "unsigned" (modo: Unsigned)</li>
                <li>Copia el nombre del preset</li>
                <li>Pega ambos valores arriba y guarda</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-3">
        <label className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
          uploading || !cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
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
              Subir Imagen
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

      {/* Galería de imágenes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            Imágenes en la Galería ({images.length})
          </h3>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={image.thumbnail || image.url}
                    alt={image.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = image.url;
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
        )}
      </div>

      {/* Consejos */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">💡 Ventajas de Cloudinary:</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>✅ Plan gratuito generoso: 25GB de almacenamiento y 25GB de ancho de banda mensual</li>
          <li>✅ Optimización automática de imágenes para carga rápida</li>
          <li>✅ CDN global para cargar imágenes desde el servidor más cercano</li>
          <li>✅ Redimensionamiento automático y thumbnails</li>
          <li>✅ Muy confiable y profesional</li>
        </ul>
      </div>
    </div>
  );
};

export default GalleryAdmin;