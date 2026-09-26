import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import CategoryProjects from './pages/CategoryProjects';
import ProjectDetails from './pages/ProjectDetails';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Redirect helper for old admin links to the new standalone admin panel
const AdminPortalRedirect = () => {
  const adminUrl = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174';

  React.useEffect(() => {
    window.location.href = adminUrl;
  }, [adminUrl]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-8 h-8 border-2 border-studio-bronze border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium text-studio-charcoal">Opening Studio Admin Portal...</p>
      <p className="text-xs text-studio-muted mt-1">Admin has moved to its dedicated portal ({adminUrl})</p>
      <a
        href={adminUrl}
        className="mt-5 px-5 py-2.5 bg-studio-charcoal text-white text-xs uppercase tracking-wider font-semibold hover:bg-studio-bronze transition-colors"
      >
        Go to Admin Portal
      </a>
    </div>
  );
};

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-studio-bg text-studio-charcoal selection:bg-studio-bronze selection:text-white">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#181716',
            color: '#FAF8F5',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '13px',
            borderRadius: '0px',
            border: '1px solid #3A3632'
          },
          success: {
            iconTheme: {
              primary: '#B89255',
              secondary: '#181716'
            }
          }
        }}
      />

      <Navbar />

      <div className="flex-grow">
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          
          {/* Dedicated Category Listing Routes */}
          <Route path="/projects/living-room" element={<CategoryProjects />} />
          <Route path="/projects/bedroom" element={<CategoryProjects />} />
          <Route path="/projects/full-home" element={<CategoryProjects />} />
          <Route path="/projects/furniture" element={<CategoryProjects />} />
          <Route path="/projects/:categorySlug" element={<CategoryProjects />} />

          {/* Project Details */}
          <Route path="/project/:id" element={<ProjectDetails />} />

          {/* Contact & Consultation */}
          <Route path="/contact" element={<Contact />} />

          {/* Redirect deprecated AI routes to Home */}
          <Route path="/try-with-ai" element={<Navigate to="/" replace />} />
          <Route path="/ai-interior-designer" element={<Navigate to="/" replace />} />

          {/* Redirect any legacy /admin route to standalone admin panel */}
          <Route path="/admin/*" element={<AdminPortalRedirect />} />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
