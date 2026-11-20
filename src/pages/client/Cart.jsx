import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCredentials } from "../../redux/authSlice";
import {
  clearCart,
  changeCartQuantity,
  removeFromCart,
} from "../../redux/cartSlice";
import { placeOrder } from "../../redux/apiSlice";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const { accessToken, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");

  const handleOrder = async () => {
    if (!accessToken) {
      navigate("/sign-in");
      return;
    }

    if (!user?.email) {
      setOrderMessage("Không tìm thấy email tài khoản để đặt hàng.");
      return;
    }

    if (cart.length === 0) {
      setOrderMessage("Giỏ hàng đang trống.");
      return;
    }

    const orderData = {
      email: user.email,
      orderDetail: cart.map((item) => ({
        productId: String(item.id),
        quantity: item.quantity,
      })),
    };

    setIsSubmitting(true);
    setOrderMessage("");

    try {
      await dispatch(placeOrder({ orderData, accessToken })).unwrap();
      dispatch(clearCart());
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Gọi API đặt hàng thất bại:", error);
      if (error?.status === 401) {
        window.localStorage.removeItem("userLogin");
        dispatch(clearCredentials());
        navigate("/sign-in", { replace: true });
        return;
      }

      setOrderMessage(`Đặt hàng thất bại: ${error?.message || error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCart = () => {
    const arrCart = cart.map((item) => {
      return (
          <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>${item.price}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-primary" onClick={() => {
                    dispatch(changeCartQuantity({ id: item.id, amount: -1 }))
                  }
                  }
                >
                  -
                </button>
                <span className="p-3">{item.quantity}</span>
                <button
                  type="button"
                  className="btn btn-primary" onClick={() => {
                    dispatch(changeCartQuantity({ id: item.id, amount: 1 }))
                  }
                  }
                >
                  +
                </button>
              </td>
              <td>${item.price * item.quantity}</td>
              <td>
                <button className="btn btn-danger" onClick={() => {
                  dispatch(removeFromCart(item.id))
                }}>Remove</button>
              </td>
            </tr>
      )
    }
    )
    return arrCart;
  }

  const renderBillItems = () => cart.map((item) => (
    <tr key={item.id}>
      <td>{item.name}</td>
      <td>{item.quantity}</td>
      <td>${item.price * item.quantity}</td>
    </tr>
  ));

  const calculateBillTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className='container'>
      <h2>Trang giỏ hàng</h2>
      <div className="row">
        <div className="col-8">
          <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Total</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {renderCart()}
          </tbody>
        </table>
        </div>
        <div className="col-4">
          <div className="bill card">
          <div className="card-header">
            <h5 className="mb-0">Bill</h5>
          </div>
          <div className="card-body">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                {renderBillItems()}
                <tr>
                  <th colSpan="2">Total</th>
                  <th>${calculateBillTotal()}</th>
                </tr>
              </tbody>
            </table>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleOrder}
              disabled={isSubmitting || cart.length === 0}
            >
              {isSubmitting ? "Đang đặt hàng..." : "Order"}
            </button>
            {orderMessage && <p role="status" className="mt-2">{orderMessage}</p>}
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
