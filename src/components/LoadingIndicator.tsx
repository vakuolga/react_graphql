import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function LoadingIndicator() {
  return (
    <Box sx={{ display: 'flex' }} data-testid="loading">
      <CircularProgress />
    </Box>
  );
}

export default LoadingIndicator;
