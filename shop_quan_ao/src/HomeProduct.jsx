import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import { AppBar, Toolbar, Typography, InputBase, Badge, IconButton, Container, Grid, Card, CardMedia, CardContent, Button, Drawer, List, ListItem, ListItemText, Slider, Box, Tabs, Tab, Snackbar } from "@mui/material";
import { FiSearch, FiShoppingCart, FiHeart, FiUser } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, Divider } from "@mui/material";
import { Alert } from "@mui/material";
import { useLocation } from "react-router-dom";
const Header = styled(AppBar)(({ theme }) => ({
  background: "#ffffff",
  color: "#333333"
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  backgroundColor: "#f5f5f5",
  padding: "8px 16px",
  borderRadius: "4px",
  width: "100%",
  maxWidth: "600px"
}));

const HeroBanner = styled(Box)({
  height: "500px",
  backgroundImage: `url("https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3")`
});

const ProductCard = styled(Card)({
  height: "100%",
  display: "flex",
  flexDirection: "column"
});

const HomeProduct = ({ user, setUser }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [selectedSubTab, setSelectedSubTab] = useState("clothes");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const location = useLocation();
  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  useEffect(() => {
    if (location.state?.message) {
      setSnackbarMessage(location.state.message);
      setSnackbarSeverity(location.state.severity || "success");
      setOpenSnackbar(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };
  const API_BASE_URL = "http://localhost:8080";

  useEffect(() => {
    // Chọn đúng hàm khi thay đổi tab hoặc subtab
    if (selectedTab === 0) {
      fetchAllProducts();
    } else {
      const category = selectedTab === 1 ? "male" : selectedTab === 2 ? "female" : "";
      fetchProductsByCategoryAndType(category, selectedSubTab);
    }
  }, [selectedTab, selectedSubTab]);
  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get("/api/api/products");
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching all products:", error);
      setSnackbarMessage("Không thể lấy danh sách sản phẩm!");
      setOpenSnackbar(true);
    }
  };

  const fetchProductsByCategoryAndType = async (category = "", type = "") => {
    try {
      let url = "/api/api/products";  // Địa chỉ API mặc định
      const params = [];
      if (category) {
        params.push(`category=${category}`);
      }
  
      // Thêm tham số type nếu có
      if (type) {
        params.push(`type=${type}`);
      }
  
      // Nếu có tham số, nối chúng vào URL
      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }
  
      const response = await axios.get(url);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products by category and type:", error);
      setSnackbarMessage("Không thể lấy danh sách sản phẩm theo thể loại và loại sản phẩm!");
      setOpenSnackbar(true);
    }
  };
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setSelectedSubTab("clothes"); // Mặc định là 'clothes' khi thay đổi tab chính
    if (newValue === 0) {
      fetchAllProducts(); // Fetch tất cả sản phẩm khi tab "Tất cả sản phẩm" được chọn
    } else if (newValue === 1) {
      // Fetch sản phẩm nam, và loại mặc định là 'clothes'
      fetchProductsByCategoryAndType("male", "clothes");
    } else if (newValue === 2) {
      // Fetch sản phẩm nữ
      fetchProductsByCategoryAndType("female", "clothes");
    }
  };
  
  const handleSubTabChange = (event, newValue) => {
    setSelectedSubTab(newValue);
    const category = selectedTab === 1 ? "male" : selectedTab === 2 ? "female" : "";
    fetchProductsByCategoryAndType(category, newValue); // Fetch sản phẩm theo category và type
  };



  const handleSearch = async () => {
    try {
      if (searchQuery) {
        const response = await axios.get(`/api/api/products/search?name=${searchQuery}`);
        setFilteredProducts(response.data);
      } else {
        setFilteredProducts(products);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setSnackbarMessage("Không thể tìm kiếm sản phẩm!");
      setOpenSnackbar(true);
    }
  };

  const handleFilter = async () => {
    try {
      const category = selectedTab === 1 ? "male" : selectedTab === 2 ? "female" : "";
      const response = await axios.get(
        `/api/api/search/filter?minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&category=${category}`
      );
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error filtering products:", error);
      setSnackbarMessage("Không thể lọc sản phẩm!");
      setOpenSnackbar(true);
    }
  };
  const handleAddToCart = async (product) => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/api/cart/add`,
        { productId: product.id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchCart();
      setSnackbarMessage("Đã thêm vào giỏ hàng!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setSnackbarMessage("Không thể thêm vào giỏ hàng!");
      setOpenSnackbar(true);
    }
  };
  
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setSnackbarMessage("Không thể lấy giỏ hàng!");
      setOpenSnackbar(true);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE_URL}/api/payment/process`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCartItems([]);
      setSnackbarMessage("Thanh toán thành công!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error during payment:", error);
      setSnackbarMessage("Thanh toán thất bại!");
      setOpenSnackbar(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setCartItems([]);
    navigate("/login", { state: { logout: true } });
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box>
      <Header position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            SHOP FASHION NNN
          </Typography>
          <SearchInput
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <IconButton onClick={() => handleSearch()}>
            <FiSearch />
          </IconButton>
          <IconButton onClick={() => setCartOpen(true)}>
            <Badge badgeContent={cartItems.length} color="primary">
              <FiShoppingCart />
            </Badge>
          </IconButton>
          <IconButton onClick={handleUserMenuClick}>
            <FiUser />
            {user && <Typography variant="body2" sx={{ ml: 1 }}>{user.username}</Typography>}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleUserMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {user && (
              <>
                <MenuItem disabled>Tên: {user.username}</MenuItem>
                <MenuItem disabled>Email: {user.email}</MenuItem>
                <Divider />
                <Box sx={{ px: 2, pb: 1 }}>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={() => {
                      handleLogout();
                      handleUserMenuClose();
                    }}
                  >
                    Đăng xuất
                  </Button>
                </Box>
              </>
            )}
            {!user && (
              <MenuItem onClick={() => {
                navigate("/login");
                handleUserMenuClose();
              }}>
                Đăng nhập
              </MenuItem>
            )}
          </Menu>
        </Toolbar>
      </Header>

      <HeroBanner>
        <Container>
          <Box sx={{ pt: 20 }}>
            <Typography variant="h2" color="white">
              Bộ sưu tập mới
            </Typography>
            <Button variant="contained" size="large" sx={{ mt: 2 }}>
              Mua sắm ngay
            </Button>
          </Box>
        </Container>
      </HeroBanner>

      <Container sx={{ mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={selectedTab} onChange={handleTabChange} centered>
            <Tab label="Tất cả sản phẩm" />
            <Tab label="Bộ sưu tập nam" />
            <Tab label="Bộ sưu tập nữ" />
          </Tabs>
        </Box>

        {selectedTab !== 0 && (
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={selectedSubTab} onChange={handleSubTabChange} centered>
              <Tab label="Quần áo" value="clothes" />
              <Tab label="Quần" value="pants" />
              <Tab label="Phụ kiện" value="accessories" />
            </Tabs>
          </Box>
        )}

        <Grid container spacing={2}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <ProductCard>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography>${product.price}</Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => handleAddToCart(product)}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </CardContent>
              </ProductCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Box sx={{ width: 350, p: 2 }}>
          <Typography variant="h6">Giỏ hàng</Typography>
          <List>
            {cartItems.map((item) => (
              <ListItem key={item.id}>
                <ListItemText
                  primary={item.productName}
                  secondary={`$${item.productPrice} x ${item.quantity}`}
                />
              </ListItem>
            ))}
          </List>
          <Button variant="contained" fullWidth onClick={handleCheckout}>
            Thanh toán
          </Button>
        </Box>
      </Drawer>

      <Drawer anchor="left" open={filterOpen} onClose={() => setFilterOpen(false)}>
        <Box sx={{ width: 280, p: 2 }}>
          <Typography variant="h6">Bộ lọc</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography>Khoảng giá</Typography>
            <Slider
              value={priceRange}
              onChange={(e, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              max={1000}
            />
          </Box>
          <Button variant="contained" fullWidth onClick={handleFilter}>
            Áp dụng bộ lọc
          </Button>
        </Box>
      </Drawer>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bot", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomeProduct;