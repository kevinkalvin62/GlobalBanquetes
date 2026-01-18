import React, { useState, useEffect } from 'react';
import { Save, Eye, Settings, FileText, Mail, Users, Loader, LogOut } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import Login from './Login';

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inicio');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [data, setData] = useState({
    inicio: {
      heroTitulo: 'Momentos',
      heroSubtitulo: 'Inolvidables',
      heroDescripcion: 'Creamos experiencias que perduran para siempre',
      bienvenidaTitulo: 'Bienvenidos a Global Banquetes',
      parrafo1: 'En Global Banquetes, nos dedicamos a crear experiencias únicas para tus momentos más importantes.',
      parrafo2: 'Nuestros servicios están diseñados con amor, detalle y profesionalismo.'
    },
    
    nosotros: {
      titulo: 'Sobre Nosotros',
      descripcion: 'Somos una empresa dedicada a...',
      mision: 'Nuestra misión es...',
      vision: 'Nuestra visión es...'
    },
    
    servicios: [
      {
        id: 1,
        nombre: 'Eventos',
        descripcion: 'Organización completa de eventos memorables',
        icono: '🎉'
      },
      {
        id: 2,
        nombre: 'Banquetes & Bebidas',
        descripcion: 'Gastronomía excepcional para cada ocasión',
        icono: '🍽️'
      },
      {
        id: 3,
        nombre: 'Ceremonias',
        descripcion: 'Ceremonias elegantes y personalizadas',
        icono: '💒'
      }
    ],
    
    contacto: {
      telefono: '+52 222 459 8802',
      email: 'globalbanquetes@gmail.com',
      direccion: 'Puebla, México',
      whatsapp: '5212224598802',
      facebook: '',
      instagram: ''
    }
  });

  // 🔥 Verificar autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Cargar datos desde Firebase
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'configuracion', 'sitio');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data());
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // 🔥 Guardar datos en Firebase
  const handleSave = async () => {
    try {
      setSaving(true);
      const docRef = doc(db, 'configuracion', 'sitio');
      await setDoc(docRef, data);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  // 🔥 Cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Actualizar campo
  const updateField = (section, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Actualizar servicio
  const updateServicio = (id, field, value) => {
    setData(prev => ({
      ...prev,
      servicios: prev.servicios.map(s => 
        s.id === id ? { ...s, [field]: value } : s
      )
    }));
  };

  // Agregar servicio
  const addServicio = () => {
    setData(prev => ({
      ...prev,
      servicios: [
        ...prev.servicios,
        {
          id: Date.now(),
          nombre: 'Nuevo Servicio',
          descripcion: 'Descripción del servicio',
          icono: '⭐'
        }
      ]
    }));
  };

  // Eliminar servicio
  const deleteServicio = (id) => {
    setData(prev => ({
      ...prev,
      servicios: prev.servicios.filter(s => s.id !== id)
    }));
  };

  // Mostrar login si no está autenticado
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin text-amber-600" size={48} />
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={() => {}} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-amber-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Cargando panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - 🔥 AGREGADO pt-20 para bajar los botones */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-amber-600 to-rose-600 text-white p-6 shadow-lg z-40 mt-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings size={32} />
            <div>
              <h1 className="text-2xl font-bold">Panel de Administración</h1>
              <p className="text-amber-100">Global Banquetes • {user.email}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <a 
              href="/" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Eye size={18} />
              Ver Sitio
            </a>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-white text-amber-600 hover:bg-amber-50 px-6 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  Guardando...
                </>
              ) : saved ? (
                <>✓ Guardado</>
              ) : (
                <>
                  <Save size={18} />
                  Guardar Cambios
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <LogOut size={18} />
              Salir
            </button>
          </div>
        </div>
      </div>

      {/* Content - 🔥 AGREGADO pt-44 para que no quede detrás del header */}
      <div className="max-w-7xl mx-auto p-6 pt-44">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-44">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('inicio')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                    activeTab === 'inicio' 
                      ? 'bg-amber-100 text-amber-700 font-semibold' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <FileText size={20} />
                  Inicio
                </button>
                
                <button
                  onClick={() => setActiveTab('nosotros')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                    activeTab === 'nosotros' 
                      ? 'bg-amber-100 text-amber-700 font-semibold' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Users size={20} />
                  Nosotros
                </button>
                
                <button
                  onClick={() => setActiveTab('servicios')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                    activeTab === 'servicios' 
                      ? 'bg-amber-100 text-amber-700 font-semibold' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Settings size={20} />
                  Servicios
                </button>
                
                <button
                  onClick={() => setActiveTab('contacto')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                    activeTab === 'contacto' 
                      ? 'bg-amber-100 text-amber-700 font-semibold' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Mail size={20} />
                  Contacto
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="col-span-9">
            <div className="bg-white rounded-lg shadow-md p-8">
              
              {/* TAB: INICIO */}
              {activeTab === 'inicio' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Página de Inicio</h2>
                  
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-lg text-amber-700">Sección Hero (Carrusel Principal)</h3>
                    <p className="text-sm text-gray-600">Esta es la primera sección que ven tus visitantes</p>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título Principal (Primera línea)
                      </label>
                      <input
                        type="text"
                        value={data.inicio.heroTitulo}
                        onChange={(e) => updateField('inicio', 'heroTitulo', e.target.value)}
                        placeholder="Ej: Momentos"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subtítulo (Segunda línea)
                      </label>
                      <input
                        type="text"
                        value={data.inicio.heroSubtitulo}
                        onChange={(e) => updateField('inicio', 'heroSubtitulo', e.target.value)}
                        placeholder="Ej: Inolvidables"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                      </label>
                      <input
                        type="text"
                        value={data.inicio.heroDescripcion}
                        onChange={(e) => updateField('inicio', 'heroDescripcion', e.target.value)}
                        placeholder="Ej: Creamos experiencias que perduran para siempre"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-lg text-amber-700">Sección Bienvenida</h3>
                    <p className="text-sm text-gray-600">Texto que aparece después del carrusel</p>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título de Bienvenida
                      </label>
                      <input
                        type="text"
                        value={data.inicio.bienvenidaTitulo}
                        onChange={(e) => updateField('inicio', 'bienvenidaTitulo', e.target.value)}
                        placeholder="Ej: Bienvenidos a Global Banquetes"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Párrafo 1
                      </label>
                      <textarea
                        value={data.inicio.parrafo1}
                        onChange={(e) => updateField('inicio', 'parrafo1', e.target.value)}
                        rows={3}
                        placeholder="Describe tu empresa en el primer párrafo..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Párrafo 2
                      </label>
                      <textarea
                        value={data.inicio.parrafo2}
                        onChange={(e) => updateField('inicio', 'parrafo2', e.target.value)}
                        rows={3}
                        placeholder="Agrega más detalles en el segundo párrafo..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: NOSOTROS */}
              {activeTab === 'nosotros' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Sobre Nosotros</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={data.nosotros.titulo}
                      onChange={(e) => updateField('nosotros', 'titulo', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={data.nosotros.descripcion}
                      onChange={(e) => updateField('nosotros', 'descripcion', e.target.value)}
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Misión
                    </label>
                    <textarea
                      value={data.nosotros.mision}
                      onChange={(e) => updateField('nosotros', 'mision', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visión
                    </label>
                    <textarea
                      value={data.nosotros.vision}
                      onChange={(e) => updateField('nosotros', 'vision', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* TAB: SERVICIOS */}
              {activeTab === 'servicios' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Servicios</h2>
                      <p className="text-sm text-gray-600 mt-1">Los primeros 3 servicios se muestran en la página de inicio</p>
                    </div>
                    <button
                      onClick={addServicio}
                      className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      + Agregar Servicio
                    </button>
                  </div>

                  {data.servicios.map((servicio, index) => (
                    <div key={servicio.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">
                          Servicio #{index + 1} {index < 3 && <span className="text-amber-600 text-sm">(se muestra en inicio)</span>}
                        </h3>
                        <button
                          onClick={() => deleteServicio(servicio.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Eliminar
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre del Servicio
                          </label>
                          <input
                            type="text"
                            value={servicio.nombre}
                            onChange={(e) => updateServicio(servicio.id, 'nombre', e.target.value)}
                            placeholder="Ej: Eventos"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Icono (emoji)
                          </label>
                          <input
                            type="text"
                            value={servicio.icono}
                            onChange={(e) => updateServicio(servicio.id, 'icono', e.target.value)}
                            placeholder="🎉"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-2xl"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Descripción
                        </label>
                        <textarea
                          value={servicio.descripcion}
                          onChange={(e) => updateServicio(servicio.id, 'descripcion', e.target.value)}
                          rows={3}
                          placeholder="Describe brevemente este servicio..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB: CONTACTO */}
              {activeTab === 'contacto' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Información de Contacto</h2>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="text"
                        value={data.contacto.telefono}
                        onChange={(e) => updateField('contacto', 'telefono', e.target.value)}
                        placeholder="+52 222 459 8802"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={data.contacto.email}
                        onChange={(e) => updateField('contacto', 'email', e.target.value)}
                        placeholder="contacto@ejemplo.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp (con código de país, sin espacios ni +)
                      </label>
                      <input
                        type="text"
                        value={data.contacto.whatsapp}
                        onChange={(e) => updateField('contacto', 'whatsapp', e.target.value)}
                        placeholder="5212224598802"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Ejemplo: 521 + código de área + número (sin espacios)</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección
                      </label>
                      <input
                        type="text"
                        value={data.contacto.direccion}
                        onChange={(e) => updateField('contacto', 'direccion', e.target.value)}
                        placeholder="Ciudad, Estado"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facebook (URL completa)
                      </label>
                      <input
                        type="text"
                        value={data.contacto.facebook}
                        onChange={(e) => updateField('contacto', 'facebook', e.target.value)}
                        placeholder="https://facebook.com/tupagina"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instagram (URL completa)
                      </label>
                      <input
                        type="text"
                        value={data.contacto.instagram}
                        onChange={(e) => updateField('contacto', 'instagram', e.target.value)}
                        placeholder="https://instagram.com/tuperfil"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;