"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#fff",
    },
  },
  typography: {
    fontFamily: "Segoe UI, Arial, sans-serif",
  },
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ minHeight: '100vh', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`body::-webkit-scrollbar, html::-webkit-scrollbar { display: none !important; }`}</style>
        {children}
      </div>
    </ThemeProvider>
  );
} 