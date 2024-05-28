import React from 'react';
import { Container, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import UploadForm from './components/UploadForm.tsx';

// Create a theme with global styles
const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
          fontFamily: "'Verdana', sans-serif",
          background: '#2a2a2a url(https://www.transparenttextures.com/patterns/stardust.png)',
          color: '#656363',
          overflow: 'auto', // Ensure the body can scroll
        },
        '#root': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          overflow: 'auto', // Ensure the root can scroll
        },
      },
    },
  },
  typography: {
    fontFamily: "'Verdana', sans-serif",
    h1: {
      fontWeight: 'bold',
      fontFamily: "'Verdana', sans-serif",
    },
    h2: {
      fontWeight: 'bold',
      fontFamily: "'Verdana', sans-serif",
    },
    h3: {
      fontWeight: 'bold',
      fontFamily: "'Verdana', sans-serif",
    },
    h4: {
      fontWeight: 'bold',
      fontFamily: "'Verdana', sans-serif",
    },
    h5: {
      fontWeight: 'bold',
      fontFamily: "'Verdana', sans-serif",
    },
    h6: {
      fontWeight: 'normal',
      fontFamily: "'Verdana', sans-serif",
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: 'rgba(58,59,65,0.82)',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(177, 178, 178, 0.56)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '1rem',
          marginBottom: '1rem',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          SHAD Prediction Service
        </Typography>
        <UploadForm />
      </Container>
    </ThemeProvider>
  );
};

export default App;
