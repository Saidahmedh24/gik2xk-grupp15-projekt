import {
  AppBar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const SneakerIcon = ({ size = 36 }) => (
  <svg width={size} height={Math.round(size * 0.72)} viewBox="0 0 36 26" fill="none">
    <path d="M2 21C2 21 3 15 8 13.5L13.5 11.5L19 9.5C21.5 8.8 24 10.5 24 12.5L25 16C25 16 28 17 29 19.5L30 21H2Z" fill="#4F46E5" />
    <path d="M1.5 21H30.5L31 23C31 24.1 30.1 25 29 25H3C1.9 25 1.5 24.1 1.5 23V21Z" fill="#3730A3" />
    <path d="M13 12.5L11.5 17.5M18.5 10L17 15M24 12.5L22.5 17" stroke="white" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M29 21C30.5 19.5 33 19 35 20C36.5 20.8 36.5 22 35.5 23L34 25H31L30 21" fill="#4F46E5" />
  </svg>
);

const HamburgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M2.5 5H17.5M2.5 10H17.5M2.5 15H17.5" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M4 4L16 16M16 4L4 16" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CartIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const Logo = ({ small }) => {
  const navigate = useNavigate();
  return (
    <Box
      onClick={() => navigate("/")}
      sx={{ display: "flex", alignItems: "center", gap: small ? 1 : 1.2, cursor: "pointer", userSelect: "none" }}
    >
      <SneakerIcon size={small ? 28 : 36} />
      <Box>
        <Typography
          component="span"
          sx={{
            display: "block",
            fontWeight: 900,
            fontSize: small ? "1.05rem" : "1.3rem",
            letterSpacing: "-0.05em",
            color: "#111827",
            lineHeight: 1,
          }}
        >
          G-15
        </Typography>
        <Typography
          component="span"
          sx={{
            display: "block",
            fontWeight: 700,
            fontSize: small ? "0.44rem" : "0.5rem",
            letterSpacing: "0.4em",
            color: "#4F46E5",
            lineHeight: 1,
            mt: "2px",
          }}
        >
          SHOES
        </Typography>
      </Box>
    </Box>
  );
};

function Navbar() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = () => {
    axios.get("http://localhost:3000/cart/1")
      .then((res) => {
        if (res.data && res.data.Products) {
          const count = res.data.Products.reduce((sum, p) => sum + (p.CartItem?.quantity || 1), 0);
          setCartCount(count);
        } else {
          setCartCount(0);
        }
      })
      .catch(() => setCartCount(0));
  };

  useEffect(() => {
    fetchCartCount();
    window.addEventListener("cartUpdated", fetchCartCount);
    return () => window.removeEventListener("cartUpdated", fetchCartCount);
  }, []);

  const goTo = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ px: { xs: 2, sm: 3, md: 4 }, minHeight: { xs: 58, md: 66 } }}>
          <Logo />

          {/* Desktop nav */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, alignItems: "center", ml: "auto" }}>
            <Button
              onClick={() => navigate("/")}
              sx={{ fontSize: "0.85rem", fontWeight: 500, px: 2, color: "#374151", "&:hover": { color: "#111827", background: "#F3F4F6" } }}
            >
              Produkter
            </Button>
            <Button
              onClick={() => navigate("/products/new")}
              sx={{ fontSize: "0.85rem", fontWeight: 500, px: 2, color: "#374151", "&:hover": { color: "#111827", background: "#F3F4F6" } }}
            >
              Skapa produkt
            </Button>
            <IconButton
              onClick={() => navigate("/cart")}
              sx={{
                ml: 1,
                background: "#F3F4F6",
                color: "#374151",
                p: 1.2,
                borderRadius: "10px",
                "&:hover": { background: "#E5E7EB", color: "#111827" },
              }}
            >
              <Badge badgeContent={cartCount} color="error" sx={{ "& .MuiBadge-badge": { fontWeight: 700 } }}>
                <CartIcon />
              </Badge>
            </IconButton>
          </Box>

          {/* Mobile: cart + hamburger */}
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1, alignItems: "center", ml: "auto" }}>
            <IconButton
              onClick={() => navigate("/cart")}
              sx={{
                background: "#F3F4F6",
                color: "#374151",
                p: 1,
                borderRadius: "9px",
                "&:hover": { background: "#E5E7EB", color: "#111827" },
              }}
            >
              <Badge badgeContent={cartCount} color="error" sx={{ "& .MuiBadge-badge": { fontWeight: 700 } }}>
                <CartIcon size={20} />
              </Badge>
            </IconButton>
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{
                p: 1,
                borderRadius: "9px",
                border: "1px solid #E5E7EB",
                "&:hover": { background: "#F3F4F6" },
              }}
            >
              <HamburgerIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 270, background: "#fff", boxShadow: "-4px 0 24px rgba(0,0,0,0.08)" },
        }}
      >
        {/* Drawer header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            py: 2,
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <Logo small />
          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{ p: 0.8, borderRadius: "8px", "&:hover": { background: "#F3F4F6" } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Drawer links */}
        <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
          {[
            { label: "👟 Produkter", path: "/" },
            { label: "✏️ Skapa produkt", path: "/products/new" },
          ].map((item) => (
            <Button
              key={item.path}
              fullWidth
              onClick={() => goTo(item.path)}
              sx={{
                justifyContent: "flex-start",
                px: 2,
                py: 1.3,
                borderRadius: "10px",
                color: "#374151",
                fontSize: "0.95rem",
                fontWeight: 500,
                "&:hover": { background: "#F3F4F6", color: "#111827" },
              }}
            >
              {item.label}
            </Button>
          ))}

          <Divider sx={{ my: 1.5 }} />

          <Button
            fullWidth
            variant="contained"
            onClick={() => goTo("/cart")}
            sx={{
              background: "#4F46E5",
              fontWeight: 700,
              py: 1.4,
              borderRadius: "10px",
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              "&:hover": { background: "#3730A3", boxShadow: "0 4px 12px rgba(79,70,229,0.3)" },
            }}
          >
            <Badge badgeContent={cartCount} color="error" sx={{ "& .MuiBadge-badge": { fontWeight: 700 } }}>
              <CartIcon size={20} />
            </Badge>
            Varukorg
          </Button>
        </Box>

        <Box sx={{ px: 2.5, py: 2, borderTop: "1px solid #E5E7EB" }}>
          <Typography sx={{ fontSize: "0.72rem", color: "#9CA3AF", textAlign: "center" }}>
            G-15 Shoes · SS 2026
          </Typography>
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;
