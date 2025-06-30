import React from 'react';
import { NavLink } from 'react-router-dom';
import '../App.css';

const Navbar = () => {
  return (
    <header>
      <nav className="navbar">
        <div className="navbar-brand"> Expense Tracker</div>
        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : ''}>
            Dashboard
          </NavLink>
          <NavLink to="/portfolio" className={({ isActive }) => isActive ? 'active-link' : ''}>
            Portfolio
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
