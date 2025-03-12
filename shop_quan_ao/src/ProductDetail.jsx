import React, { useState } from "react";
import { ThemeProvider, Box, AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent, CardMedia, IconButton, createTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FiShoppingCart, FiHeart, FiUser } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2"
    },
    secondary: {
      main: "#dc004e"
    }
  }
});

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
}));

const productDetail = {
  id: 1,
  title: "Premium Denim Jacket",
  price: "$89.99",
  image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e",
  category: "Men",
  description: "A premium quality denim jacket perfect for any casual occasion. Made with 100% cotton denim, featuring classic styling with modern details.",
  sizes: ["XS", "S", "M", "L", "XL"],
  colors: ["Blue", "Black", "Light Wash"],
  specifications: [
    "100% Cotton Denim",
    "Button Closure",
    "Machine Washable",
    "Classic Fit",
    "Two Front Pockets"
  ],
  additionalImages: [
    "https://images.unsplash.com/photo-1516257984-b1b4d707412e",
    "https://images.unsplash.com/photo-1542272604-787c3835535d",
    "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504",
    "https://images.unsplash.com/photo-1514027553435-f982df9b8b4b"
  ]
};

const ProductDetail = () => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <StyledAppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, color: "#333" }}>
              FASHION STORE
            </Typography>
            <IconButton>
              <FiHeart style={{ color: "#333" }} />
            </IconButton>
            <IconButton>
              <FiShoppingCart style={{ color: "#333" }} />
            </IconButton>
            <IconButton>
              <FiUser style={{ color: "#333" }} />
            </IconButton>
          </Toolbar>
        </StyledAppBar>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="600"
                  image={productDetail.image}
                  alt={productDetail.title}
                  sx={{ borderRadius: 2 }}
                />
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {productDetail.additionalImages.map((img, index) => (
                    <Grid item xs={3} key={index}>
                      <CardMedia
                        component="img"
                        height="100"
                        image={img}
                        alt={`${productDetail.title}-${index}`}
                        sx={{ borderRadius: 1, cursor: "pointer" }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ pl: { md: 4 } }}>
                <Typography variant="h4" gutterBottom>
                  {productDetail.title}
                </Typography>
                <Typography variant="h5" color="primary" gutterBottom>
                  {productDetail.price}
                </Typography>
                <Typography variant="body1" sx={{ my: 3 }}>
                  {productDetail.description}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>Size</Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {productDetail.sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "contained" : "outlined"}
                        onClick={() => setSelectedSize(size)}
                        sx={{ minWidth: 60 }}
                      >
                        {size}
                      </Button>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>Color</Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {productDetail.colors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? "contained" : "outlined"}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </Button>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>Quantity</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <Typography>{quantity}</Typography>
                    <Button
                      variant="outlined"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<FiShoppingCart />}
                  sx={{ mb: 2 }}
                >
                  Add to Cart
                </Button>

                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>Specifications</Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {productDetail.specifications.map((spec, index) => (
                      <Typography component="li" key={index} sx={{ mb: 1 }}>
                        {spec}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>

        <Box component="footer" sx={{ bgcolor: "#f8f8f8", py: 6, mt: 4 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  About Fashion Store
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We are your premier destination for fashion-forward clothing and accessories.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: info@fashionstore.com
                  <br />
                  Phone: +1 (555) 123-4567
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Follow Us
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <IconButton><FaFacebook /></IconButton>
                  <IconButton><FaTwitter /></IconButton>
                  <IconButton><FaInstagram /></IconButton>
                  <IconButton><FaLinkedin /></IconButton>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ProductDetail;