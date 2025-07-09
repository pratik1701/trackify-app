"use client";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode } from 'react';

// Create a Material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // blue-600
    },
    secondary: {
      main: '#7c3aed', // purple-600
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

interface MaterialUIProviderProps {
  children: ReactNode;
}

export function MaterialUIProvider({ children }: MaterialUIProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
} 