import React, { useState } from "react";
import { ThemeProvider, Box, AppBar, Toolbar, Typography, Button, Grid, Card, CardContent, CardMedia, IconButton, TextField, InputAdornment, createTheme, Paper, Container } from "@mui/material";
import { styled } from "@mui/system";
import { FiSearch, FiShoppingCart, FiHeart, FiUser } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" }
  }
});

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  position: "fixed",
  width: "100%"
});

const SearchBar = styled(TextField)({
  backgroundColor: "#f5f5f5",
  borderRadius: "8px",
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "transparent" },
    "&:hover fieldset": { borderColor: "transparent" }
  }
});

const ProductCard = styled(Card)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
  }
});

const Banner = styled(Box)({
  height: "100vh",
  backgroundImage: "url(https://images.unsplash.com/photo-1441986300917-64674bd600d8)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
});

const Footer = styled(Paper)({
  padding: "40px 0",
  backgroundColor: "#f8f8f8",
  marginTop: "4rem",
  width: "100%"
});

const featuredProducts = [
  { id: 1, title: "Denim Jacket", price: "$89.99", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e", category: "Men" },
  { id: 2, title: "Summer Dress", price: "$69.99", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1", category: "Women" },
  { id: 3, title: "White Sneakers", price: "$79.99", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772", category: "Accessories" },
  { id: 4, title: "Crossbody Bag", price: "$129.99", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa", category: "Accessories" }
];

const EcommerceApp = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ThemeProvider theme={theme}>
      <StyledAppBar>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#333" }}>FASHION STORE</Typography>
          <SearchBar
            fullWidth
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ maxWidth: 400, mx: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch />
                </InputAdornment>
              )
            }}
          />
          <IconButton><FiHeart style={{ color: "#333" }} /></IconButton>
          <IconButton><FiShoppingCart style={{ color: "#333" }} /></IconButton>
          <IconButton><FiUser style={{ color: "#333" }} /></IconButton>
        </Toolbar>
      </StyledAppBar>

      <Banner>
        <Box sx={{ textAlign: "center", color: "white", p: 4, backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 2 ,width:'100vw'}}>
          <Typography variant="h2">Summer Collection 2024</Typography>
          <Typography variant="h5">Discover the latest trends in fashion</Typography>
          <Button variant="contained" size="large">Shop Now</Button>
        </Box>
      </Banner>

      <Container maxWidth="xl" sx={{ mt: 10 }}>
        <Typography variant="h4" gutterBottom>Featured Products</Typography>
        <Grid container spacing={3}>
          {featuredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={3}>
              <ProductCard>
                <CardMedia component="img" height="200" image={product.image} alt={product.title} />
                <CardContent>
                  <Typography gutterBottom variant="h6">{product.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{product.category}</Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>{product.price}</Typography>
                  <Button variant="contained" fullWidth sx={{ mt: 2 }}>Add to Cart</Button>
                </CardContent>
              </ProductCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer>
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center">© 2024 Fashion Store. All rights reserved.</Typography>
        </Container>
      </Footer>
    </ThemeProvider>
  );
};

export default EcommerceApp;
