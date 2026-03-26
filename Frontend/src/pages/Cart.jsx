import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepBar({ step }) {
  const steps = ["Varukorg", "Leverans", "Betalning"];
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 3, md: 4 } }}>
      {steps.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <Box key={label} sx={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, flexShrink: 0 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  transition: "all 0.25s",
                  ...(done
                    ? { background: "#4F46E5", color: "#fff", boxShadow: "0 2px 8px rgba(79,70,229,0.35)" }
                    : active
                    ? { background: "#4F46E5", color: "#fff", boxShadow: "0 2px 8px rgba(79,70,229,0.35)" }
                    : { background: "#F3F4F6", color: "#9CA3AF", border: "1.5px solid #E5E7EB" }),
                }}
              >
                {done ? "✓" : i + 1}
              </Box>
              <Typography
                sx={{
                  fontSize: { xs: "0.72rem", sm: "0.82rem" },
                  fontWeight: active ? 700 : done ? 600 : 400,
                  color: active || done ? "#111827" : "#9CA3AF",
                  display: { xs: active ? "block" : "none", sm: "block" },
                }}
              >
                {label}
              </Typography>
            </Box>
            {i < steps.length - 1 && (
              <Box sx={{ flex: 1, height: 2, mx: 1, borderRadius: 1, background: done ? "#4F46E5" : "#E5E7EB", transition: "background 0.3s" }} />
            )}
          </Box>
        );
      })}
    </Box>
  );
}

