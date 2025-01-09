import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import HomeIcon from '@mui/icons-material/Home';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'; // Importing Down Arrow Icon
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import Logo from './assets/LogoTicketspott.png';
import './css/navbar.css';

const pages = [
  { label: 'Home', path: '/', icon: <HomeIcon /> },
  { label: 'Go Down', path: '/about', icon: <ArrowDownwardIcon /> }, // Change label and icon here
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState(location.pathname);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark';
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const fetchAutocomplete = async () => {
    if (searchQuery.trim().length === 0) {
      setAutocompleteResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/auth/search-monuments/${searchQuery}`);
      setAutocompleteResults(response.data.monuments || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching autocomplete results:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => fetchAutocomplete(), 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAutocompleteSelect = (monument) => {
    navigate(`/search?search=${encodeURIComponent(monument.MonumentName)}`);
    setSearchQuery('');
    setAutocompleteResults([]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/museums?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handlePageClick = (path) => {
    setActivePage(path);

    if (path === '/about') {
      window.scrollTo(0, document.documentElement.scrollHeight);
    } else {
      navigate(path);
    }
  };

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <header className={`navbar ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={Logo} alt="Logo" className="logo-img" />
        </Link>

        <form onSubmit={handleSearchSubmit} className="navbar-search">
          <div className="navbar-search-container">
            <input
              type="text"
              placeholder="Search museums..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="navbar-search-input"
            />
            {loading && <div className="loading-indicator">Loading...</div>}
            {autocompleteResults.length > 0 && (
              <ul className="navbar-autocomplete-results">
                {autocompleteResults.map((monument) => (
                  <li
                    key={monument._id}
                    onClick={() => handleAutocompleteSelect(monument)}
                    className="navbar-autocomplete-item"
                  >
                    {monument.MonumentName}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit" className="navbar-search-button">
            <SearchIcon />
          </button>
        </form>

        <nav className="navbar-menu">
          {pages.map((page) => (
            <div
              key={page.label}
              className={`navbar-item-wrapper ${activePage === page.path ? 'active' : ''}`}
              onClick={() => handlePageClick(page.path)}
            >
              <Link to={page.path} className="navbar-item">
                {page.icon}
                <span className="navbar-item-label">{page.label}</span>
              </Link>
            </div>
          ))}

<button onClick={() => navigate('/profile')} className="navbar-profile">
  <AccountCircleIcon sx={{ fontSize: '2.5rem' }} /> {/* Increase icon size */}
</button>


<button onClick={toggleTheme} className="navbar-theme-toggle">
  {darkMode ? '🌙' : '☀️'}
</button>

        </nav>
      </div>
    </header>
  );
};

export default Navbar;
