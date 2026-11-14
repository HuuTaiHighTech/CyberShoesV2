import { useNavigate } from "react-router-dom";
import { clearUser } from "../util/variable_global";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    alert("Đã đăng xuất!");
    navigate("/login");
  };

  return <button onClick={handleLogout}>Đăng xuất</button>;
}