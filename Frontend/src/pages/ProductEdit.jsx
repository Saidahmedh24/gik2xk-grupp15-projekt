import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: ""
  });

  useEffect(() => {
    axios.get(`http://localhost:3000/products/${id}`).then((res) => {
      setForm(res.data);
    });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    axios.put(`http://localhost:3000/products/${id}`, form).then(() => {
      navigate("/");
    });
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:3000/products/${id}`).then(() => {
      navigate("/");
    });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Redigera produkt</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Namn" name="name" value={form.name || ""} onChange={handleChange} />
        <TextField label="Pris" name="price" value={form.price || ""} onChange={handleChange} />
        <TextField label="Beskrivning" name="description" value={form.description || ""} onChange={handleChange} />
        <TextField label="Bild URL" name="imageUrl" value={form.imageUrl || ""} onChange={handleChange} />
        <Button variant="contained" onClick={handleSubmit}>Spara</Button>
        <Button variant="outlined" color="error" onClick={handleDelete}>Ta bort produkt</Button>
        <Button onClick={() => navigate("/")}>Avbryt</Button>
      </Box>
    </Container>
  );
}

export default ProductEdit;