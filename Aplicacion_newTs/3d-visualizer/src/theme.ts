import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles/createTheme' {
    interface ThemeOptions {    
        themeName?: string  // optional
    }
}

const palette = {
  primary: { main: '#3f51b5' },
  secondary: { main: '#f50057' }
};

const themeName = 'mainTheme';

export default createTheme({ palette, themeName });