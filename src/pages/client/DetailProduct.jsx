import { useEffect, useState } from 'react'
import Card from '../../component/ui/product/Card';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, changeCartQuantity } from '../../redux/cartSlice';
import { clearCredentials } from '../../redux/authSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/wishlistSlice';
import {
  fetchFavoriteProducts,
  fetchProductById,
  likeProduct,
  unlikeProduct,
} from '../../redux/apiSlice';

const DetailProduct = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const wishlist = useSelector((state) => state.wishlist)
  const { accessToken } = useSelector((state) => state.auth)
  const productDetailFromStore = useSelector((state) => state.api.productDetail)
  const productDetailStatus = useSelector(
    (state) => state.api.productDetailStatus,
  )
  const productDetailError = useSelector(
    (state) => state.api.productDetailError,
  )
  const favoritesStatus = useSelector((state) => state.api.favoritesStatus)
  const cart = useSelector((state) => state.cart)
  const cartItem = cart.find((item) => String(item.id) === String(params.id))
  const [newProductQuantity, setNewProductQuantity] = useState(1)
  const [wishlistError, setWishlistError] = useState('')
  const [loginRequired, setLoginRequired] = useState(false)
  const [relatedWishlistOverrides, setRelatedWishlistOverrides] = useState({})
  const relatedWishlist = { ...wishlist, ...relatedWishlistOverrides }
  const quantity = cartItem ? cartItem.quantity : newProductQuantity
  const [fallbackProductDetail] = useState({
    "id": 3,
    "name": "converse chuck taylor",
    "alias": "converse-chuck-taylor",
    "price": 250,
    "feature": false,
    "description": "about this shoe:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ",
    "size": [
      "32",
      "33",
      "34",
      "35"
    ],
    "shortDescription": "about this shoe:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "quantity": 200,
    "detaildetailedImages": [
      "rotate(0deg)",
      "rotateY(180deg)",
      "rotate(45deg)",
      "rotate(-45deg)"
    ],
    "image": "http://apistore.cybersoft.edu.vn/images/converse-chuck-taylor.png",
    "imgLink": "converse-chuck-taylor.png",
    "categories": [
      {
        "id": "VANS_CONVERSE",
        "category": "VANS_CONVERSE"
      }
    ],
    "relatedProducts": [
      {
        "id": 2,
        "name": "vans old school",
        "alias": "vans-old-school",
        "feature": false,
        "price": 200,
        "description": "about this shoe:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ",
        "shortDescription": "about this shoe:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "image": "http://apistore.cybersoft.edu.vn/images/van-old-school.png",
        "imgLink": null
      },
      {
        "id": 3,
        "name": "converse chuck taylor",
        "alias": "converse-chuck-taylor",
        "feature": false,
        "price": 250,
        "description": "about this shoe:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ",
        "shortDescription": "about this shoe:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "image": "http://apistore.cybersoft.edu.vn/images/converse-chuck-taylor.png",
        "imgLink": null
      },
      {
        "id": 1,
        "name": "vans black",
        "alias": "vans-black-black",
        "feature": false,
        "price": 200,
        "description": "about this shoe:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ",
        "shortDescription": "about this shoe:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "image": "http://apistore.cybersoft.edu.vn/images/vans-black-black.png",
        "imgLink": null
      }
    ]
  })
  const productDetail =
    productDetailFromStore?.id === Number(params.id)
      ? productDetailFromStore
      : fallbackProductDetail

  useEffect(() => {
    dispatch(fetchProductById(params.id))
  }, [dispatch, params.id])

  useEffect(() => {
    if (accessToken && favoritesStatus === 'idle') {
      dispatch(fetchFavoriteProducts(accessToken))
    }
  }, [accessToken, dispatch, favoritesStatus])

  const handleIncrease = () => {
    if (cartItem) {
      dispatch(changeCartQuantity({ id: cartItem.id, amount: 1 }))
    } else {
      setNewProductQuantity((currentQuantity) => currentQuantity + 1)
    }
  }

  const handleDecrease = () => {
    if (quantity <= 1) {
      return
    }

    if (cartItem) {
      dispatch(changeCartQuantity({ id: cartItem.id, amount: -1 }))
    } else {
      setNewProductQuantity((currentQuantity) => currentQuantity - 1)
    }
  }

  const handleAddToCart = () => {
    if (cartItem) {
      dispatch(changeCartQuantity({
        id: cartItem.id,
        amount: quantity - cartItem.quantity,
      }))
      return
    }

    dispatch(addToCart({ ...productDetail, quantity }))
  }

  const addRelatedProductToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }))
  }

  const handleRelatedProductWishlist = async (productId, isLiked) => {
    const product = productDetail.relatedProducts.find(
      (item) => item.id === productId,
    )
    if (!product) {
      throw new Error(`Không tìm thấy sản phẩm có id ${productId}`)
    }

    if (!accessToken) {
      navigate('/sign-in')
      return
    }

    setWishlistError('')
    setLoginRequired(false)
    try {
      if (isLiked) {
        await dispatch(unlikeProduct({ productId, accessToken })).unwrap()
        dispatch(removeFromWishlist(productId))
        setRelatedWishlistOverrides((currentWishlist) => ({
          ...currentWishlist,
          [productId]: null,
        }))
      } else {
        await dispatch(likeProduct({ productId, accessToken })).unwrap()
        dispatch(addToWishlist(product))
        setRelatedWishlistOverrides((currentWishlist) => ({
          ...currentWishlist,
          [productId]: product,
        }))
      }
      dispatch(fetchFavoriteProducts(accessToken))
    } catch (error) {
      if (error?.status === 401) {
        window.localStorage.removeItem('userLogin')
        dispatch(clearCredentials())
        setWishlistError('Access token không hợp lệ hoặc đã hết hạn.')
        setLoginRequired(true)
        return
      }

      setWishlistError(
        `Không thể cập nhật yêu thích: ${error?.message || error}`,
      )
    }
  }

  const renderRelatedProduct = () => {
    const arrRelatedPro = productDetail.relatedProducts.map((item) => {
      return (
        <div className="col-4" key={item.id}>
          <Card
            product={item}
            addProCart={addRelatedProductToCart}
            wishlist={relatedWishlist}
            handleWishlist={handleRelatedProductWishlist}
          />
        </div>
      )
    })

    return arrRelatedPro;
  }

  return (
    <div className='container'>
      <h2>Trang chi tiết sản phẩm</h2>
      {productDetailStatus === 'loading' && <p>Đang tải sản phẩm...</p>}
      {productDetailStatus === 'failed' && (
        <p role="alert">Không thể tải sản phẩm: {productDetailError}</p>
      )}
      <div className="detail-product">
        <div className="row">
          <div className="col-6">
            <img src={productDetail.image} className="w-100" alt={productDetail.name} />
          </div>
          <div className="col-6">
            <h2>{productDetail.name}</h2>
            <p>{productDetail.description}</p>
            <h4>Select size</h4>
            <div className="row">
              {productDetail.size.map((size) => (
                <div className="col-3" key={size}>
                  <span className="card p-3 text-center">{size}</span>
                </div>
              ))}
            </div>
            <span className="h4">${productDetail.price}</span>
            <div>
              <button
                type="button"
                className="btn btn-primary p-3"
                onClick={handleIncrease}
              >
                +
              </button>
              <span className="p-3">{quantity}</span>
              <button
                type="button"
                className="btn btn-secondary p-3"
                onClick={handleDecrease}
                disabled={quantity <= 1}
              >
                -
              </button>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <h2>Related Products</h2>
      {wishlistError && (
        <p role="alert">
          {wishlistError}{' '}
          {loginRequired && <Link to="/sign-in">Đăng nhập lại</Link>}
        </p>
      )}
      <div className="related-products">
        <div className="row">
          {renderRelatedProduct()}
        </div>
      </div>
    </div>
  )
}

export default DetailProduct
