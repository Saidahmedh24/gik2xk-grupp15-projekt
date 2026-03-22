import { useState } from "react";
import axios from "axios";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ProductForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    axios.post("http://localhost:3000/products", form).then(() => {
      navigate("/");
    });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Skapa produkt</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Namn" name="name" onChange={handleChange} />
        <TextField label="Pris" name="price" onChange={handleChange} />
        <TextField label="Beskrivning" name="description" onChange={handleChange} />
        <TextField label="Bild URL" name="imageUrl" onChange={handleChange} />
        <Button variant="contained" onClick={handleSubmit}>Skapa</Button>
        <Button onClick={() => navigate("/")}>Avbryt</Button>
      </Box>
    </Container>
  );
}

export default ProductForm;