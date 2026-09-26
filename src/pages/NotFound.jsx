import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-studio-bg flex items-center justify-center px-4 py-24">
      <div className="max-w-md w-full text-center space-y-6">
        <span className="font-serif text-8xl md:text-9xl text-studio-bronze font-light block">
          404
        </span>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl text-studio-charcoal">Space Not Found</h1>
          <p className="text-sm text-studio-muted font-light leading-relaxed">
            The architectural page you are looking for has been moved, redesigned, or does not exist.
          </p>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-studio-charcoal text-white text-xs uppercase tracking-widest font-semibold hover:bg-studio-bronze transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-studio-border text-studio-charcoal text-xs uppercase tracking-widest font-semibold hover:bg-white transition-colors"
          >
            <span>View Projects</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
