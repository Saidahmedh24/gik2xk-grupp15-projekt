import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductList from "./Pages/ProductList";
import ProductDetail from "./Pages/ProductDetail";
import Cart from "./Pages/Cart";
import ProductForm from "./pages/ProductForm";
import ProductEdit from "./pages/ProductEdit";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products/new" element={<ProductForm />} />
        <Route path="/products/:id/edit" element={<ProductEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;