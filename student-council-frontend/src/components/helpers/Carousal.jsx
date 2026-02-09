import React, { useState, useRef } from 'react';
import { Card, Avatar, Typography, Button, Space, Row, Col, Grid } from 'antd';
import { LeftOutlined, RightOutlined, CrownOutlined, UserOutlined } from '@ant-design/icons';
import { COLORS } from '../../utils/colors.js';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const CouncilMemberCard = ({ member, isActive }) => {
  const getPositionColor = () => {
    const positionColors = {
      'CHAIRPERSON': '#FF6B6B',
      'VICE_CHAIRPERSON': '#4ECDC4',
      'SECRETARY': '#45B7D1',
      'TREASURER': '#96CEB4',
      'SPORTS_SECRETARY': '#FFEAA7',
      'CULTURAL_SECRETARY': '#DDA0DD',
      'CLASS_REP': '#98D8C8'
    };
    return positionColors[member.councilPosition] || COLORS.secondary;
  };

  const getStatusColor = () => {
    return member.onlineStatus === 'active' ? '#52c41a' : '#8c8c8c';
  };

  const positionColor = getPositionColor();

  return (
    <Card
      style={{
        minWidth: isActive ? 300 : 240,
        maxWidth: isActive ? 300 : 240,
        height: isActive ? 400 : 340,
        transition: 'all 0.3s ease',
        transform: isActive ? 'scale(1.05)' : 'scale(0.9)',
        opacity: isActive ? 1 : 0.7,
        margin: '0 12px',
        borderRadius: 16,
        border: `1px solid ${COLORS.secondary}30`,
        background: COLORS.surface,
        color: COLORS.text,
        overflow: 'hidden',
        boxShadow: isActive 
          ? `0 8px 32px rgba(0,0,0,0.15)` 
          : `0 4px 16px rgba(0,0,0,0.1)`
      }}
      bodyStyle={{ padding: 0, height: '100%' }}
    >
      {/* Header with avatar */}
      <div style={{
        height: isActive ? 200 : 160,
        background: `linear-gradient(135deg, ${positionColor}40, ${COLORS.secondary}20)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '20px'
      }}>
        <Avatar
          size={isActive ? 120 : 100}
          src={member.avatar}
          icon={!member.avatar && <UserOutlined />}
          style={{
            border: `4px solid ${COLORS.background}`,
            background: positionColor,
            fontSize: isActive ? '40px' : '32px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}
        >
          {!member.avatar && member.name?.charAt(0)}
        </Avatar>
        
        {/* Online status badge */}
        <div style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: `${COLORS.background}CC`,
          padding: '6px 12px',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${COLORS.secondary}30`
        }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: getStatusColor()
          }} />
          <Text style={{ 
            fontSize: '12px',
            color: COLORS.text,
            fontWeight: 500
          }}>
            {member.onlineStatus === 'active' ? 'Online' : 'Offline'}
          </Text>
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        padding: '24px',
        height: 'calc(100% - 200px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        {/* Position badge */}
        <div style={{
          background: positionColor,
          color: '#fff',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 600,
          marginBottom: '16px',
          letterSpacing: '0.5px'
        }}>
          {member.councilPosition?.replace(/_/g, ' ') || 'Council Member'}
        </div>

        {/* Name */}
        <Title 
          level={4} 
          style={{ 
            margin: '0 0 8px 0',
            color: COLORS.text,
            fontWeight: 600,
            fontSize: isActive ? '20px' : '18px'
          }}
        >
          {member.name}
        </Title>

        {/* Class */}
        {member.className && (
          <Text style={{ 
            color: `${COLORS.text}CC`,
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '12px'
          }}>
            {member.className}
          </Text>
        )}

        {/* Email
        <Paragraph 
          style={{ 
            margin: '12px 0 0 0',
            color: `${COLORS.text}99`,
            fontSize: '13px',
            fontStyle: 'italic',
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: isActive ? 2 : 1,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {member.email}
        </Paragraph> */}
      </div>
    </Card>
  );
};

