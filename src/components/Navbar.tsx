import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, LayoutDashboard, Calculator, MessageSquare } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Leaf size={24} style={{ color: 'var(--primary)' }} />
        <span>EcoTrace</span>
      </Link>
      <ul className="nav-links">
        <li>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            <LayoutDashboard size={18} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/calculator" className={`nav-link ${isActive('/calculator') ? 'active' : ''}`}>
            <Calculator size={18} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Calculator
          </Link>
        </li>
        <li>
          <Link to="/assistant" className={`nav-link ${isActive('/assistant') ? 'active' : ''}`}>
            <MessageSquare size={18} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Eco-Assistant
          </Link>
        </li>
      </ul>
    </nav>
  );
};
