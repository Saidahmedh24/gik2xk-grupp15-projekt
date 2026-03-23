import { Box, Button, Chip, Container, Divider, Grid, Paper, Rating, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:3000/products/${id}`).then((res) => {
      setProduct(res.data);
    });
  }, [id]);

  const handleRating = (value) => {
    setUserRating(value);
    axios.post(`http://localhost:3000/products/${id}/ratings`, { rating: value }).then(() => {
      axios.get(`http://localhost:3000/products/${id}`).then((res) => {
        setProduct(res.data);
      });
    });
  };

  const addToCart = () => {
    axios.post(`http://localhost:3000/cart/1/products/${id}`)
      .then(() => {
        window.dispatchEvent(new Event("cartUpdated"));
        navigate("/cart");
      })
      .catch((err) => {
        console.error("Fel vid tillägg i varukorg:", err);
        alert("Något gick fel! Kontrollera att backend-servern är igång.");
      });
  };

  if (!product) return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
      <Typography sx={{ color: "#6B7280" }}>Laddar...</Typography>
    </Box>
  );

  const avgRating = product.Ratings && product.Ratings.length > 0
    ? product.Ratings.reduce((sum, r) => sum + r.rating, 0) / product.Ratings.length
    : 0;
  const ratingCount = product.Ratings ? product.Ratings.length : 0;

  return (
    <Box sx={{ background: "#F5F5F7", minHeight: "100vh", py: { xs: 3, md: 6 } }}>
      <Container maxWidth="lg">
        <Button onClick={() => navigate("/")} sx={{ color: "#6B7280", mb: 3, pl: 0, "&:hover": { color: "#111827", background: "transparent" } }}>
          ← Tillbaka till butiken
        </Button>
        
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: "1px solid #E5E7EB" }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={product.imageUrl || "https://via.placeholder.com/600"}
                alt={product.name}
                sx={{ width: "100%", borderRadius: 3, objectFit: "cover", backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", aspectRatio: "1/1" }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <Box>
                  <Chip label="G-15 Exclusive" size="small" sx={{ mb: 2, background: "#4F46E5", color: "#fff", fontWeight: 700, letterSpacing: "0.05em" }} />
                  <Typography variant="h3" sx={{ fontWeight: 800, color: "#111827", mb: 1, fontSize: { xs: "2rem", md: "2.5rem" } }}>
                    {product.name}
                  </Typography>
                  
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                    <Rating value={avgRating} precision={0.5} readOnly size="small" />
                    <Typography sx={{ color: "#6B7280", fontSize: "0.9rem" }}>
                      ({ratingCount} omdömen)
                    </Typography>
                  </Box>
                  
                  <Typography sx={{ fontWeight: 800, fontSize: "2rem", color: "#4F46E5", mb: 3 }}>
                    {Number(product.price).toLocaleString("sv-SE")} kr
                  </Typography>
                  
                  <Typography sx={{ color: "#4B5563", lineHeight: 1.7, mb: 4, fontSize: "1.05rem" }}>
                    {product.description || "Ingen beskrivning tillgänglig."}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ mt: "auto" }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={addToCart}
                    sx={{
                      background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                      fontWeight: 800,
                      py: 2,
                      borderRadius: 3,
                      fontSize: "1.1rem",
                      textTransform: "none",
                      mb: 2,
                      "&:hover": {
                        background: "linear-gradient(135deg, #3730A3, #6D28D9)",
                        boxShadow: "0 8px 24px rgba(79,70,229,0.3)",
                      }
                    }}
                  >
                    Lägg i varukorg
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate(`/products/${id}/edit`)}
                    sx={{
                      fontWeight: 700,
                      py: 1.5,
                      borderRadius: 3,
                      borderColor: "#E5E7EB",
                      color: "#374151",
                      "&:hover": { borderColor: "#9CA3AF", background: "#F9FAFB" }
                    }}
                  >
                    Redigera produkt
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} sx={{ mt: 4, p: { xs: 3, md: 5 }, borderRadius: 4, border: "1px solid #E5E7EB" }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Vad tycker du om skon?</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, p: 3, background: "#F9FAFB", borderRadius: 3, border: "1px solid #E5E7EB", flexWrap: "wrap" }}>
            <Box>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Sätt ditt betyg</Typography>
              <Rating 
                value={userRating} 
                onChange={(e, val) => handleRating(val)} 
                size="large"
              />
            </Box>
            {userRating > 0 && (
              <Typography sx={{ color: "#10B981", fontWeight: 600, ml: { sm: "auto" } }}>
                ✓ Tack för ditt omdöme!
              </Typography>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ProductDetail;