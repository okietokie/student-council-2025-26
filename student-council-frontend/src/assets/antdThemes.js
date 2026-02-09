// antdThemes.js - For Ant Design
import { theme } from 'antd';

// Font imports (keep these for global styles)
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import '@fontsource/adlam-display/400.css';
import '@fontsource/alkatra/400.css';
import '@fontsource/alkatra/500.css';
import '@fontsource/alkatra/600.css';
import '@fontsource/alkatra/700.css';

// Apply custom fonts globally
const globalFontStyles = `
  :root {
    --font-inter: 'Inter', sans-serif;
    --font-adlam: 'Adlam Display', serif;
    --font-alkatra: 'Alkatra', cursive;
  }
  
  body {
    font-family: var(--font-inter) !important;
  }
  
  h1, h2, h4 {
    font-family: var(--font-adlam) !important;
  }
  
  h3, h5 {
    font-family: var(--font-alkatra) !important;
  }
  
  .ant-btn {
    font-family: var(--font-adlam) !important;
    text-transform: none !important;
  }
`;

// Add global styles to document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = globalFontStyles;
  document.head.appendChild(style);
}

// Helper to lighten/darken colors
const lightenColor = (color, percent) => {
  // Implementation for lightening colors
  return color;
};

const darkenColor = (color, percent) => {
  // Implementation for darkening colors
  return color;
};

// Create Ant Design theme configuration
const createAntdTheme = (isDark, primaryColor, secondaryColor, backgroundColor) => {
  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      // Primary colors
      colorPrimary: primaryColor,
      colorInfo: secondaryColor,
      colorSuccess: '#52c41a',
      colorWarning: '#faad14',
      colorError: '#ff4d4f',
      
      // Background colors
      colorBgBase: backgroundColor,
      colorBgContainer: isDark ? lightenColor(backgroundColor, 0.05) : darkenColor(backgroundColor, 0.02),
      colorBgLayout: backgroundColor,
      
      // Text colors
      colorTextBase: isDark ? '#fff' : '#000',
      colorText: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)',
      colorTextSecondary: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
      
      // Border colors
      colorBorder: isDark ? '#424242' : '#d9d9d9',
      colorBorderSecondary: isDark ? '#303030' : '#f0f0f0',
      
      // Font settings
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      fontSize: 14,
      borderRadius: 8,
      
      // Component-specific
      colorLink: primaryColor,
      colorLinkHover: lightenColor(primaryColor, 0.2),
      colorLinkActive: darkenColor(primaryColor, 0.1),
    },
    components: {
      Button: {
        fontFamily: "'Adlam Display', serif",
        controlHeight: 32,
        controlHeightLG: 40,
        controlHeightSM: 24,
        borderRadius: 8,
        fontSize: 14,
      },
      Typography: {
        fontFamily: "'Inter', sans-serif",
        titleMarginBottom: '0.5em',
        titleMarginTop: '1.2em',
      },
      Card: {
        borderRadiusLG: 12,
        borderRadiusSM: 8,
        boxShadowTertiary: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
      },
      Tooltip: {
        colorBgSpotlight: isDark ? lightenColor(backgroundColor, 0.15) : darkenColor(backgroundColor, 0.05),
        borderRadius: 8,
        fontSize: 12,
        padding: 8,
        boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
      },
      Tag: {
        borderRadiusSM: 4,
        fontSize: 12,
        lineHeight: 1.5,
      },
      // Add more component customizations as needed
    },
  };
};

// Define all themes
const antdThemes = {
  // Council Classic - Professional brown theme
  "leather-dark": createAntdTheme(true, "#8B4513", "#654321", "#2C1810"),
  "council-classic-dark": createAntdTheme(true, "#5D4037", "#212121", "#1A1A1A"),
  "council-classic-light": createAntdTheme(false, "#5D4037", "#8D6E63", "#FAFAFA"),
  
  // Academic Brown - Scholastic theme
  "academic-brown-dark": createAntdTheme(true, "#795548", "#455A64", "#2C3E50"),
  "academic-brown-light": createAntdTheme(false, "#795548", "#90A4AE", "#F5F7FA"),
  
  // Leather & Parchment - Traditional aesthetic
  "leather-light": createAntdTheme(false, "#8B4513", "#DEB887", "#FFF8E1"),
  "midnight-ocean": createAntdTheme(true, "#4ABAF2", "#0277BD", "#001829"),

  // Contrast themes
  "dark-high-contrast": createAntdTheme(true, "#8AB4F8", "#FF8FA3", "#0D0D0D"),
  "dark-medium-contrast": createAntdTheme(true, "#64A2F3", "#E26A6A", "#171717"),
  "light-high-contrast": createAntdTheme(false, "#1565C0", "#C62828", "#FFFFFF"),
  "light-medium-contrast": createAntdTheme(false, "#1E88E5", "#EF5350", "#F5F6FA"),

  // Pastel themes
  "pastel-lavender": createAntdTheme(false, "#AFA3E8", "#D4A5E6", "#F7F2FF"),
  "pastel-mint": createAntdTheme(false, "#7ACFC0", "#48B8A5", "#E6FAF6"),
  "pastel-mauve-rose": createAntdTheme(false, "#F29CB8", "#E16491", "#FBE8F2"),
  "pastel-peach": createAntdTheme(false, "#FF9F7E", "#FF7755", "#FFF4EA"),
  "pastel-vintage": createAntdTheme(false, "#CCBBAF", "#927B6A", "#F6EFEA"),
  "pastel-blush": createAntdTheme(false, "#F6B7C9", "#F28AAE", "#FFF5F9"),

  // Goth themes
  "goth-violet": createAntdTheme(true, "#A98BFF", "#6F3BFF", "#0A0014"),
  "goth-bloodmoon": createAntdTheme(true, "#E84C47", "#8A1111", "#0E0000"),
  "goth-storm": createAntdTheme(true, "#8FA0AC", "#596E79", "#060A10"),

  // Cyber themes
  "cyber-grid": createAntdTheme(true, "#00D2F2", "#009BE6", "#001B26"),
  "cyber-neon": createAntdTheme(true, "#F200C9", "#00F28C", "#050007"),

  // Additional themes
  "sunset-glow": createAntdTheme(false, "#FF7B57", "#FFAE70", "#FFF4E9"),
  "forest-haze": createAntdTheme(false, "#78CC8C", "#43A047", "#E9F6EC"),
  "royal-purple": createAntdTheme(true, "#C88CE0", "#973DB4", "#15001C"),
  "deep-space": createAntdTheme(true, "#8FBDFB", "#495CFF", "#01000D"),
  "rose-blush": createAntdTheme(false, "#F5A3BC", "#D85086", "#FFF2F7"),
  "teal-dream": createAntdTheme(false, "#47B6AC", "#00796B", "#E3F4F3"),
  "warm-sands": createAntdTheme(false, "#FFC273", "#FFA74A", "#FFF8EF"),
  "cool-mint": createAntdTheme(false, "#77DCEC", "#20BFD0", "#E4FAFD"),
  "solar-eclipse": createAntdTheme(true, "#FFBD27", "#FF9500", "#090600"),
  "candy-pastel": createAntdTheme(false, "#FF98C4", "#FF71A4", "#FFF3FB"),
};

// Helper function to get theme names
export const getThemeNames = () => Object.keys(antdThemes);

// Helper function to apply a theme
export const applyTheme = (themeName) => {
  const themeConfig = antdThemes[themeName];
  if (!themeConfig) {
    console.warn(`Theme ${themeName} not found, using default`);
    return antdThemes['council-classic-light'];
  }
  return themeConfig;
};

export default antdThemes;