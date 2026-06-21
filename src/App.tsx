import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FootprintProvider } from './utils/FootprintContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Dashboard } from './pages/Dashboard';
import { Calculator } from './pages/Calculator';
import { Assistant } from './pages/Assistant';

function App() {
  return (
    <FootprintProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/assistant" element={<Assistant />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </FootprintProvider>
  );
}

export default App;
