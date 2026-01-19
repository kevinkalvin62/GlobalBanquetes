import React, { useState, useEffect } from 'react';
import { Save, Eye, Settings, FileText, Mail, Users, Loader, LogOut, Plus, Trash2, List, Box } from 'lucide-react';
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

  // Estado para servicios detallados
  const [serviciosDetallados, setServiciosDetallados] = useState({
    menus: [],
    canapes: [],
    postres: [],
    bebidas: [],
    meseros: [],
    bartenders: [],
    cocina: []
  });

  // 🔥 NUEVO: Estado para paquetes de mobiliario
  const [paquetesMobiliario, setPaquetesMobiliario] = useState([]);

  const [selectedCategoria, setSelectedCategoria] = useState('menus');

  const categorias = {
    menus: { nombre: 'Menús', color: 'amber' },
    canapes: { nombre: 'Canapés', color: 'rose' },
    postres: { nombre: 'Postres', color: 'purple' },
    bebidas: { nombre: 'Bebidas', color: 'blue' },
    meseros: { nombre: 'Servicios de Meseros', color: 'green' },
    bartenders: { nombre: 'Bartenders', color: 'cyan' },
    cocina: { nombre: 'Personal de Cocina', color: 'orange' }
  };

  // Verificar autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Cargar datos desde Firebase
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        setLoading(true);

        // Cargar datos generales
        const docRef = doc(db, 'configuracion', 'sitio');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data());
        }

        // Cargar servicios detallados
        const serviciosRef = doc(db, 'configuracion', 'servicios-detallados');
        const serviciosSnap = await getDoc(serviciosRef);
        if (serviciosSnap.exists()) {
          setServiciosDetallados(serviciosSnap.data());
        }

        // 🔥 Cargar paquetes de mobiliario
        const mobiliarioRef = doc(db, 'configuracion', 'paquetes-mobiliario');
        const mobiliarioSnap = await getDoc(mobiliarioRef);
        if (mobiliarioSnap.exists()) {
          const mobData = mobiliarioSnap.data();
          if (mobData.paquetes) {
            setPaquetesMobiliario(mobData.paquetes);
          }
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Guardar datos en Firebase
  const handleSave = async () => {
    try {
      setSaving(true);

      // Guardar datos generales
      const docRef = doc(db, 'configuracion', 'sitio');
      await setDoc(docRef, data);

      // Guardar servicios detallados
      const serviciosRef = doc(db, 'configuracion', 'servicios-detallados');
      await setDoc(serviciosRef, serviciosDetallados);

      // 🔥 Guardar paquetes de mobiliario
      const mobiliarioRef = doc(db, 'configuracion', 'paquetes-mobiliario');
      await setDoc(mobiliarioRef, { paquetes: paquetesMobiliario });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  // Cerrar sesión
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

  // Agregar servicio detallado
  const addServicioDetallado = (categoria) => {
    setServiciosDetallados(prev => ({
      ...prev,
      [categoria]: [
        ...prev[categoria],
        {
          id: Date.now(),
          nombre: 'Nuevo servicio',
          descripcion: 'Descripción del servicio'
        }
      ]
    }));
  };

  // Actualizar servicio detallado
  const updateServicioDetallado = (categoria, id, field, value) => {
    setServiciosDetallados(prev => ({
      ...prev,
      [categoria]: prev[categoria].map(s =>
        s.id === id ? { ...s, [field]: value } : s
      )
    }));
  };

  // Eliminar servicio detallado
  const deleteServicioDetallado = (categoria, id) => {
    setServiciosDetallados(prev => ({
      ...prev,
      [categoria]: prev[categoria].filter(s => s.id !== id)
    }));
  };

  // Mover servicio detallado
  const moveServicioDetallado = (categoria, index, direction) => {
    const newServicios = [...serviciosDetallados[categoria]];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newServicios.length) return;

    [newServicios[index], newServicios[newIndex]] = [newServicios[newIndex], newServicios[index]];

    setServiciosDetallados(prev => ({
      ...prev,
      [categoria]: newServicios
    }));
  };

  // 🔥 NUEVO: Agregar paquete de mobiliario
const addPaquete = () => {
  setPaquetesMobiliario(prev => [
    ...prev,
    {
      id: Date.now(),
      nombre: 'Nuevo Paquete',
      precio: 'Consultar',  // ← Cambiado de '$0' a 'Consultar'
      imagen: 'https://i.ibb.co/rfchgMcR/24.jpg',
      descripcion: 'Descripción del paquete',
      caracteristicas: ['Característica 1', 'Característica 2'],
      destacado: false,
      gradient: 'from-amber-500 to-orange-500',
      badge: ''
    }
  ]);
};

  // 🔥 NUEVO: Actualizar paquete
  const updatePaquete = (id, field, value) => {
    setPaquetesMobiliario(prev =>
      prev.map(p => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // 🔥 NUEVO: Eliminar paquete
  const deletePaquete = (id) => {
    setPaquetesMobiliario(prev => prev.filter(p => p.id !== id));
  };

  // 🔥 NUEVO: Agregar característica a paquete
  const addCaracteristica = (paqueteId) => {
    setPaquetesMobiliario(prev =>
      prev.map(p =>
        p.id === paqueteId
          ? { ...p, caracteristicas: [...p.caracteristicas, 'Nueva característica'] }
          : p
      )
    );
  };

  // 🔥 NUEVO: Actualizar característica
  const updateCaracteristica = (paqueteId, index, value) => {
    setPaquetesMobiliario(prev =>
      prev.map(p =>
        p.id === paqueteId
          ? {
            ...p,
            caracteristicas: p.caracteristicas.map((c, i) =>
              i === index ? value : c
            )
          }
          : p
      )
    );
  };

  // 🔥 NUEVO: Eliminar característica
  const deleteCaracteristica = (paqueteId, index) => {
    setPaquetesMobiliario(prev =>
      prev.map(p =>
        p.id === paqueteId
          ? {
            ...p,
            caracteristicas: p.caracteristicas.filter((_, i) => i !== index)
          }
          : p
      )
    );
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
    return <Login onLoginSuccess={() => { }} />;
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
      {/* Header */}
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

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6 pt-44">
        <div className="grid grid-cols-12 gap-6">

          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-44">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('inicio')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'inicio'
                    ? 'bg-amber-100 text-amber-700 font-semibold'
                    : 'hover:bg-gray-100'
                    }`}
                >
                  <FileText size={20} />
                  Inicio
                </button>

                <button
                  onClick={() => setActiveTab('nosotros')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'nosotros'
                    ? 'bg-amber-100 text-amber-700 font-semibold'
                    : 'hover:bg-gray-100'
                    }`}
                >
                  <Users size={20} />
                  Nosotros
                </button>

                <button
                  onClick={() => setActiveTab('servicios')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'servicios'
                    ? 'bg-amber-100 text-amber-700 font-semibold'
                    : 'hover:bg-gray-100'
                    }`}
                >
                  <Settings size={20} />
                  Servicios
                </button>

                <button
                  onClick={() => setActiveTab('servicios-detallados')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'servicios-detallados'
                    ? 'bg-amber-100 text-amber-700 font-semibold'
                    : 'hover:bg-gray-100'
                    }`}
                >
                  <List size={20} />
                  Servicios Detallados
                </button>

                {/* 🔥 NUEVO TAB */}
                <button
                  onClick={() => setActiveTab('mobiliario')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'mobiliario'
                    ? 'bg-amber-100 text-amber-700 font-semibold'
                    : 'hover:bg-gray-100'
                    }`}
                >
                  <Box size={20} />
                  Paquetes Mobiliario
                </button>

                <button
                  onClick={() => setActiveTab('contacto')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'contacto'
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

              {/* TAB: SERVICIOS DETALLADOS */}
              {activeTab === 'servicios-detallados' && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Servicios Detallados</h2>
                    <p className="text-sm text-gray-600">Estos servicios se mostrarán en el modal cuando los usuarios hagan clic en "Ver Servicios"</p>
                  </div>
                  {/* Selector de categoría */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {Object.entries(categorias).map(([key, cat]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedCategoria(key)}
                        className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${selectedCategoria === key
                            ? `bg-${cat.color}-100 text-${cat.color}-700 ring-2 ring-${cat.color}-500`
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {cat.nombre} ({serviciosDetallados[key]?.length || 0})
                      </button>
                    ))}
                  </div>

                  {/* Lista de servicios de la categoría seleccionada */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-800">
                        {categorias[selectedCategoria].nombre}
                      </h3>
                      <button
                        onClick={() => addServicioDetallado(selectedCategoria)}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
                      >
                        <Plus size={18} />
                        Agregar
                      </button>
                    </div>

                    {serviciosDetallados[selectedCategoria]?.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <p className="text-gray-500">No hay servicios en esta categoría</p>
                        <button
                          onClick={() => addServicioDetallado(selectedCategoria)}
                          className="mt-4 text-amber-600 hover:text-amber-700 font-semibold"
                        >
                          + Agregar el primero
                        </button>
                      </div>
                    ) : (
                      serviciosDetallados[selectedCategoria]?.map((servicio, index) => (
                        <div key={servicio.id} className="border border-gray-200 rounded-lg p-6 space-y-4 bg-white">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                              <h4 className="font-semibold text-gray-800">Servicio</h4>
                            </div>
                            <div className="flex items-center gap-2">
                              {/* Botones de orden */}
                              <button
                                onClick={() => moveServicioDetallado(selectedCategoria, index, 'up')}
                                disabled={index === 0}
                                className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Mover arriba"
                              >
                                ↑
                              </button>
                              <button
                                onClick={() => moveServicioDetallado(selectedCategoria, index, 'down')}
                                disabled={index === serviciosDetallados[selectedCategoria].length - 1}
                                className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Mover abajo"
                              >
                                ↓
                              </button>
                              <button
                                onClick={() => deleteServicioDetallado(selectedCategoria, servicio.id)}
                                className="p-2 text-red-600 hover:text-red-700"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nombre del Servicio
                            </label>
                            <input
                              type="text"
                              value={servicio.nombre}
                              onChange={(e) => updateServicioDetallado(selectedCategoria, servicio.id, 'nombre', e.target.value)}
                              placeholder="Ej: Menú Mexicano Tradicional"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Descripción Detallada
                            </label>
                            <textarea
                              value={servicio.descripcion}
                              onChange={(e) => updateServicioDetallado(selectedCategoria, servicio.id, 'descripcion', e.target.value)}
                              rows={4}
                              placeholder="Describe en detalle este servicio. Puedes usar saltos de línea para organizar mejor el contenido..."
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Tip: Presiona Enter para crear saltos de línea y organizar mejor tu descripción
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 🔥 NUEVO TAB: MOBILIARIO */}
              {activeTab === 'mobiliario' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Paquetes de Mobiliario</h2>
                      <p className="text-sm text-gray-600 mt-1">Gestiona los paquetes que se muestran en la página de mobiliario</p>
                    </div>
                    <button
                      onClick={addPaquete}
                      className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Agregar Paquete
                    </button>
                  </div>

                  {paquetesMobiliario.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <p className="text-gray-500">No hay paquetes creados</p>
                      <button
                        onClick={addPaquete}
                        className="mt-4 text-amber-600 hover:text-amber-700 font-semibold"
                      >
                        + Crear el primero
                      </button>
                    </div>
                  ) : (
                    paquetesMobiliario.map((paquete, index) => (
                      <div key={paquete.id} className="border border-gray-200 rounded-lg p-6 space-y-4 bg-white">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-800">Paquete #{index + 1}</h3>
                          <button
                            onClick={() => deletePaquete(paquete.id)}
                            className="text-red-600 hover:text-red-700 flex items-center gap-2"
                          >
                            <Trash2 size={18} />
                            Eliminar
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nombre del Paquete
                            </label>
                            <input
                              type="text"
                              value={paquete.nombre}
                              onChange={(e) => updatePaquete(paquete.id, 'nombre', e.target.value)}
                              placeholder="Ej: Paquete Vintage Top"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Precio
                            </label>
                            <input
                              type="text"
                              value={paquete.precio}
                              onChange={(e) => updatePaquete(paquete.id, 'precio', e.target.value)}
                              placeholder="Ej: $21,915"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción
                          </label>
                          <textarea
                            value={paquete.descripcion}
                            onChange={(e) => updatePaquete(paquete.id, 'descripcion', e.target.value)}
                            rows={2}
                            placeholder="Breve descripción del paquete"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL de la Imagen
                          </label>
                          <input
                            type="text"
                            value={paquete.imagen}
                            onChange={(e) => updatePaquete(paquete.id, 'imagen', e.target.value)}
                            placeholder="https://i.ibb.co/..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                          {paquete.imagen && (
                            <img src={paquete.imagen} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Badge (opcional)
                            </label>
                            <input
                              type="text"
                              value={paquete.badge}
                              onChange={(e) => updatePaquete(paquete.id, 'badge', e.target.value)}
                              placeholder="Ej: Más Popular"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Gradiente
                            </label>
                            <select
                              value={paquete.gradient}
                              onChange={(e) => updatePaquete(paquete.id, 'gradient', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            >
                              <option value="from-purple-500 to-pink-500">Púrpura a Rosa</option>
                              <option value="from-amber-500 to-orange-500">Ámbar a Naranja</option>
                              <option value="from-rose-500 to-red-500">Rosa a Rojo</option>
                              <option value="from-blue-500 to-cyan-500">Azul a Cian</option>
                              <option value="from-green-500 to-emerald-500">Verde a Esmeralda</option>
                            </select>
                          </div>

                          <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mt-8">
                              <input
                                type="checkbox"
                                checked={paquete.destacado}
                                onChange={(e) => updatePaquete(paquete.id, 'destacado', e.target.checked)}
                                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                              />
                              Paquete Destacado
                            </label>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                              Características Incluidas
                            </label>
                            <button
                              onClick={() => addCaracteristica(paquete.id)}
                              className="text-amber-600 hover:text-amber-700 text-sm font-semibold flex items-center gap-1"
                            >
                              <Plus size={16} />
                              Agregar
                            </button>
                          </div>
                          <div className="space-y-2">
                            {paquete.caracteristicas?.map((caracteristica, idx) => (
                              <div key={idx} className="flex gap-2">
                                <input
                                  type="text"
                                  value={caracteristica}
                                  onChange={(e) => updateCaracteristica(paquete.id, idx, e.target.value)}
                                  placeholder="Característica del paquete"
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                                <button
                                  onClick={() => deleteCaracteristica(paquete.id, idx)}
                                  className="p-2 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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