// ─── Order Summary (sidebar) ──────────────────────────────────────────────────
function OrderSummary({ products, step, onCheckout }) {
  const subtotal = products.reduce((sum, p) => sum + p.price * (p.CartItem?.quantity || 1), 0);
  return (
    <Box
      sx={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        position: { md: "sticky" },
        top: { md: 82 },
      }}
    >
      <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #E5E7EB", background: "#FAFAFA" }}>
        <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827" }}>
          Ordersammanfattning
        </Typography>
      </Box>

      {/* Items */}
      <Box sx={{ px: 3, pt: 2, pb: 1, maxHeight: 260, overflowY: "auto" }}>
        {products.map((p) => (
          <Box key={p.id} sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
            <Box
              component="img"
              src={p.imageUrl || "https://via.placeholder.com/48/F9FAFB/9CA3AF?text="}
              alt={p.name}
              sx={{ width: 48, height: 48, borderRadius: "10px", objectFit: "cover", border: "1px solid #E5E7EB", flexShrink: 0 }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {p.name}
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", color: "#9CA3AF" }}>G-15 Shoes</Typography>
            </Box>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#4F46E5", flexShrink: 0 }}>
              {p.CartItem?.quantity > 1 && `${p.CartItem.quantity} x `}
              {Number(p.price * (p.CartItem?.quantity || 1)).toLocaleString("sv-SE")} kr
            </Typography>
          </Box>
        ))}
      </Box>

      <Divider />

      <Box sx={{ px: 3, py: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography sx={{ fontSize: "0.85rem", color: "#6B7280" }}>Delsumma</Typography>
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>{subtotal.toLocaleString("sv-SE")} kr</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography sx={{ fontSize: "0.85rem", color: "#6B7280" }}>Frakt</Typography>
          <Chip label="GRATIS" size="small" sx={{ background: "rgba(16,185,129,0.08)", color: "#059669", border: "1px solid rgba(16,185,129,0.2)", fontWeight: 700, fontSize: "0.58rem", letterSpacing: "0.06em", height: 20 }} />
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>Totalt</Typography>
          <Typography sx={{ fontWeight: 800, fontSize: "1.2rem", color: "#4F46E5", letterSpacing: "-0.02em" }}>
            {subtotal.toLocaleString("sv-SE")} kr
          </Typography>
        </Box>

        {step === 2 && (
          <Button
            fullWidth
            variant="contained"
            onClick={onCheckout}
            sx={{
              background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
              fontWeight: 800,
              fontSize: "0.95rem",
              py: 1.5,
              borderRadius: "12px",
              mb: 1,
              "&:hover": { background: "linear-gradient(135deg, #3730A3, #6D28D9)", boxShadow: "0 8px 24px rgba(79,70,229,0.35)", transform: "translateY(-1px)" },
              transition: "all 0.2s",
            }}
          >
            🔒 Genomför köp
          </Button>
        )}
      </Box>

      <Box sx={{ px: 3, pb: 2.5 }}>
        <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", flexWrap: "wrap" }}>
          {["🔒 Säker", "🚚 Fri frakt", "↩️ 30 dagar"].map((b) => (
            <Typography key={b} sx={{ fontSize: "0.68rem", color: "#9CA3AF", fontWeight: 500 }}>{b}</Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

// ─── Main Cart / Checkout ─────────────────────────────────────────────────────
function Cart() {
  const [cart, setCart] = useState(null);
  const [step, setStep] = useState(0);
  const [orderNumber] = useState(() => `G15-${Math.floor(100000 + Math.random() * 900000)}`);
  const navigate = useNavigate();

  const [delivery, setDelivery] = useState({ name: "", email: "", address: "", postal: "", city: "" });
  const [paymentMethod, setPaymentMethod] = useState("klarna");
  const [errors, setErrors] = useState({});

  const fetchCart = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/cart/1`)
      .then((res) => setCart(res.data))
      .catch((err) => {
        console.error("Fel vid hämtning av varukorg:", err);
        setCart({ Products: [] }); // Fallback so it doesn't load forever
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (!cart)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <Typography sx={{ color: "#6B7280" }}>Laddar varukorg…</Typography>
      </Box>
    );

  const products = cart.Products || [];

  const setD = (key, val) => setDelivery((d) => ({ ...d, [key]: val }));

  const validateDelivery = () => {
    const e = {};
    if (!delivery.name.trim()) e.name = "Obligatoriskt";
    if (!delivery.email.trim() || !delivery.email.includes("@")) e.email = "Ogiltig e-post";
    if (!delivery.address.trim()) e.address = "Obligatoriskt";
    if (!delivery.postal.trim()) e.postal = "Obligatoriskt";
    if (!delivery.city.trim()) e.city = "Obligatoriskt";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitOrder = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/cart/1/empty`);
      setCart({ Products: [] });
      setStep(3);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Fel vid beställning:", err);
      alert("Något gick fel när beställningen skulle slutföras.");
    }
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    axios.put(`${import.meta.env.VITE_API_URL}/cart/1/products/${productId}`, { quantity: newQuantity }).then(() => {
      fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    });
  };

  const handleRemove = (productId) => {
    axios.delete(`${import.meta.env.VITE_API_URL}/cart/1/products/${productId}`).then(() => {
      fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    });
  };

  const totalItems = products.reduce((sum, p) => sum + (p.CartItem?.quantity || 1), 0);

  // ── Confirmation ────────────────────────────────────────────────────────────
  if (step === 3) {
    return (
      <Box sx={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", px: 3, background: "linear-gradient(135deg, #EEF2FF 0%, #FAF5FF 100%)" }}>
        <Box sx={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #4F46E5, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", mb: 3, boxShadow: "0 12px 30px rgba(79,70,229,0.3)", color: "#fff" }}>✓</Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#111827", mb: 1 }}>Beställning lagd!</Typography>
        <Typography sx={{ color: "#6B7280", maxWidth: 340, mb: 1 }}>
          Tack {delivery.name.split(" ")[0] || ""}! Din order skickas till {delivery.address}, {delivery.city}.
        </Typography>
        <Chip label={orderNumber} sx={{ mt: 1, mb: 1.5, background: "rgba(79,70,229,0.08)", color: "#4F46E5", border: "1px solid rgba(79,70,229,0.2)", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.04em" }} />
        <Typography sx={{ fontSize: "0.8rem", color: "#9CA3AF", mb: 4 }}>Bekräftelse skickas till {delivery.email}</Typography>
        <Button variant="contained" onClick={() => navigate("/")} sx={{ background: "#4F46E5", fontWeight: 700, px: 5, py: 1.4, borderRadius: "12px", "&:hover": { background: "#3730A3" } }}>
          Fortsätt handla
        </Button>
      </Box>
    );
  }

  const inputSx = (key) => ({
    mb: errors[key] ? 0.5 : 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      background: "#FAFAFA",
      "&.Mui-focused fieldset": { borderColor: "#4F46E5" },
      ...(errors[key] ? { "& fieldset": { borderColor: "#EF4444" } } : {}),
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#4F46E5" },
  });

  return (
    <Box sx={{ background: "#F5F5F7", minHeight: "100vh", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Button onClick={() => step === 0 ? navigate("/") : setStep(s => s - 1)} sx={{ color: "#6B7280", pl: 0, mb: 3, "&:hover": { color: "#111827", background: "transparent" } }}>
          ← {step === 0 ? "Tillbaka till butiken" : "Tillbaka"}
        </Button>

        <StepBar step={step} />
skor
        {products.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 12 }}>
            <Typography sx={{ fontSize: "4rem", mb: 2 }}></Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Din varukorg är tom</Typography>
            <Typography sx={{ color: "#6B7280", mb: 4 }}>Lägg till skor för att fortsätta</Typography>
            <Button variant="contained" onClick={() => navigate("/")} sx={{ background: "#4F46E5", fontWeight: 700, px: 4, py: 1.4, borderRadius: "12px" }}>
              Utforska kollektionen
            </Button>
          </Box>
        ) : (
          <Grid container spacing={{ xs: 2, md: 3 }} alignItems="flex-start">

            {/* ── Left panel ── */}
            <Grid item xs={12} md={7}>
              <Box sx={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 3, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>

                {/* ── Step 0: Cart items ── */}
                {step === 0 && (
                  <>
                    <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #E5E7EB", background: "#FAFAFA" }}>
                      <Typography sx={{ fontWeight: 700, color: "#111827" }}>
                        Din varukorg{" "}
                        <Typography component="span" sx={{ color: "#9CA3AF", fontWeight: 400, fontSize: "0.85rem" }}>
                          ({totalItems} {totalItems === 1 ? "artikel" : "artiklar"})
                        </Typography>
                      </Typography>
                    </Box>
                    {products.map((p, idx) => (
                      <Box key={p.id}>
                        <Box sx={{ display: "flex", gap: 2.5, px: 3, py: 2.5, alignItems: "center", flexWrap: { xs: "wrap", sm: "nowrap" } }}>
                          <Box component="img" src={p.imageUrl || "https://via.placeholder.com/80/F9FAFB/9CA3AF?text="} alt={p.name}
                            sx={{ width: { xs: 64, sm: 78 }, height: { xs: 64, sm: 78 }, objectFit: "cover", borderRadius: "12px", border: "1px solid #E5E7EB", flexShrink: 0 }} />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "0.95rem", mb: 0.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</Typography>
                            <Typography sx={{ color: "#9CA3AF", fontSize: "0.78rem" }}>G-15 Shoes</Typography>
                          </Box>
                          
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: { xs: "100%", sm: "auto" }, justifyContent: "space-between", mt: { xs: 1, sm: 0 } }}>
                            <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #E5E7EB", borderRadius: 2, overflow: "hidden" }}>
                              <Button onClick={() => handleUpdateQuantity(p.id, p.CartItem.quantity - 1)} sx={{ minWidth: 36, height: 36, p: 0, color: "#4B5563", borderRadius: 0, background: "#F9FAFB", "&:hover": { background: "#E5E7EB" } }}>-</Button>
                              <Typography sx={{ width: 40, textAlign: "center", fontSize: "0.9rem", fontWeight: 600 }}>{p.CartItem?.quantity || 1}</Typography>
                              <Button onClick={() => handleUpdateQuantity(p.id, p.CartItem.quantity + 1)} sx={{ minWidth: 36, height: 36, p: 0, color: "#4B5563", borderRadius: 0, background: "#F9FAFB", "&:hover": { background: "#E5E7EB" } }}>+</Button>
                            </Box>

                            <Box sx={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0 }}>
                              <Typography sx={{ fontWeight: 700, color: "#4F46E5", fontSize: "1rem" }}>
                                {(Number(p.price) * (p.CartItem?.quantity || 1)).toLocaleString("sv-SE")} kr
                              </Typography>
                              <Typography component="button" onClick={() => handleRemove(p.id)} sx={{ background: "none", border: "none", color: "#EF4444", fontSize: "0.75rem", cursor: "pointer", p: 0, mt: 0.5, "&:hover": { textDecoration: "underline" } }}>
                                Ta bort
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        {idx < products.length - 1 && <Divider />}
                      </Box>
                    ))}
                    <Box sx={{ px: 3, py: 2.5, borderTop: "1px solid #E5E7EB" }}>
                      <Button fullWidth variant="contained" onClick={() => setStep(1)}
                        sx={{ background: "#4F46E5", fontWeight: 700, py: 1.4, borderRadius: "12px", fontSize: "0.95rem", "&:hover": { background: "#3730A3", boxShadow: "0 6px 20px rgba(79,70,229,0.3)" } }}>
                        Till leverans →
                      </Button>
                    </Box>
                  </>
                )}

                {/* ── Step 1: Delivery ── */}
                {step === 1 && (
                  <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", color: "#111827", mb: 2.5 }}>Leveransuppgifter</Typography>
                    <TextField fullWidth label="Fullständigt namn" value={delivery.name} onChange={(e) => setD("name", e.target.value)} sx={inputSx("name")} />
                    {errors.name && <Typography sx={{ color: "#EF4444", fontSize: "0.72rem", mb: 1.5, ml: 1 }}>{errors.name}</Typography>}
                    <TextField fullWidth label="E-postadress" type="email" value={delivery.email} onChange={(e) => setD("email", e.target.value)} sx={inputSx("email")} />
                    {errors.email && <Typography sx={{ color: "#EF4444", fontSize: "0.72rem", mb: 1.5, ml: 1 }}>{errors.email}</Typography>}
                    <TextField fullWidth label="Gatuadress" value={delivery.address} onChange={(e) => setD("address", e.target.value)} sx={inputSx("address")} />
                    {errors.address && <Typography sx={{ color: "#EF4444", fontSize: "0.72rem", mb: 1.5, ml: 1 }}>{errors.address}</Typography>}
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Box sx={{ flex: "0 0 120px" }}>
                        <TextField fullWidth label="Postnummer" value={delivery.postal} onChange={(e) => setD("postal", e.target.value.replace(/\D/g, "").slice(0, 5))} sx={inputSx("postal")} />
                        {errors.postal && <Typography sx={{ color: "#EF4444", fontSize: "0.72rem", mb: 1.5, ml: 1 }}>{errors.postal}</Typography>}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <TextField fullWidth label="Stad" value={delivery.city} onChange={(e) => setD("city", e.target.value)} sx={inputSx("city")} />
                        {errors.city && <Typography sx={{ color: "#EF4444", fontSize: "0.72rem", mb: 1.5, ml: 1 }}>{errors.city}</Typography>}
                      </Box>
                    </Box>
                    <Button fullWidth variant="contained" onClick={() => { if (validateDelivery()) setStep(2); }}
                      sx={{ background: "#4F46E5", fontWeight: 700, py: 1.4, borderRadius: "12px", mt: 1, fontSize: "0.95rem", "&:hover": { background: "#3730A3", boxShadow: "0 6px 20px rgba(79,70,229,0.3)" } }}>
                      Till betalning →
                    </Button>
                  </Box>
                )}

                {/* ── Step 2: Payment ── */}
                {step === 2 && (
                  <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", color: "#111827", mb: 2.5 }}>Välj betalsätt</Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {[
                        { id: "klarna", label: "Klarna", image: "https://brand.klarna.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F4vjmgjx4%2Fproduction%2Fa919b12baf61d362fa3eb2be576542714a8c1e63-1466x1080.png%3Ffit%3Dmax%26auto%3Dformat&w=3840&q=75" },
                        { id: "swish", label: "Swish", image: "data:image/jpeg;base64,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" },
                        { id: "card", label: "Kortbetalning", image: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" }
                      ].map((method) => (
                        <Box
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            p: 2,
                            border: "2px solid",
                            borderColor: paymentMethod === method.id ? "#4F46E5" : "#E5E7EB",
                            borderRadius: "12px",
                            cursor: "pointer",
                            background: paymentMethod === method.id ? "rgba(79,70,229,0.04)" : "#fff",
                            transition: "all 0.2s"
                          }}
                        >
                          <Box sx={{ width: 48, display: "flex", justifyContent: "center" }}>
                            <Box component="img" src={method.image} alt={method.label} sx={{ maxHeight: 22, maxWidth: "100%", objectFit: "contain" }} />
                          </Box>
                          <Typography sx={{ fontWeight: 600, color: "#111827", flex: 1 }}>{method.label}</Typography>
                          {paymentMethod === method.id && <Typography sx={{ color: "#4F46E5", fontWeight: 800 }}>✓</Typography>}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* ── Right: Order Summary ── */}
            <Grid item xs={12} md={5}>
              <OrderSummary products={products} step={step} onCheckout={submitOrder} />
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default Cart;
