import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { EmployeesPage } from './pages/EmployeesPage';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6366f1' },
    background: {
      default: '#0f172a',
      paper: '#111827',
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(255,255,255,0.05)',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
        }}
      >
        <EmployeesPage />
      </Box>
    </ThemeProvider>
  );
}