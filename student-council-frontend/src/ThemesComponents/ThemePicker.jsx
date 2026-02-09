// Components/ThemesComponents/ThemePicker.jsx
import { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  Button, 
  Tooltip, 
  Tag, 
  Divider, 
  Space, 
  Typography, 
  List,
  Badge,
  Avatar
} from 'antd';

// Use simple icons or emojis
const { Text, Title } = Typography;

// Function to format theme names prettily
const formatThemeName = (name) => {
  return name
    .replace(/-/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/Hc/g, "High Contrast")
    .replace(/Mc/g, "Medium Contrast");
};

const ThemePicker = ({ 
  themeNames, 
  currentThemeName, 
  onThemeChange, 
  onClose 
}) => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);
  const pickerRef = useRef(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setVisible(false);
        setTimeout(onClose, 300);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleRandomTheme = () => {
    const availableThemes = themeNames.filter(name => name !== currentThemeName);
    const randomIndex = Math.floor(Math.random() * availableThemes.length);
    onThemeChange(availableThemes[randomIndex]);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const getThemeColors = (themeName) => {
    // Color mapping for theme previews
    const colorMap = {
      'leather-dark': { primary: '#8B4513', secondary: '#654321' },
      'council-classic-dark': { primary: '#5D4037', secondary: '#212121' },
      'council-classic-light': { primary: '#5D4037', secondary: '#8D6E63' },
      'academic-brown-dark': { primary: '#795548', secondary: '#455A64' },
      'academic-brown-light': { primary: '#795548', secondary: '#90A4AE' },
      'leather-light': { primary: '#8B4513', secondary: '#DEB887' },
      'midnight-ocean': { primary: '#4ABAF2', secondary: '#0277BD' },
      'dark-high-contrast': { primary: '#8AB4F8', secondary: '#FF8FA3' },
      'dark-medium-contrast': { primary: '#64A2F3', secondary: '#E26A6A' },
      'light-high-contrast': { primary: '#1565C0', secondary: '#C62828' },
      'light-medium-contrast': { primary: '#1E88E5', secondary: '#EF5350' },
      'pastel-lavender': { primary: '#AFA3E8', secondary: '#D4A5E6' },
      'pastel-mint': { primary: '#7ACFC0', secondary: '#48B8A5' },
      'pastel-mauve-rose': { primary: '#F29CB8', secondary: '#E16491' },
      'pastel-peach': { primary: '#FF9F7E', secondary: '#FF7755' },
      'pastel-vintage': { primary: '#CCBBAF', secondary: '#927B6A' },
      'pastel-blush': { primary: '#F6B7C9', secondary: '#F28AAE' },
      'goth-violet': { primary: '#A98BFF', secondary: '#6F3BFF' },
      'goth-bloodmoon': { primary: '#E84C47', secondary: '#8A1111' },
      'goth-storm': { primary: '#8FA0AC', secondary: '#596E79' },
      'cyber-grid': { primary: '#00D2F2', secondary: '#009BE6' },
      'cyber-neon': { primary: '#F200C9', secondary: '#00F28C' },
      'sunset-glow': { primary: '#FF7B57', secondary: '#FFAE70' },
      'forest-haze': { primary: '#78CC8C', secondary: '#43A047' },
      'royal-purple': { primary: '#C88CE0', secondary: '#973DB4' },
      'deep-space': { primary: '#8FBDFB', secondary: '#495CFF' },
      'rose-blush': { primary: '#F5A3BC', secondary: '#D85086' },
      'teal-dream': { primary: '#47B6AC', secondary: '#00796B' },
      'warm-sands': { primary: '#FFC273', secondary: '#FFA74A' },
      'cool-mint': { primary: '#77DCEC', secondary: '#20BFD0' },
      'solar-eclipse': { primary: '#FFBD27', secondary: '#FF9500' },
      'candy-pastel': { primary: '#FF98C4', secondary: '#FF71A4' },
    };
    
    return colorMap[themeName] || { primary: '#1890ff', secondary: '#722ed1' };
  };

  const isDarkTheme = (themeName) => themeName.includes('dark');

  if (!visible) return null;

  return (
    <div
      ref={pickerRef}
      style={{
        position: 'fixed',
        bottom: '90px',
        right: '20px',
        width: '380px',
        maxHeight: 'calc(100vh - 160px)',
        zIndex: 1001,
        overflow: 'hidden',
      }}
    >
      <Card
        title={
          <Space align="center">
            <Avatar 
              style={{ 
                backgroundColor: 'var(--ant-color-primary-bg)',
                color: 'var(--ant-color-primary)',
                fontSize: '16px'
              }}
            >
              🎨
            </Avatar>
            <div>
              <Title level={5} style={{ margin: 0 }}>Themes</Title>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Click to switch
              </Text>
            </div>
          </Space>
        }
        extra={
          <Space>
            <Tag color="processing" style={{ fontSize: '12px' }}>
              {formatThemeName(currentThemeName)}
            </Tag>
            <Tooltip title="Random Theme">
              <Button 
                icon="🎲"
                size="small"
                type="text"
                onClick={handleRandomTheme}
                style={{
                  transform: 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                }}
                className="random-theme-btn"
              />
            </Tooltip>
          </Space>
        }
        style={{
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(20px)',
          backgroundColor: 'var(--ant-color-bg-container)',
          border: '1px solid var(--ant-color-border)',
          maxHeight: 'inherit',
          display: 'flex',
          flexDirection: 'column',
        }}
        bodyStyle={{
          padding: 0,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Theme List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          <List
            dataSource={themeNames}
            renderItem={(name) => {
              const colors = getThemeColors(name);
              const isSelected = name === currentThemeName;
              const isDark = isDarkTheme(name);
              
              return (
                <List.Item
                  onClick={() => onThemeChange(name)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--ant-color-primary-bg)' : 'transparent',
                    borderLeft: isSelected ? '4px solid var(--ant-color-primary)' : '4px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                  className="theme-list-item"
                >
                  <List.Item.Meta
                    avatar={
                      <div 
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                          border: `2px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
                        }}
                      />
                    }
                    title={
                      <Space align="center">
                        <Text 
                          strong
                          style={{ 
                            color: isSelected ? 'var(--ant-color-primary)' : 'var(--ant-color-text)',
                            fontSize: '14px'
                          }}
                        >
                          {formatThemeName(name)}
                        </Text>
                        <span style={{ fontSize: '12px' }}>
                          {isDark ? '🌙' : '☀️'}
                        </span>
                      </Space>
                    }
                    description={
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {name.includes('dark') ? 'Dark Mode' : 
                         name.includes('light') ? 'Light Mode' : 'Custom Theme'}
                      </Text>
                    }
                  />
                  
                  {isSelected && (
                    <Badge
                      count="✓"
                      style={{ 
                        backgroundColor: 'var(--ant-color-primary)',
                        boxShadow: 'none'
                      }}
                    />
                  )}
                </List.Item>
              );
            }}
          />
        </div>

        {/* Toggle View Button */}
        <Divider style={{ margin: 0 }} />
        <div style={{ padding: '12px 16px', textAlign: 'center' }}>
          <Tooltip title={expanded ? "Show previews only" : "Show color previews"}>
            <Button
              icon={expanded ? "↑" : "↓"}
              type="text"
              block
              onClick={toggleExpanded}
              style={{
                backgroundColor: 'var(--ant-color-fill-secondary)',
                borderRadius: '8px',
              }}
            >
              <Space size={4}>
                {expanded ? "Compact View" : "Expand Preview"}
              </Space>
            </Button>
          </Tooltip>
        </div>
      </Card>
    </div>
  );
};

export default ThemePicker;