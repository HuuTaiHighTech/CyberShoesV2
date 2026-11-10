const Logout = () => {
  const handleLogout = () => {
    // Xóa thông tin đăng nhập đã lưu
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userLogin");

    // TODO: reset state (redux/context) nếu có
    // Chuyển về trang đăng nhập
    window.location.href = "/login";
  };

  return (
    <button type="button" className="btn-logout" onClick={handleLogout}>
      Đăng xuất
    </button>
  );
};

export default Logout;