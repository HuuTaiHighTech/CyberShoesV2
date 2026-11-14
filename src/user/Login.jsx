import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL, saveUser } from "../util/variable_global";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_URL}/users?email=${encodeURIComponent(form.email)}`);
      const list = res.ok ? await res.json() : [];
      console.log("Login response:", list);

      // So khớp chính xác email + password
      const user = list.find((u) => u.email === form.email && u.password === form.password);

      if (user) {
        saveUser(user);
        alert("Đăng nhập thành công!");
        navigate("/");
      } else {
        setError("Sai email hoặc mật khẩu");
      }
    } catch (err) {
      console.error(err);
      setError("Không kết nối được tới server");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Đăng nhập</h2>
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <br />
      <input name="password" type="password" placeholder="Mật khẩu" onChange={handleChange} required />
      <br />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Đăng nhập</button>
      <p>
        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </p>
    </form>
  );
}