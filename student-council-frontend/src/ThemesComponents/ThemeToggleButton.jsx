// Components/ThemesComponents/ThemeToggleButton.jsx
import { useState } from 'react';
import { FloatButton, Tooltip, Tag, Space } from 'antd';
import { 
  BgColorsOutlined, 
  CloseOutlined,
  CheckCircleOutlined, 
} from '@ant-design/icons';

const ThemeToggleButton = ({ 
  onClick, 
  isPickerOpen = false, 
  currentThemeName 
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Format theme name for display
  const formatThemeName = (name) => {
    return name
      .replace(/-/g, " ")
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/Hc/g, "High Contrast")
      .replace(/Mc/g, "Medium Contrast");
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
      }}
      onMouseEnter={() => setTooltipVisible(true)}
      onMouseLeave={() => setTooltipVisible(false)}
    >
      {/* Tooltip */}
      {tooltipVisible && (
        <div
          style={{
            position: 'absolute',
            right: 'calc(100% + 12px)',
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: tooltipVisible ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            zIndex: 1001,
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--ant-color-bg-container)',
              color: 'var(--ant-color-text)',
              padding: '8px 16px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              whiteSpace: 'nowrap',
              border: '1px solid var(--ant-color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {isPickerOpen ? (
              <>
                <CloseOutlined style={{ fontSize: '12px' }} />
                Close Theme Picker
              </>
            ) : (
              <>
                <BgColorsOutlined style={{ fontSize: '12px' }} />
                Change Theme
              </>
            )}
            {currentThemeName && (
              <Tag 
                color="processing" 
                style={{ 
                  marginLeft: '8px',
                  fontSize: '10px',
                  padding: '0 6px',
                  lineHeight: '16px'
                }}
              >
                {formatThemeName(currentThemeName)}
              </Tag>
            )}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <Tooltip
        title={isPickerOpen ? "Close Theme Picker" : "Change Theme"}
        placement="left"
        open={tooltipVisible}
        onOpenChange={setTooltipVisible}
      >
        <FloatButton
          type={isPickerOpen ? "default" : "primary"}
          icon={isPickerOpen ? <CloseOutlined /> : <BgColorsOutlined />}
          onClick={onClick}
          style={{
            width: '56px',
            height: '56px',
            boxShadow: isPickerOpen 
              ? '0 4px 20px rgba(239, 68, 68, 0.3)' 
              : '0 4px 20px rgba(24, 144, 255, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="theme-toggle-button"
        />
      </Tooltip>
    </div>
  );
};

export default ThemeToggleButton;