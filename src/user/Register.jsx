import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../util/variable_global";

export default function Regester() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", name: "", phone: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // 1. Kiểm tra email đã tồn tại chưa
      const check = await fetch(`${API_URL}/users?email=${encodeURIComponent(form.email)}`);
      const existed = check.ok ? await check.json() : [];
      if (existed.some((u) => u.email === form.email)) {
        setError("Email đã được đăng ký");
        return;
      }

      // 2. Tạo user mới
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log("Register response:", data);

      if (res.ok) {
        alert("Đăng ký thành công!");
        navigate("/login");
      } else {
        setError("Đăng ký thất bại");
      }
    } catch (err) {
      console.error(err);
      setError("Không kết nối được tới server");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Đăng ký</h2>
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <br />
      <input name="password" type="password" placeholder="Mật khẩu" onChange={handleChange} required />
      <br />
      <input name="name" placeholder="Họ tên" onChange={handleChange} required />
      <br />
      <input name="phone" placeholder="Số điện thoại" onChange={handleChange} required />
      <br />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Đăng ký</button>
      <p>
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </form>
  );
}