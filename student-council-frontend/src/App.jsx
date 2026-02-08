// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useEffect, useState } from "react";

import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material"; 

import themes from './assets/theme.js';
// Import new components
import ThemePicker from "./ThemesComponents/ThemePicker.jsx";
import ThemeToggleButton from "./ThemesComponents/ThemeToggleButton.jsx";
import { getThemeNames } from "./utils/themeUtils.js";

import Homepage from "./components/Homepage.jsx";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoggedInNavbar from "./components/logged/LoggedInNavbar.jsx";

import UserHomepage from "./components/logged/UserHomepage.jsx";
import Posts from "./components/logged/Posts.jsx";
import Polls from "./components/logged/Polls.jsx";
import Peers from "./components/logged/Peers.jsx";
import ForbiddenPage from "./components/Forbiddenpage.jsx";
import JoinCouncil from "./components/JoinCouncil.jsx";

// Extract theme names dynamically
const themeNames = getThemeNames(themes);

const getSavedTheme = () => {
  try {
    const saved = localStorage.getItem('themeName');
    return themeNames.includes(saved) ? saved : themeNames[0];
  } catch {
    return themeNames[0];
  }
};

export default function App() {
  const [themeName, setThemeName] = useState(getSavedTheme());
  const [user, setUser] = useState(null);
  const [showThemePicker, setShowThemePicker] = useState(false);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('themeName', themeName);
  }, [themeName]);

  // Apply theme to body
  useEffect(() => {
    const theme = themes[themeName];
    document.body.style.backgroundColor = theme.palette.background.default;
    document.body.style.color = theme.palette.text.primary;
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  }, [themeName]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
      }
    }
  }, []);
  
  const toggleThemePicker = () => {
    setShowThemePicker(!showThemePicker);
  };

  const handleThemeChange = (newThemeName) => {
    setThemeName(newThemeName);

  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showThemePicker && !event.target.closest('.theme-picker') && !event.target.closest('.theme-toggle-button')) {
        setShowThemePicker(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showThemePicker]);

  return (
    <ThemeProvider theme={themes[themeName]}>
      <CssBaseline /> {/* resets default browser styles */}
      
      {/* Main App Content */}
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative' 
      }}>
        <Router>
          <Routes>
            <Route path="/" element={<Homepage /> } />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logged-in/403" element={<ForbiddenPage /> }/>
            <Route path="/join-council" element={<JoinCouncil /> }/>
            <Route path="/logged-in/*" element={<ProtectedRoute><LoggedInNavbar /> </ProtectedRoute> } >
              <Route
                path="home"
                element={<UserHomepage />}
              />
              <Route
                path="posts"
                element={<Posts />}
              />
              <Route
                path="polls"
                element={<Polls />}
              />
              <Route
                path="peers"
                element={<Peers />}
              />
            </Route>

          </Routes>
        </Router>

        {/* Theme Toggle Button */}
        <div className="theme-toggle-button">
          <ThemeToggleButton 
            theme={themes[themeName]}
            onClick={toggleThemePicker}
            isPickerOpen={showThemePicker}
          />
        </div>

        {/* Theme Picker */}
        {showThemePicker && (
          <div className="theme-picker">
            <ThemePicker 
              themes={themes}
              themeNames={themeNames}
              currentThemeName={themeName}
              onThemeChange={handleThemeChange}
              onClose={toggleThemePicker}
            />
          </div>
        )}
      </Box>
    </ThemeProvider>
  );
}