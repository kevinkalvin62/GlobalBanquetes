import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar.jsx';
import Contacto from './components/contacto.jsx';
import Galeria from './components/galeria.jsx';
import GlobalBanquetes from './components/GlobalBanquetes.jsx';
import Mobiliario from './components/mobiliario.jsx';
import Nosotros from './components/nosotros.jsx';
import Servicios from './components/servicios.jsx';
import ScrollToTop from './components/ScrollToTop.jsx'; 
import AdminPanel from './components/AdminPanel.jsx';

function App() {
  return (
    <Router>
      <ScrollToTop /> 
      <div className="App min-h-screen">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<GlobalBanquetes />} />
          <Route path="/admin" element={<AdminPanel />} />
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