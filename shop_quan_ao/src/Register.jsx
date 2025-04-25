import React, { useState } from "react";
import { Box, Typography, TextField, Button, Container, MenuItem, CircularProgress, Snackbar } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    birthday: "",
    gender: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/api/auth/register", formData);
      setOpenSnackbar(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data || "Đăng ký thất bại! Vui lòng kiểm tra thông tin.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Đăng ký
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
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={loading}
        />
        <TextField
          label="Họ"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={loading}
        />
        <TextField
          label="Tên"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={loading}
        />
        <TextField
          label="Ngày sinh"
          name="birthday"
          type="date"
          value={formData.birthday}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          disabled={loading}
        />
        <TextField
          label="Giới tính"
          name="gender"
          select
          value={formData.gender}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={loading}
        >
          <MenuItem value="">Chọn giới tính</MenuItem>
          <MenuItem value="MALE">Nam</MenuItem>
          <MenuItem value="FEMALE">Nữ</MenuItem>
          <MenuItem value="OTHER">Khác</MenuItem>
        </TextField>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleRegister}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </Button>
        <Button
          variant="text"
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => navigate("/login")}
          disabled={loading}
        >
          Đã có tài khoản? Đăng nhập
        </Button>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message="Đăng ký thành công! Đang chuyển hướng..."
        />
      </Box>
    </Container>
  );
};

export default RegisterPage;