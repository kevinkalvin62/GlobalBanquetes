import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar.jsx';
import Contacto from './components/contacto.jsx';
import Galeria from './components/galeria.jsx';
import GlobalBanquetes from './components/GlobalBanquetes.jsx';
import Mobiliario from './components/mobiliario.jsx';
import Nosotros from './components/nosotros.jsx';
import Servicios from './components/servicios.jsx';

function App() {
  return (
    <Router>
      <div className="App min-h-screen">
        {/* Navbar fijo en todas las páginas */}
        <Navbar />
        
        {/* Contenido de las páginas */}
        <Routes>
          <Route path="/" element={<GlobalBanquetes />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/servicios" element={<Servicios/>} />
          <Route path="/mobiliario" element={<Mobiliario />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;