const CouncilCarousel = ({ members = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const screens = useBreakpoint();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleNext = () => {
    setActiveIndex(prev => 
      prev === members.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setActiveIndex(prev => 
      prev === 0 ? members.length - 1 : prev - 1
    );
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext(); // Swipe left
      } else {
        handlePrev(); // Swipe right
      }
    }
  };

  const getVisibleItems = () => {
    const itemsToShow = screens.xs ? 1 : Math.min(3, members.length);
    const result = [];
    
    for (let i = -Math.floor(itemsToShow / 2); i <= Math.floor(itemsToShow / 2); i++) {
      const index = (activeIndex + i + members.length) % members.length;
      result.push({
        member: members[index],
        index,
        isActive: i === 0
      });
    }
    
    return result;
  };

  if (members.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 0',
        background: COLORS.surface,
        borderRadius: '16px',
        border: `1px dashed ${COLORS.secondary}30`
      }}>
        <CrownOutlined style={{ 
          fontSize: '48px', 
          color: `${COLORS.secondary}50`,
          marginBottom: '16px'
        }} />
        <Title level={4} style={{ color: `${COLORS.text}CC`, marginBottom: '8px' }}>
          No Council Members
        </Title>
        <Text style={{ color: `${COLORS.text}99` }}>
          Council positions will be announced soon
        </Text>
      </div>
    );
  }

  const visibleItems = getVisibleItems();

  return (
    <div style={{ 
      width: '100%',
      maxWidth: '1140px',
      margin: '0 auto',
      padding: screens.xs ? '0 20px' : '0 30px',
      position: 'relative'
    }}>
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 480,
          position: 'relative'
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation buttons */}
        {members.length > 1 && !screens.xs && (
          <>
            <Button
              type="text"
              icon={<LeftOutlined />}
              onClick={handlePrev}
              style={{
                position: 'absolute',
                left: '-40px',
                zIndex: 10,
                width: '48px',
                height: '48px',
                background: COLORS.surface,
                border: `1px solid ${COLORS.secondary}30`,
                color: COLORS.text,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: '20px'
              }}
            />
            
            <Button
              type="text"
              icon={<RightOutlined />}
              onClick={handleNext}
              style={{
                position: 'absolute',
                right: '-40px',
                zIndex: 10,
                width: '48px',
                height: '48px',
                background: COLORS.surface,
                border: `1px solid ${COLORS.secondary}30`,
                color: COLORS.text,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: '20px'
              }}
            />
          </>
        )}

        {/* Mobile navigation */}
        {members.length > 1 && screens.xs && (
          <div style={{
            position: 'absolute',
            top: '-60px',
            right: '0',
            zIndex: 10,
            display: 'flex',
            gap: '12px'
          }}>
            <Button
              type="text"
              icon={<LeftOutlined />}
              onClick={handlePrev}
              style={{
                width: '40px',
                height: '40px',
                background: COLORS.surface,
                border: `1px solid ${COLORS.secondary}30`,
                color: COLORS.text
              }}
            />
            
            <Button
              type="text"
              icon={<RightOutlined />}
              onClick={handleNext}
              style={{
                width: '40px',
                height: '40px',
                background: COLORS.surface,
                border: `1px solid ${COLORS.secondary}30`,
                color: COLORS.text
              }}
            />
          </div>
        )}

        {/* Carousel items */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s ease'
        }}>
          {visibleItems.map(({ member, index, isActive }) => (
            <CouncilMemberCard
              key={index}
              member={member}
              isActive={isActive}
            />
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      {members.length > 1 && (
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '24px',
          marginTop: '40px'
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            flex: 1
          }}>
            {members.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                style={{
                  width: activeIndex === index ? '24px' : '12px',
                  height: '12px',
                  borderRadius: '6px',
                  background: activeIndex === index ? COLORS.secondary : `${COLORS.secondary}40`,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0
                }}
              />
            ))}
          </div>
          
          <Text style={{ 
            color: `${COLORS.text}80`,
            fontSize: '14px',
            minWidth: '60px',
            textAlign: 'center'
          }}>
            {activeIndex + 1} / {members.length}
          </Text>
        </div>
      )}
    </div>
  );
};

export default CouncilCarousel;