import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
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

function ProductCard({ name, price, image, brand, badge, isLocal, ctaLabel, ctaDisabled, ctaVariant, onCardClick, onButtonClick }) {
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
          {isLocal && (
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
          )}
          {badge && !isLocal && (
            <Chip
              label={badge}
              size="small"
              sx={{
                position: "absolute",
                top: 10,
                left: 10,
                background: "rgba(255,255,255,0.92)",
                color: "#4B5563",
                fontWeight: 600,
                fontSize: "0.62rem",
                letterSpacing: "0.04em",
                height: 20,
                textTransform: "capitalize",
              }}
            />
          )}
        </Box>

        <CardContent sx={{ flex: 1, p: 2, pb: 1 }}>
          {brand && (
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
              {brand}
            </Typography>
          )}
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

  const [localProducts, setLocalProducts] = useState([]);
  const [apiProducts, setApiProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [apiLimit, setApiLimit] = useState("24");
  const [sortBy, setSortBy] = useState("default");

  const [addingId, setAddingId] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set());

  // Fetch local products
  useEffect(() => {
    axios
      .get("http://localhost:3000/products")
      .then((res) => setLocalProducts(res.data))
      .catch(() => {});
  }, []);

  // Fetch API products on mount
  useEffect(() => {
    fetchApiProducts("", "all-shoes", "24");
  }, []);

  const fetchApiProducts = async (kw, cat, lim) => {
    setLoading(true);
    try {
      const params = { limit: lim };
      if (kw.trim()) {
        params.keyword = kw.trim();
      } else {
        params.category = "all-shoes";
      }
      const res = await axios.get("http://localhost:3000/api/sneakers", { params });
      setApiProducts(res.data.results || []);
    } catch {
      setApiProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => fetchApiProducts(keyword, "all-shoes", apiLimit);

  const handleAddToCart = async (item) => {
    setAddingId(item.id);
    try {
      if (item.source === "local") {
        const localId = item.id.replace("local-", "");
        await axios.post(`http://localhost:3000/cart/1/products/${localId}`);
      } else {
        const shoe = item.apiData;
        const productRes = await axios.post("http://localhost:3000/products", {
          name: shoe.title,
          price: Math.round(shoe.price * 10.5),
          description: shoe.description || "",
          imageUrl: shoe.thumbnail || "",
        });
        await axios.post(`http://localhost:3000/cart/1/products/${productRes.data.id}`);
      }
      setAddedIds((prev) => new Set([...prev, item.id]));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Kunde inte lägga till produkt:", err);
      alert("Något gick fel när produkten skulle läggas i varukorgen.");
    } finally {
      setAddingId(null);
    }
  };

  // Normalize & merge — local first
  const normalizedLocal = localProducts
    .filter((p) => !keyword.trim() || p.name.toLowerCase().includes(keyword.toLowerCase()))
    .map((p) => ({
      id: `local-${p.id}`,
      name: p.name,
      price: p.price,
      priceDisplay: `${Number(p.price).toLocaleString("sv-SE")} kr`,
      image: p.imageUrl,
      brand: "G-15 Shoes",
      badge: null,
      source: "local",
      isLocal: true,
    }));

  const normalizedApi = apiProducts.map((p) => ({
    id: `api-${p.id}`,
    name: p.title,
    price: Math.round(p.price * 10.5),
    priceDisplay: `${Math.round(p.price * 10.5).toLocaleString("sv-SE")} kr`,
    image: p.thumbnail,
    brand: p.brand,
    badge: p.category?.replace(/-/g, " "),
    source: "api",
    isLocal: false,
    apiData: p,
  }));

  const combined = [...normalizedLocal, ...normalizedApi].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "name_asc") return a.name.localeCompare(b.name);
    // Default: local always first
    if (a.isLocal && !b.isLocal) return -1;
    if (!a.isLocal && b.isLocal) return 1;
    return 0;
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
          {/* Search + controls */}
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "stretch" }}>
            <TextField
              placeholder="Sök skor…"
              size="small"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              sx={{ flex: "1 1 160px", minWidth: 0 }}
              InputProps={{
                startAdornment: <Box component="span" sx={{ mr: 1, color: "#9CA3AF", fontSize: "0.9rem" }}>🔍</Box>,
              }}
            />
            <FormControl size="small" sx={{ minWidth: { xs: 120, sm: 145 }, flexShrink: 0 }}>
              <InputLabel>Sortera</InputLabel>
              <Select value={sortBy} label="Sortera" onChange={(e) => setSortBy(e.target.value)}>
                <MenuItem value="default">Egna skor först</MenuItem>
                <MenuItem value="price_asc">Pris ↑</MenuItem>
                <MenuItem value="price_desc">Pris ↓</MenuItem>
                <MenuItem value="name_asc">A → Ö</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 90, flexShrink: 0 }}>
              <InputLabel>Antal</InputLabel>
              <Select
                value={apiLimit}
                label="Antal"
            onChange={(e) => { setApiLimit(e.target.value); fetchApiProducts(keyword, "all-shoes", e.target.value); }}
              >
                <MenuItem value="12">12</MenuItem>
                <MenuItem value="24">24</MenuItem>
                <MenuItem value="36">36</MenuItem>
                <MenuItem value="48">48</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
              sx={{ height: 40, px: { xs: 2, sm: 3 }, borderRadius: "10px", flexShrink: 0 }}
            >
              {loading ? <CircularProgress size={14} sx={{ color: "#fff" }} /> : "Sök"}
            </Button>
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
              {combined.length} skor · {normalizedLocal.length} egna + {normalizedApi.length} från katalog
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
        {loading && normalizedApi.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 12, gap: 2 }}>
            <CircularProgress sx={{ color: "#4F46E5" }} />
            <Typography sx={{ color: "#6B7280" }}>Laddar produkter…</Typography>
          </Box>
        ) : combined.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 12 }}>
            <Typography sx={{ fontSize: "3rem", mb: 2 }}>👟</Typography>
            <Typography variant="h6" sx={{ color: "#6B7280" }}>Inga produkter hittades</Typography>
            <Button
            onClick={() => { setKeyword(""); setSortBy("default"); fetchApiProducts("", "all-shoes", apiLimit); }}
              sx={{ mt: 2 }}
            >
              Rensa filter
            </Button>
          </Box>
        ) : (
          <Grid container spacing={{ xs: 1.5, sm: 2.5 }}>
            {combined.map((item) => {
              const isAdded = addedIds.has(item.id);
              const isAdding = addingId === item.id;
              return (
                <ProductCard
                  key={item.id}
                  name={item.name}
                  price={item.priceDisplay}
                  image={item.image}
                  brand={item.brand}
                  badge={item.badge}
                  isLocal={item.isLocal}
                  ctaLabel={isAdded ? "I varukorgen" : isAdding ? "…" : "Lägg i varukorg"}
                  ctaDisabled={isAdded || isAdding}
                  ctaVariant={isAdded ? "outlined" : "contained"}
                  onCardClick={item.isLocal ? () => navigate(`/products/${item.id.replace("local-", "")}`) : undefined}
                  onButtonClick={() => handleAddToCart(item)}
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
