import { useState } from "react";
import axios from "axios";
import { Container, Typography, TextField, Button, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ProductForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", price: "", description: "", imageUrl: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errs.name = "Namnet måste vara minst 2 tecken.";
    const priceNum = Number(form.price);
    if (!form.price || isNaN(priceNum) || priceNum <= 0)
      errs.price = "Priset måste vara ett positivt tal.";
    if (form.imageUrl.trim() && !/^https?:\/\/.+/.test(form.imageUrl.trim()))
      errs.imageUrl = "Bild-URL måste börja med http:// eller https://";
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    axios.post(`${import.meta.env.VITE_API_URL}/products`, { ...form, price: Number(form.price) }).then(() => {
      navigate("/");
    });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 8 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: "#111827" }}>
        Skapa produkt
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <TextField
          label="Namn *"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Pris (kr) *"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          error={!!errors.price}
          helperText={errors.price}
          inputProps={{ min: 1, step: 1 }}
        />
        <TextField
          label="Beskrivning"
          name="description"
          value={form.description}
          onChange={handleChange}
          multiline
          rows={3}
        />
        <TextField
          label="Bild URL"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          error={!!errors.imageUrl}
          helperText={errors.imageUrl}
          placeholder="https://..."
        />
        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            Rätta till felen ovan innan du sparar.
          </Alert>
        )}
        <Box sx={{ display: "flex", gap: 2, pt: 1 }}>
          <Button variant="contained" onClick={handleSubmit} sx={{ flex: 1, py: 1.4, borderRadius: "10px", fontWeight: 700 }}>
            Skapa
          </Button>
          <Button variant="outlined" onClick={() => navigate("/")} sx={{ flex: 1, py: 1.4, borderRadius: "10px" }}>
            Avbryt
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default ProductForm;
