import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import Card from "../../component/ui/product/Card"
import DetailProduct from "./DetailProduct"
import Cart from "./Cart";
import axios from "axios";
import { URL_API } from "../../util/variable_global";


const ProductList = () => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();

  const addProCart = (proClick) => {
    dispatch(addToCart(proClick));
  }

  const getProList = async () => 
  {
    try {
      //thành công
      // axios rút gọn, fetch()
      const res = await axios.get(`${URL_API}/api/Product`)
      // console.log(res)

      //set lại state 
      setProducts(res.data.content.slice(0, 10))

    } catch (error) {
      //thất bại
      console.log(error)
    }  
  }

   useEffect(() => {
    //gọi lại API khi id thay đổi
    getProList();
  }, [])
  const [wishlist, setWishlist] = useState([]);
  const handleWishlist = (productId, iconStatus) => {
    const productClick = products.find((item) => item.id === productId);
    if (!productClick) {
      throw new Error(`Không tìm thấy sản phẩm có id ${productId}`);
    }

    const nextIslike = !iconStatus;
    // if (nextIslike) {
    //   console.log("Sản phẩm được thích:", productClick);
    // }

    setWishlist((currentWishlist) => {
      if (nextIslike) {
        if (currentWishlist.find((item) => item.id === productId)) {
          return currentWishlist;
        }

        return [...currentWishlist, { ...productClick, islike: true }];
      }

      return currentWishlist.filter((item) => item.id !== productId);
    });
  };
  const handleRemoveWishlist = (productId) => {
    setWishlist((currentWishlist) =>
      currentWishlist.filter((item) => item.id !== productId)
    );
  };
  const renderProductList = () => {
    const arrProduct = products.map((item) => {
      return (
        <div className="col-4" key={item.id}>
          <Card
            product={item}
            addProCart={addProCart}
            wishlist={wishlist}
            handleWishlist={handleWishlist}
          />
        </div>
      )
    })
    return arrProduct
  }

  return (
    <div className="container">
      <h1>Danh sách sản phẩm</h1>
      <div className="overview-product">
        <div className="row">
          <div className="col-6">
            <div className="cart">
              <img src="https://dummyimage.com/600x400/000/fff" className="w-100" />
            </div>
          </div>
          <div className="col-6">
            <div className="content">
              <h2>Product Name</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <button className="btn btn-primary">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
      <h2>Product List</h2>
      <div className="product-list">
        <div className="row">
          {renderProductList()}
        </div>
      </div>
      <h2>Danh sách yêu thích</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Giá tiền</th>
            <th>Trạng thái xóa</th>
          </tr>
        </thead>
        <tbody>
          {wishlist.length > 0 ? (
            wishlist.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>${item.price}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleRemoveWishlist(item.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                Chưa có sản phẩm yêu thích
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* <DetailProduct/> */}
      <Cart />
    </div>
  )
}

export default ProductList