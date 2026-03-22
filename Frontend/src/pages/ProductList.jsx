import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography, Button, Grid, Container } from "@mui/material";

function ProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/products").then((res) => {
      setProducts(res.data);
    });
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Produkter</Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={product.imageUrl || "https://via.placeholder.com/300"}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.price} kr
                </Typography>
              </CardContent>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate(`/products/${product.id}`)}
              >
                Visa produkt
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default ProductList;