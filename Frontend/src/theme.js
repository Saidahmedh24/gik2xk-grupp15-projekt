import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4F46E5",
      light: "#818CF8",
      dark: "#3730A3",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#7C3AED",
      contrastText: "#ffffff",
    },
    background: {
      default: "#F5F5F7",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827",
      secondary: "#6B7280",
    },
    divider: "#E5E7EB",
    success: { main: "#10B981" },
    error: { main: "#EF4444" },
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h1: { fontWeight: 800, letterSpacing: "-0.04em" },
    h2: { fontWeight: 700, letterSpacing: "-0.03em" },
    h3: { fontWeight: 700, letterSpacing: "-0.025em" },
    h4: { fontWeight: 700, letterSpacing: "-0.02em" },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600 },
  },
  shape: { borderRadius: 14 },
  shadows: [
    "none",
    "0 1px 2px rgba(0,0,0,0.05)",
    "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
    "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
    "0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)",
    "0 20px 25px -5px rgba(0,0,0,0.08), 0 10px 10px -5px rgba(0,0,0,0.04)",
    "0 25px 50px -12px rgba(0,0,0,0.12)",
    ...Array(19).fill("none"),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "#F5F5F7",
          scrollbarColor: "#D1D5DB transparent",
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: "#D1D5DB",
            borderRadius: 4,
            "&:hover": { background: "#9CA3AF" },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid #E5E7EB",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          color: "#111827",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          transition: "transform 0.22s ease, box-shadow 0.22s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 20px 40px rgba(79,70,229,0.12), 0 8px 16px rgba(0,0,0,0.06)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 12,
          letterSpacing: "0.01em",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(79,70,229,0.3)",
          },
        },
        outlined: {
          borderColor: "#E5E7EB",
          "&:hover": { borderColor: "#9CA3AF", background: "#F9FAFB" },
        },
        text: {
          "&:hover": { background: "#F3F4F6" },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            background: "#FFFFFF",
            "& fieldset": { borderColor: "#E5E7EB" },
            "&:hover fieldset": { borderColor: "#9CA3AF" },
            "&.Mui-focused fieldset": { borderColor: "#4F46E5" },
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "#4F46E5" },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          background: "#FFFFFF",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& fieldset": { borderColor: "#E5E7EB" },
          "&:hover fieldset": { borderColor: "#9CA3AF" },
          "&.Mui-focused fieldset": { borderColor: "#4F46E5 !important" },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          background: "#4F46E5",
          height: 3,
          borderRadius: "3px 3px 0 0",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.9rem",
          letterSpacing: "-0.01em",
          color: "#6B7280",
          "&.Mui-selected": { color: "#4F46E5" },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: "0.7rem",
          letterSpacing: "0.05em",
        },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: "#E5E7EB" } },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export default theme;
