import React, { useState } from "react";
import { Box, Typography, TextField, Button, Container, CircularProgress, Snackbar ,Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
const LoginPage = ({ setUser }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (location.state?.logout) {
      setOpenSnackbar(true);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("/api/api/auth/login", formData);
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      setOpenSnackbar(true);
      navigate("/", {
        state: {
          message: "Đăng nhập thành công!",
          severity: "success"
        }
      });
    } catch (err) {
      setError(err.response?.data || "Đăng nhập thất bại! Vui lòng kiểm tra thông tin đăng nhập.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Đăng nhập
        </Typography>
        {error && (
          <Typography color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <TextField
          label="Tên đăng nhập"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={loading}
        />
        <TextField
          label="Mật khẩu"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={loading}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
        <Button
          variant="text"
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => navigate("/register")}
          disabled={loading}
        >
          Chưa có tài khoản? Đăng ký
        </Button>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "bot", horizontal: "center" }}
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
            Đăng xuất thành công!
          </Alert>
        </Snackbar>

      </Box>
    </Container>
  );
};

export default LoginPage;