import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

// ─── Shared Card ──────────────────────────────────────────────────────────────

function ProductCard({ name, price, image, ctaLabel, ctaDisabled, ctaVariant, onCardClick, onButtonClick }) {
  return (
    <Grid item xs={6} sm={6} md={4} lg={3}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          cursor: onCardClick ? "pointer" : "default",
        }}
        onClick={onCardClick}
      >
        <Box sx={{ position: "relative", background: "#F9FAFB", overflow: "hidden" }}>
          <CardMedia
            component="img"
            image={image || "https://via.placeholder.com/400x300/F9FAFB/9CA3AF?text=G-15"}
            alt={name}
            sx={{
              height: { xs: 160, sm: 200 },
              objectFit: "cover",
              transition: "transform 0.35s ease",
              "&:hover": { transform: "scale(1.05)" },
            }}
          />
          <Chip
            label="G-15"
            size="small"
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              background: "#4F46E5",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.6rem",
              letterSpacing: "0.08em",
              height: 20,
            }}
          />
        </Box>

        <CardContent sx={{ flex: 1, p: 2, pb: 1 }}>
          <Typography
            sx={{
              fontSize: "0.68rem",
              fontWeight: 700,
              color: "#9CA3AF",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              mb: 0.4,
            }}
          >
            G-15 Shoes
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "#111827",
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              mb: 0.5,
            }}
          >
            {name}
          </Typography>
          <Typography
            sx={{ color: "#4F46E5", fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.01em" }}
          >
            {price}
          </Typography>
        </CardContent>

        <Box sx={{ px: 2, pb: 2, pt: 0.5 }}>
          <Button
            variant={ctaVariant || "contained"}
            fullWidth
            disabled={ctaDisabled}
            onClick={(e) => { e.stopPropagation(); onButtonClick(); }}
            sx={{
              borderRadius: "10px",
              py: 0.9,
              fontSize: "0.82rem",
              ...(ctaVariant !== "outlined" && !ctaDisabled
                ? {
                    background: "#4F46E5",
                    color: "#fff",
                    "&:hover": {
                      background: "#3730A3",
                      boxShadow: "0 4px 12px rgba(79,70,229,0.3)",
                    },
                  }
                : {}),
              ...(ctaDisabled
                ? { color: "#10B981 !important", borderColor: "#10B981 !important" }
                : {}),
            }}
          >
            {ctaLabel}
          </Button>
        </Box>
      </Card>
    </Grid>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function ProductList() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [addingId, setAddingId] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set());

  const fetchProducts = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/products`).then((res) => setProducts(res.data)).catch(() => {});
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    setAddingId(product.id);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/cart/1/products/${product.id}`);
      setAddedIds((prev) => new Set([...prev, product.id]));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Kunde inte lägga till produkt:", err);
      alert("Något gick fel när produkten skulle läggas i varukorgen.");
    } finally {
      setAddingId(null);
    }
  };

  const filtered = products
    .filter((p) => !keyword.trim() || p.name.toLowerCase().includes(keyword.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      return b.id - a.id; // default: senast tillagda
    });

  return (
    <Box sx={{ background: "#F5F5F7", minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ pt: { xs: 2, md: 3 }, pb: 8, px: { xs: 2, sm: 3 } }}>
        {/* Filter bar */}
        <Box
          sx={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 3,
            p: { xs: 2, sm: 2.5 },
            mb: { xs: 3, md: 4 },
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "stretch" }}>
            <TextField
              placeholder="Sök skor…"
              size="small"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              sx={{ flex: "1 1 160px", minWidth: 0 }}
              InputProps={{
                startAdornment: <Box component="span" sx={{ mr: 1, color: "#9CA3AF", fontSize: "0.9rem" }}>🔍</Box>,
              }}
            />
            <FormControl size="small" sx={{ minWidth: { xs: 120, sm: 145 }, flexShrink: 0 }}>
              <InputLabel>Sortera</InputLabel>
              <Select value={sortBy} label="Sortera" onChange={(e) => setSortBy(e.target.value)}>
                <MenuItem value="default">Senast tillagda</MenuItem>
                <MenuItem value="price_asc">Pris ↑</MenuItem>
                <MenuItem value="price_desc">Pris ↓</MenuItem>
                <MenuItem value="name_asc">A → Ö</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              onClick={() => navigate("/products/new")}
              sx={{
                height: 40,
                px: { xs: 1.5, sm: 2.5 },
                borderRadius: "10px",
                flexShrink: 0,
                display: { xs: "none", sm: "flex" },
              }}
            >
              + Lägg till
            </Button>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1.5 }}>
            <Typography sx={{ fontSize: "0.72rem", color: "#9CA3AF" }}>
              {filtered.length} skor
            </Typography>
            <Button
              size="small"
              onClick={() => navigate("/products/new")}
              sx={{ display: { xs: "flex", sm: "none" }, fontSize: "0.72rem", color: "#4F46E5", p: 0 }}
            >
              + Lägg till sko
            </Button>
          </Box>
        </Box>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 12 }}>
            <Typography sx={{ fontSize: "3rem", mb: 2 }}>👟</Typography>
            <Typography variant="h6" sx={{ color: "#6B7280" }}>Inga produkter hittades</Typography>
            <Button onClick={() => { setKeyword(""); setSortBy("default"); }} sx={{ mt: 2 }}>
              Rensa filter
            </Button>
          </Box>
        ) : (
          <Grid container spacing={{ xs: 1.5, sm: 2.5 }}>
            {filtered.map((product) => {
              const isAdded = addedIds.has(product.id);
              const isAdding = addingId === product.id;
              return (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  price={`${Number(product.price).toLocaleString("sv-SE")} kr`}
                  image={product.imageUrl}
                  ctaLabel={isAdded ? "I varukorgen" : isAdding ? "…" : "Lägg i varukorg"}
                  ctaDisabled={isAdded || isAdding}
                  ctaVariant={isAdded ? "outlined" : "contained"}
                  onCardClick={() => navigate(`/products/${product.id}`)}
                  onButtonClick={() => handleAddToCart(product)}
                />
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default ProductList;
