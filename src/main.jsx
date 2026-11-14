import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./main.css";
import Login from "./user/Login";
import Regester from "./user/Register";
import Logout from "./user/Logout";
import { getUser } from "./util/variable_global";

const Home = () => {
  const user = getUser();
  if (!user) return <Navigate to="/login" />;
  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>Xin chào, {user.name}</h2>
      <Logout />
    </div>
  );
};

createRoot(document.getElementById("root")).render(
  
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Regester />} />
      </Routes>
    </BrowserRouter>
  
);