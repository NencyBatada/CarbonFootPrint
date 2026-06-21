import React from 'react';

export const Footer: React.FC = () => (
  <footer className="footer" role="contentinfo">
    <p>
      &copy; {new Date().getFullYear()} EcoTrace.{' '}
      Empowering individuals to track and reduce their carbon footprint.
    </p>
  </footer>
);
