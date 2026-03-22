import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, List, ListItem, ListItemText, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/cart/1").then((res) => {
      setCart(res.data);
    });
  }, []);

  if (!cart) return <Typography>Laddar varukorg...</Typography>;

  const products = cart.Products || [];
  const total = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <Container sx={{ mt: 4 }}>
      <Button onClick={() => navigate("/")}>← Tillbaka</Button>
      <Typography variant="h4" gutterBottom>Varukorg</Typography>
      <List>
        {products.map((p) => (
          <ListItem key={p.id}>
            <ListItemText primary={p.name} secondary={`${p.price} kr`} />
          </ListItem>
        ))}
      </List>
      <Typography variant="h6">Totalt: {total} kr</Typography>
    </Container>
  );
}

export default Cart;