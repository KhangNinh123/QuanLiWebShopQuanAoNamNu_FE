import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import { AppBar, Toolbar, Typography, InputBase, Badge, IconButton, Container, Grid, Card, CardMedia, CardContent, Button, Drawer, List, ListItem, ListItemText, Slider, Box, Tabs, Tab, Snackbar, TextField } from "@mui/material";
import { FiSearch, FiShoppingCart, FiHeart, FiUser } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, Divider, CircularProgress } from "@mui/material";
import { Alert } from "@mui/material";
import { useLocation } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

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
  flexDirection: "column",
  position: "relative"
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
  const [quantityMap, setQuantityMap] = useState({});
  const [paymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [favoriteProductIds, setFavoriteProductIds] = useState([]);
  const [unfavoriteProducts, setUnfavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [minPrice, setMinPrice] = React.useState('');
  const [maxPrice, setMaxPrice] = React.useState('');
  const selectedType = selectedSubTab !== null ? selectedSubTab : "";
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
  useEffect(() => {
    const initialQuantities = {};
    filteredProducts.forEach(p => {
      initialQuantities[p.id] = 1;
    });
    setQuantityMap(initialQuantities);
  }, [filteredProducts]);

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };
  const API_BASE_URL = "http://localhost:8080";

  useEffect(() => {
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
      if (type) {
        params.push(`type=${type}`);
      }
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

    if (newValue === 3) {
      // Tab yêu thích
      setFilteredProducts([]);
      setSelectedSubTab("");
      fetchFavorites();
    } else {
      setSelectedSubTab("clothes");
      if (newValue === 0) fetchAllProducts();
      else if (newValue === 1) fetchProductsByCategoryAndType("male", "clothes");
      else if (newValue === 2) fetchProductsByCategoryAndType("female", "clothes");
    }
  };

  // Khi đổi subtab
  const handleSubTabChange = (event, newValue) => {
    if (selectedTab === 3) return; // Không đổi subtab khi đang ở tab Yêu thích
    setSelectedSubTab(newValue);
    const category = selectedTab === 1 ? "male" : selectedTab === 2 ? "female" : "";
    fetchProductsByCategoryAndType(category, newValue);
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
      const min = minPrice ? Number(minPrice) : 0;
      const max = maxPrice ? Number(maxPrice) : 1000000;

      if (min > max && min <= 1) {
        setSnackbarMessage("Giá từ không thể lớn hơn giá đến! hoặc giá từ không thể nhỏ hơn 1");
        setOpenSnackbar(true);
        return;
      }

      let url = `/api/api/products/filter?minPrice=${min}&maxPrice=${max}`;
      if (category !== "") {
        url += `&category=${category}`;
      }
      if (selectedType) {
        url += `&type=${selectedType}`;  // selectedType ví dụ là "clothes", "pants", "accessories"
      }

      const response = await axios.get(url);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error filtering products:", error);
      setSnackbarMessage("Không thể lọc sản phẩm!");
      setOpenSnackbar(true);
    }
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);  // Log token to verify it's stored properly
    return token ? { headers: { Authorization: `Bearer ${token}` } } : null;
  };
  const handleAddToCart = async ({ product_id, quantity }) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const authHeader = getAuthHeader();
    if (!authHeader) {
      navigate("/login");
      return;
    }

    const product = filteredProducts.find(p => p.id === product_id);
    if (!product || quantity > product.quantity) {
      setSnackbarMessage("Số lượng vượt quá số lượng trong kho!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      await axios.post(
        `/api/api/cart/add`,
        { productId: product_id, quantity },
        authHeader
      );
      await fetchCart();
      setSnackbarMessage("Đã thêm vào giỏ hàng!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Error adding to cart:", error);
      setSnackbarMessage("Không thể thêm vào giỏ hàng!");
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
    }
  };
  const handleQuantityChange = (productId, value) => {
    setQuantityMap(prev => ({
      ...prev,
      [productId]: value
    }));
  };
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("/api/api/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCartItems(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      setSnackbarMessage("Không thể lấy giỏ hàng!");
      setSnackbarSeverity("error");
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
      if (!token) {
        setSnackbarMessage("Bạn cần đăng nhập để thanh toán!");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      const response = await axios.post(
        "/api/api/payment/process",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Kết quả thanh toán:", response.data); // debug

      setCartItems([]); // Clear cart sau thanh toán thành công
      setSnackbarMessage("Thanh toán thành công!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      setSnackbarMessage("Thanh toán thất bại!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  const fetchPaymentHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("/api/api/payment/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Lịch sử thanh toán:", response.data);
      // Xử lý dữ liệu nếu cần
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử thanh toán:", error);
      setSnackbarMessage("Không thể lấy lịch sử thanh toán!");
      setSnackbarSeverity("error");
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

  const handleToggleFavorite = async (productId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const isFav = favoriteProductIds.includes(productId);

    // Cập nhật UI trước
    if (isFav) {
      setFavoriteProductIds((prev) => prev.filter((id) => id !== productId));
    } else {
      setFavoriteProductIds((prev) => [...prev, productId]);
    }

    try {
      const token = localStorage.getItem("token");
      const authHeader = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (isFav) {
        await axios.delete(
          `/api/api/favorites?userId=${user.id}&productId=${productId}`,
          authHeader
        );
        setSnackbarMessage("Đã xóa khỏi yêu thích!");
        setSnackbarSeverity("info");
      } else {
        await axios.post(
          `/api/api/favorites?userId=${user.id}&productId=${productId}`,
          {},
          authHeader
        );
        setSnackbarMessage("Đã thêm vào yêu thích!");
        setSnackbarSeverity("success");
      }
    } catch (err) {
      console.error("Lỗi khi xử lý yêu thích", err);
      setSnackbarMessage("Thao tác yêu thích thất bại!");
      setSnackbarSeverity("error");

      // Rollback nếu lỗi
      if (isFav) {
        setFavoriteProductIds((prev) => [...prev, productId]);
      } else {
        setFavoriteProductIds((prev) => prev.filter((id) => id !== productId));
      }
    } finally {
      setOpenSnackbar(true);
    }
  };
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token || !user) {
        return;
      }

      const response = await axios.get(`/api/api/favorites/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.length > 0) {
        const productsFromFavorites = response.data.map(item => item.product);
        setFilteredProducts(productsFromFavorites);

        // Cập nhật danh sách ID sản phẩm yêu thích cho UI
        const favIds = productsFromFavorites.map(p => p.id);
        setFavoriteProductIds(favIds);

      } else {
        setFilteredProducts([]);
        setFavoriteProductIds([]);
      }
    } catch (error) {
      console.error("Lỗi fetch sản phẩm yêu thích:", error);
    }
    finally {
      setLoading(false);
    }
  };
  const fetchUnfavoriteProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !user) {
        setUnfavoriteProducts([]);
        return;
      }

      // Lấy tất cả sản phẩm
      const allProductsResponse = await axios.get("/api/api/products");
      const allProducts = allProductsResponse.data;

      // Lấy sản phẩm yêu thích
      const favoritesResponse = await axios.get(`/api/api/favorites/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const favoriteProducts = favoritesResponse.data.map(item => item.product);

      // Lọc sản phẩm chưa yêu thích
      const favoriteIds = new Set(favoriteProducts.map(p => p.id));
      const unfavorites = allProducts.filter(p => !favoriteIds.has(p.id));

      setUnfavoriteProducts(unfavorites);
    } catch (error) {
      console.error("Lỗi fetch sản phẩm chưa yêu thích:", error);
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      if (!user) {
        setFavoriteProductIds([]);
        setUnfavoriteProducts([]);
        setFilteredProducts([]); // clear để loading hiện
        return;
      }

      setLoading(true);
      setFilteredProducts([]); // clear dữ liệu cũ để React render loading
      await new Promise(resolve => setTimeout(resolve, 0)); // để React cập nhật

      const start = Date.now();

      await fetchFavorites();

      if (selectedTab === 3) {
        await fetchUnfavoriteProducts();
      } else {
        setUnfavoriteProducts([]);
        if (selectedTab === 0) {
          await fetchAllProducts();
        } else if (selectedTab === 1) {
          await fetchProductsByCategoryAndType("male", selectedSubTab);
        } else if (selectedTab === 2) {
          await fetchProductsByCategoryAndType("female", selectedSubTab);
        }
      }

      const elapsed = Date.now() - start;
      const delay = 2000 - elapsed;
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      setLoading(false);
    };

    loadProducts();
  }, [user, selectedTab, selectedSubTab]);


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
                <MenuItem
                  onClick={() => {
                    fetchPaymentHistory();
                    setPaymentHistoryOpen(true);
                    handleUserMenuClose();
                  }}
                >
                  Lịch sử thanh toán
                </MenuItem>
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
            <Tab label="Yêu thích" />
          </Tabs>

          {selectedTab !== 3 && ( // 👉 chỉ hiển thị khi KHÔNG phải tab Yêu thích
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Typography sx={{ whiteSpace: 'nowrap', minWidth: 70 }}>Khoảng giá:</Typography>

              <TextField
                label="Giá từ"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                inputProps={{ min: 0 }}
                sx={{ width: 120 }}
                size="small"
              />

              <Typography sx={{ whiteSpace: 'nowrap' }}>đến</Typography>

              <TextField
                label="Giá đến"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                inputProps={{ min: 0 }}
                sx={{ width: 120 }}
                size="small"
              />

              <Button
                variant="contained"
                onClick={handleFilter}
                sx={{ height: 40, whiteSpace: 'nowrap' }}
              >
                Lọc theo giá
              </Button>
            </Box>
          )}
        </Box>




        {selectedTab !== 0 && selectedTab !== 3 && (
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={selectedSubTab} onChange={handleSubTabChange} centered>
              <Tab label="Quần áo" value="clothes" />
              <Tab label="Quần" value="pants" />
              <Tab label="Phụ kiện" value="accessories" />
            </Tabs>
          </Box>
        )}

        {loading ? (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Đang tải sản phẩm, vui lòng chờ...
            </Typography>
          </Box>
        ) : (
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
                    <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                      <IconButton
                        onClick={() => handleToggleFavorite(product.id)}
                        sx={{ color: favoriteProductIds.includes(product.id) ? "red" : "gray" }}
                      >
                        {favoriteProductIds.includes(product.id) ? <FaHeart /> : <FiHeart />}
                      </IconButton>
                    </Box>

                    <Typography variant="h6">{product.name}</Typography>
                    <Typography>Giá: ${product.price}</Typography>
                    <Typography>Số lượng: {product.quantity ?? 0}</Typography>

                    <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography>Số lượng:</Typography>
                      <InputBase
                        type="number"
                        inputProps={{ min: 1, max: product.quantity }}
                        value={quantityMap[product.id] || 1}
                        onChange={(e) =>
                          handleQuantityChange(product.id, Math.min(Math.max(1, parseInt(e.target.value) || 1), product.quantity))
                        }
                        sx={{ width: 60, border: "1px solid #ccc", borderRadius: 1, px: 1 }}
                      />
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() =>
                        handleAddToCart({ product_id: product.id, quantity: quantityMap[product.id] || 1 })
                      }
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </CardContent>
                </ProductCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>


      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Box sx={{ width: 350, p: 2 }}>
          <Typography variant="h6">Giỏ hàng</Typography>
          <List>
            {cartItems.length === 0 ? (
              <ListItem>
                <ListItemText primary="Giỏ hàng của bạn trống!" />
              </ListItem>
            ) : (
              cartItems.map((item) => (
                <ListItem key={item.id}>
                  <ListItemText
                    primary={item.productName}
                    secondary={`$${item.productPrice} x ${item.quantity}`}
                  />
                </ListItem>
              ))
            )}
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
      <Drawer anchor="right" open={paymentHistoryOpen} onClose={() => setPaymentHistoryOpen(false)}>
        <Box sx={{ width: 400, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Lịch sử thanh toán
          </Typography>
          {paymentHistory.length === 0 ? (
            <Typography>Không có giao dịch nào.</Typography>
          ) : (
            <List>
              {paymentHistory.map((payment, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={`Mã giao dịch: ${payment.id}`}
                    secondary={
                      <>
                        <Typography variant="body2">
                          Tổng tiền: ${payment.total}
                        </Typography>
                        <Typography variant="body2">
                          Ngày thanh toán: {new Date(payment.timestamp).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Drawer>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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