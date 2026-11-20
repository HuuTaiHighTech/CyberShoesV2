import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { clearCredentials } from '../../redux/authSlice'
import { fetchFavoriteProducts, unlikeProduct } from '../../redux/apiSlice'
import { removeFromWishlist } from '../../redux/wishlistSlice'

const WishList = () => {
  const wishlist = useSelector((state) => state.wishlist)
  const { accessToken } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [removeErrorMessage, setRemoveErrorMessage] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [removingId, setRemovingId] = useState(null)

  useEffect(() => {
    if (!accessToken) {
      return undefined
    }

    let isActive = true
    dispatch(fetchFavoriteProducts(accessToken))
      .unwrap()
      .then(() => {
        if (isActive) {
          setErrorMessage('')
        }
      })
      .catch((error) => {
        if (isActive) {
          if (error?.status === 401) {
            window.localStorage.removeItem('userLogin')
            dispatch(clearCredentials())
            setAuthMessage('Phiên đăng nhập không hợp lệ hoặc đã hết hạn.')
            return
          }

          setErrorMessage(
            typeof error === 'string'
              ? error
              : error?.message || 'Đã xảy ra lỗi khi tải wishlist.',
          )
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [accessToken, dispatch, reloadKey])

  const handleRemove = async (productId) => {
    setRemovingId(productId)
    setRemoveErrorMessage('')

    try {
      await dispatch(unlikeProduct({ productId, accessToken })).unwrap()
      dispatch(removeFromWishlist(productId))
    } catch (error) {
      if (error?.status === 401) {
        window.localStorage.removeItem('userLogin')
        dispatch(clearCredentials())
        setAuthMessage('Phiên đăng nhập không hợp lệ hoặc đã hết hạn.')
        return
      }

      setRemoveErrorMessage(
        `Không thể bỏ thích sản phẩm: ${error?.message || error}`,
      )
    } finally {
      setRemovingId(null)
    }
  }
  const wishlistProducts = Object.values(wishlist)

  return (
    <div className="container">
      <h1>Danh sách yêu thích</h1>
      {!accessToken ? (
        <p>
          {authMessage ? `${authMessage} ` : 'Vui lòng '}
          <Link to="/sign-in">đăng nhập</Link> để xem sản phẩm yêu thích.
        </p>
      ) : isLoading ? (
        <p>Đang tải sản phẩm yêu thích...</p>
      ) : errorMessage ? (
        <div role="alert">
          <p>Không thể tải sản phẩm yêu thích: {errorMessage}</p>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => {
              setIsLoading(true)
              setErrorMessage('')
              setReloadKey((key) => key + 1)
            }}
          >
            Thử lại
          </button>
        </div>
      ) : (
      <>
      {removeErrorMessage && <p role="alert">{removeErrorMessage}</p>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Giá tiền</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {wishlistProducts.length > 0 ? (
            wishlistProducts.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <img
                    src={item.image}
                    alt={item.name}
                    width="64"
                    height="64"
                    style={{ objectFit: 'cover' }}
                  />
                </td>
                <td>{item.name}</td>
                <td>
                  {item.price === undefined || item.price === null
                    ? '—'
                    : `$${item.price}`}
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger"
                    disabled={removingId === item.id}
                    onClick={() => handleRemove(item.id)}
                  >
                    {removingId === item.id ? 'Đang xóa...' : 'Xóa'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Chưa có sản phẩm yêu thích
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </>
      )}
    </div>
  )
}

export default WishList
