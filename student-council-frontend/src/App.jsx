// App.jsx - Updated with Ant Design themes
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from 'antd';

// Import Ant Design themes
import antdThemes, { applyTheme } from './assets/antdThemes.js';

// Ant Design CSS
import 'antd/dist/reset.css';

// Your components
import ThemePicker from "./ThemesComponents/ThemePicker.jsx";
import ThemeToggleButton from "./ThemesComponents/ThemeToggleButton.jsx";



import Homepage from "./components/Homepage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoggedInNavbar from "./components/logged/LoggedInNavbar.jsx";

import UserHomepage from "./components/logged/UserHomepage.jsx";
import Posts from "./components/logged/Posts.jsx";
import Polls from "./components/logged/Polls.jsx";
import Peers from "./components/logged/Peers.jsx";
import ForbiddenPage from "./components/Forbiddenpage.jsx";
import JoinCouncil from "./components/JoinCouncil.jsx";
import SignupLogin from "./components/SignupLogin.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('council-classic-light');

  useEffect(() => {
    // Load user
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
      }
    }

    // Load theme preference
    const savedTheme = localStorage.getItem("selectedTheme") || 'council-classic-light';
    setCurrentTheme(savedTheme);
  }, []);

  const handleThemeChange = (themeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem("selectedTheme", themeName);
  };

  const toggleThemePicker = () => {
    setShowThemePicker(!showThemePicker);
  };

  // Get all theme names for the picker
  const themeNames = Object.keys(antdThemes);

  return (
    <ConfigProvider theme={applyTheme(currentTheme)}>
      <div className="app-container">
        <Router>
          <Routes>
            <Route path="/" element={<Homepage /> } />
            <Route path="/auth" element={<SignupLogin />} />
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
            <Route path="403" element={<ForbiddenPage /> }/>


          </Routes>
        </Router>

        {/* Theme Toggle Button
        <ThemeToggleButton
          onClick={toggleThemePicker}
          isPickerOpen={showThemePicker}
          currentThemeName={currentTheme}
        /> */}

        {/* Theme Picker */}
        {showThemePicker && (
          <ThemePicker
            themeNames={themeNames}
            currentThemeName={currentTheme}
            onThemeChange={handleThemeChange}
            onClose={toggleThemePicker}
          />
        )}
      </div>
    </ConfigProvider>
  );
}