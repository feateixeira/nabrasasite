import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from './components/Header';
import { Contact } from './pages/Contact';
import { Menu } from './pages/Menu';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
      <Toaster 
        position="top-right"
        expand={false}
        richColors
        closeButton
        theme="system"
      />
      <Header />
      <Routes>
        <Route path="/nabrasa" element={<Menu />} />
      </Routes>
    </div>
  );
}

export default App;