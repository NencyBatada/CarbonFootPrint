import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} EcoTrace. Empowering individuals to track and reduce their carbon footprint.</p>
    </footer>
  );
};
