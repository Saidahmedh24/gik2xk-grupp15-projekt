import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Rating, Box } from "@mui/material";

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
    axios.post(`http://localhost:3000/cart/1/products/${id}`).then(() => {
      alert("Produkt tillagd i varukorgen!");
    });
  };

  if (!product) return <Typography>Laddar...</Typography>;

  const avgRating = product.Ratings && product.Ratings.length > 0
    ? product.Ratings.reduce((sum, r) => sum + r.rating, 0) / product.Ratings.length
    : 0;

  return (
    <Container sx={{ mt: 4 }}>
      <Button onClick={() => navigate("/")}>← Tillbaka</Button>
      <Button onClick={() => navigate(`/products/${id}/edit`)}>
        Redigera produkt
      </Button>
      <Box
        component="img"
        src={product.imageUrl || "https://via.placeholder.com/300"}
        alt={product.name}
        sx={{ width: 300, mt: 2, display: "block" }}
      />
      <Typography variant="h4">{product.name}</Typography>
      <Typography variant="h6">{product.price} kr</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>{product.description}</Typography>

      <Box sx={{ mt: 2 }}>
        <Typography>Snittbetyg: {avgRating.toFixed(1)} / 5</Typography>
        <Typography>Sätt betyg:</Typography>
        <Rating value={userRating} onChange={(e, val) => handleRating(val)} />
      </Box>

      <Button variant="contained" sx={{ mt: 2 }} onClick={addToCart}>
        Lägg i varukorg
      </Button>
    </Container>
  );
}

export default ProductDetail;