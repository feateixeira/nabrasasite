import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from './components/Header';
import { Menu } from './pages/Menu';
import { Contact } from './pages/Contact';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
      <Toaster 
        position="top-center"
        expand={true}
        richColors
        closeButton
        theme="system"
        duration={5000}
        toastOptions={{
          style: {
            fontSize: '16px',
            padding: '16px',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }
        }}
      />
      <Header />
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/contato" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;