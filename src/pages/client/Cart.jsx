import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  changeCartQuantity,
  removeFromCart,
} from "../../redux/cartSlice";
import { URL_API } from "../../util/variable_global";

const userDemo = {
  email: "taipro573@gmail.com",
  accessToken: "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJ0YWlwcm81NzNAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiVklFV19QUk9GSUxFIiwibmJmIjoxNzk0OTc2MDA3LCJleHAiOjE3OTQ5Nzk2MDd9.g7PvBDCdQ69KsruKcjJz3p5UtqEWsebAYwFerWFipAw"
};

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");

  const handleOrder = async () => {
    if (cart.length === 0) {
      setOrderMessage("Giỏ hàng đang trống.");
      return;
    }

    const orderData = {
      email: userDemo.email,
      orderDetail: cart.map((item) => ({
        productId: String(item.id),
        quantity: item.quantity,
      })),
    };

    setIsSubmitting(true);
    setOrderMessage("");

    try {
      const response = await axios.post(
        `${URL_API}/api/Users/order`,
        orderData,
        {
          headers: {
            Authorization: userDemo.accessToken,
          },
        }
      );
      setOrderMessage(response.data?.message || "Đặt hàng thành công.");
    } catch (error) {
      console.error("Gọi API đặt hàng thất bại:", error);
      const responseMessage = error.response?.data?.message;
      setOrderMessage(
        `Đặt hàng thất bại: ${responseMessage || error.message}`
      );
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
