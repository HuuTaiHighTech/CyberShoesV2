import { createRoot } from "react-dom/client";
import "./main.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminTemplate from "./templates/AdminTemplate";
import Dashboard from "./pages/admin/Dashboard";
import AdminProductList from "./pages/admin/ProductList";
import CreateAndEdit from "./pages/admin/CreateAndEdit";
import ManageOrder from "./pages/admin/ManagerOrder";
import ClientTemplate from "./templates/ClientTemplate";
import HomePage from "./pages/client/HomePage";
import ClientProductList from "./pages/client/ProductList";
import Introduce from "./pages/client/Introduce";
import Contact from "./pages/client/Contact";
import WishList from "./pages/client/WishList";
import Cart from "./pages/client/Cart";
import DetailProduct from "./pages/client/DetailProduct";
import SignInAndSignOut from "./pages/client/SignInAndSignUp";
import Demo from "./pages/Demo";
import SignInAndSignUp from "./pages/client/SignInAndSignUp";
import ProductList from "./pages/client/ProductList";
// nhiệm vụa của nó kết nối ưng dụng
import { Provider } from "react-redux";
import { store } from "./redux/store";
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin" element={<AdminTemplate />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<AdminProductList />} />
          <Route path="product/:id?" element={<CreateAndEdit />} />
          <Route path="orders" element={<ManageOrder />} />
        </Route>

        <Route path="/demo" element={<Demo />} />
        <Route path="/" element={<ClientTemplate />}>
          <Route index element={<HomePage />} />
          <Route path="homepage" element={<HomePage />} />
          <Route path="products" element={<ClientProductList />} />
          <Route path="products/:category" element={<ClientProductList />} />
          <Route path="introduce" element={<Introduce />} />
          <Route path="contact" element={<Contact />} />
          <Route path="wishlist" element={<WishList />} />
          <Route path="Cart" element={<Cart />} />
          <Route path="get-all-product" element={<ProductList />} />
          <Route path="get-all-product/detail/:id" element={<DetailProduct />} />
          <Route path="sign-in" element={<SignInAndSignUp />} />
        </Route>
      </Routes>
    </Provider>
  </BrowserRouter>
)
