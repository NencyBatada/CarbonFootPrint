import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, LayoutDashboard, Calculator, MessageSquare } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar" aria-label="Main navigation">
      <Link to="/" className="nav-brand" aria-label="EcoTrace – go to homepage">
        <Leaf size={24} style={{ color: 'var(--primary)' }} aria-hidden="true" />
        <span>EcoTrace</span>
      </Link>
      <ul className="nav-links" role="list">
        <li>
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            aria-current={isActive('/') ? 'page' : undefined}
          >
            <LayoutDashboard size={18} aria-hidden="true" style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/calculator"
            className={`nav-link ${isActive('/calculator') ? 'active' : ''}`}
            aria-current={isActive('/calculator') ? 'page' : undefined}
          >
            <Calculator size={18} aria-hidden="true" style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Calculator
          </Link>
        </li>
        <li>
          <Link
            to="/assistant"
            className={`nav-link ${isActive('/assistant') ? 'active' : ''}`}
            aria-current={isActive('/assistant') ? 'page' : undefined}
          >
            <MessageSquare size={18} aria-hidden="true" style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Eco-Assistant
          </Link>
        </li>
      </ul>
    </nav>
  );
};
