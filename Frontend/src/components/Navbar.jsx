import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Webbshop
        </Typography>
        <Button color="inherit" onClick={() => navigate("/")}>
          Produkter
        </Button>
        <Button color="inherit" onClick={() => navigate("/products/new")}>
          Skapa produkt
        </Button>
        <Button color="inherit" onClick={() => navigate("/cart")}>
          Varukorg 🛒
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;