import * as React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

// Inspired by the former Facebook spinners.
function FacebookCircularProgress(props) {
  return (
    <Box sx={{ position: 'relative' }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) => theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        }}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
          animationDuration: '550ms',
          position: 'absolute',
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
          },
        }}
        size={40}
        thickness={4}
        {...props}
      />
    </Box>
  );
}

const style = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexGrow: 1,
};

const getStyle = (fullScreen) => {
  if (fullScreen === true) {
    style.height = '100vh';
  }
  return style;
};

export default function Loading({ type, fullScreen }) {
  if (!type || type === 'circle') {
    return (
      <Box sx={getStyle(fullScreen)}>
        <FacebookCircularProgress />
      </Box>
    );
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <BorderLinearProgress />
    </Box>
  );
}

Loading.propTypes = {
  type: PropTypes.string,
  fullScreen: PropTypes.bool,
};