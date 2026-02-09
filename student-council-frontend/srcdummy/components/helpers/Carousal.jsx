import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Circle as CircleIcon
} from '@mui/icons-material';

const CouncilMemberCard = ({ member, isActive }) => {
  const getPositionColor = (position) => {
    const positionColors = {
      'CHAIRPERSON': 'primary.main',
      'CLASS_REP': 'secondary.main',
      'SPORTS_SECRETARY': 'success.main',
      'CULTURAL_SECRETARY': 'warning.main',
      'TREASURER': 'info.main',
      'SECRETARY': 'error.main',
      'VICE_CHAIRPERSON': 'primary.light'
    };
    return positionColors[position] || 'grey.500';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success.main' : 'grey.500';
  };
  const theme = useTheme();
  return (
    <Card
      sx={{
        minWidth: isActive ? 320 : 240,
        maxWidth: isActive ? 320 : 240,
        height: isActive ? 420 : 340,
        transition: 'all 0.3s ease',
        transform: isActive ? 'scale(1.05)' : 'scale(0.85)',
        opacity: isActive ? 1 : 0.7,
        margin: isActive ? '0 16px' : '0 8px',
        boxShadow: isActive ? 8 : 2,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'visible'
      }}
    >
      <Box
        sx={{
          height: isActive ? 200 : 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'primary.light',
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {member.avatar ? (
          <Avatar
            src={member.avatar}
            sx={{
              width: isActive ? 120 : 100,
              height: isActive ? 120 : 100,
              border: '4px solid white'
            }}
          />
        ) : (
          <Avatar
            sx={{
              width: isActive ? 120 : 100,
              height: isActive ? 120 : 100,
              bgcolor: 'primary.main',
              fontSize: isActive ? '3rem' : '2.5rem',
              border: '4px solid white'
            }}
          >
            {member.name?.charAt(0) || '?'}
          </Avatar>
        )}
        
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            px: 1.5,
            py: 0.5,
            borderRadius: 20
          }}
        >
          <CircleIcon 
            sx={{ 
              fontSize: 12,
              color: getStatusColor(member.onlineStatus)
            }} 
          />
          <Typography variant="caption" color={theme.palette.primary.main}>
            {member.onlineStatus === 'active' ? 'Online' : 'Offline'}
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ 
        flexGrow: 1, 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <Chip
          label={member.councilPosition?.replace(/_/g, ' ') || 'Member'}
          size="small"
          sx={{
            bgcolor: getPositionColor(member.councilPosition),
            color: 'white',
            fontWeight: 600,
            fontSize: '0.75rem',
            mb: 2
          }}
        />

        <Typography 
          variant="h5" 
          component="div"
          sx={{ 
            fontWeight: 700,
            mb: 1,
            fontSize: isActive ? '1.5rem' : '1.25rem'
          }}
        >
          {member.name}
        </Typography>

        {member.className && (
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ 
              fontWeight: 500,
              mb: 1
            }}
          >
            {member.className}
          </Typography>
        )}

        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: isActive ? 2 : 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontStyle: 'italic',
            mt: 1
          }}
        >
          {member.email}
        </Typography>
      </CardContent>
    </Card>
  );
};

const CouncilCarousel = ({ members = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNext = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === members.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? members.length - 1 : prevIndex - 1
    );
  };

  const handleSwipe = (direction) => {
    if (direction === 'left') {
      handleNext();
    } else if (direction === 'right') {
      handlePrev();
    }
  };

  const getVisibleItems = () => {
    const itemsToShow = isMobile ? 1 : Math.min(3, members.length);
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
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No council members to display
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: 'lg',
      mx: 'auto',
      px: 2,
      position: 'relative'
    }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 500,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {members.length > 1 && (
          <>
            <IconButton
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                left: 0,
                zIndex: 10,
                bgcolor: 'background.paper',
                boxShadow: 3,
                '&:hover': {
                  bgcolor: 'background.default'
                }
              }}
            >
              <ChevronLeftIcon />
            </IconButton>

            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 0,
                zIndex: 10,
                bgcolor: 'background.paper',
                boxShadow: 3,
                '&:hover': {
                  bgcolor: 'background.default'
                }
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </>
        )}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.3s ease',
            touchAction: 'pan-y',
            userSelect: 'none'
          }}
          onTouchStart={(e) => {
            const touchStartX = e.touches[0].clientX;
            const handleTouchEnd = (e) => {
              const touchEndX = e.changedTouches[0].clientX;
              const diff = touchStartX - touchEndX;
              if (Math.abs(diff) > 50) {
                if (diff > 0) {
                  handleSwipe('left');
                } else {
                  handleSwipe('right');
                }
              }
              document.removeEventListener('touchend', handleTouchEnd);
            };
            document.addEventListener('touchend', handleTouchEnd);
          }}
        >
          {getVisibleItems().map(({ member, index, isActive }) => (
            <CouncilMemberCard
              key={index}
              member={member}
              isActive={isActive}
            />
          ))}
        </Box>
      </Box>

      {members.length > 1 && (
        <>
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            mt: 3
          }}>
            {members.map((_, index) => (
              <Box
                key={index}
                onClick={() => setActiveIndex(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: activeIndex === index ? 'primary.main' : 'grey.400',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  '&:hover': {
                    bgcolor: activeIndex === index ? 'primary.dark' : 'grey.500'
                  }
                }}
              />
            ))}
          </Box>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              textAlign: 'center', 
              mt: 2 
            }}
          >
            {activeIndex + 1} / {members.length}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default CouncilCarousel;