import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TOKEN_CYBERSOFT, URL_API } from '../../util/variable_global'

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [deletingId, setDeletingId] = useState(null)
  const [actionMessage, setActionMessage] = useState(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setErrorMessage('')
    const config = TOKEN_CYBERSOFT
      ? { headers: { TokenCybersoft: TOKEN_CYBERSOFT } }
      : undefined

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${URL_API}/api/Product`, config)
        const apiProducts = Array.isArray(response.data)
          ? response.data
          : response.data?.content

        if (!Array.isArray(apiProducts)) {
          throw new Error('Dữ liệu trả về từ API không đúng định dạng danh sách.')
        }

        if (isMounted) {
          setProducts(apiProducts)
        }
      } catch (error) {
        if (isMounted) {
          const responseData = error.response?.data
          const message = typeof responseData?.message === 'string'
            ? responseData.message
            : typeof responseData === 'string'
              ? responseData
              : error.message
          setErrorMessage(`Không thể tải sản phẩm: ${message}`)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      isMounted = false
    }
  }, [refreshKey])

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}" không?`)) {
      return
    }

    setDeletingId(product.id)
    setActionMessage(null)
    const config = {
      params: { ProductId: product.id },
      ...(TOKEN_CYBERSOFT && {
        headers: { TokenCybersoft: TOKEN_CYBERSOFT },
      }),
    }

    try {
      await axios.delete(`${URL_API}/api/Product`, config)
      setActionMessage({
        type: 'success',
        text: `Đã xóa sản phẩm "${product.name}". Đang tải lại danh sách...`,
      })
      setRefreshKey((key) => key + 1)
    } catch (error) {
      const responseData = error.response?.data
      const message = typeof responseData?.message === 'string'
        ? responseData.message
        : typeof responseData === 'string'
          ? responseData
          : error.message
      setActionMessage({
        type: 'danger',
        text: `Không thể xóa sản phẩm "${product.name}": ${message}`,
      })
    } finally {
      setDeletingId(null)
    }
  }

  const renderArrProduct = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="6" className="py-4 text-center text-muted">
            Đang tải sản phẩm...
          </td>
        </tr>
      )
    }

    if (errorMessage) {
      return (
        <tr>
          <td colSpan="6" className="py-4 text-center text-danger">
            {errorMessage}
          </td>
        </tr>
      )
    }

    if (products.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="py-4 text-center text-muted">
            Chưa có sản phẩm nào.
          </td>
        </tr>
      )
    }

    const Arrproduct = products.map((product, index) => {
      return (
        <tr key={product.id}>
          <td className="text-center text-muted">{index + 1}</td>
          <td className="px-3">
            <div className="d-flex align-items-center gap-3">
              <img
                src={product.imgLink ?? product.image}
                alt={product.name}
                width="56"
                height="56"
                className="rounded object-fit-cover"
              />
              <div>
                <div className="fw-semibold text-dark">{product.name}</div>
                <small className="text-muted">Mã: {product.id}</small>
                {product.featured && (
                  <span className="badge text-bg-warning ms-2">Nổi bật</span>
                )}
              </div>
            </div>
          </td>
          <td className="px-3">{product.price}</td>
          <td className="px-3">{product.quantity}</td>
          <td className="px-3">
            {Array.isArray(product.size)
              ? product.size.join(', ')
              : product.sizes ?? ''}
          </td>
          <td className="px-3 text-center">
            <div className="d-inline-flex align-items-center gap-1">
              <Link
                to={`/admin/product/${product.id}`}
                className="btn btn-sm btn-light text-primary rounded-circle p-2"
                title="Chỉnh sửa sản phẩm"
                aria-label={`Chỉnh sửa ${product.name}`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L8 18l-4 1 1-4Z" />
                </svg>
              </Link>
              <button
                type="button"
                className="btn btn-sm btn-light text-danger rounded-circle p-2"
                title="Xóa sản phẩm"
                aria-label={`Xóa ${product.name}`}
                disabled={deletingId === product.id}
                onClick={() => handleDeleteProduct(product)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      )
    })
    return Arrproduct;
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Quản lý sản phẩm</h1>
          <p className="text-muted small mb-0">
            Danh sách sản phẩm trong cửa hàng
          </p>
        </div>
        <Link
          to="/admin/product"
          className="btn btn-danger rounded-pill px-4 py-2 fw-semibold"
        >
          <span aria-hidden="true" className="me-2">+</span>
          Thêm sản phẩm
        </Link>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        {actionMessage && (
          <div
            className={`alert alert-${actionMessage.type} m-3 mb-0`}
            role="status"
          >
            {actionMessage.text}
          </div>
        )}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th scope="col" className="py-3 px-3 text-center">STT</th>
                <th scope="col" className="py-3 px-3">Sản phẩm</th>
                <th scope="col" className="py-3 px-3">Giá</th>
                <th scope="col" className="py-3 px-3">Số lượng</th>
                <th scope="col" className="py-3 px-3">Kích cỡ</th>
                <th scope="col" className="py-3 px-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {renderArrProduct()}
            </tbody>
          </table>
        </div>
        <div className="card-footer bg-white py-3 px-4 border-top">
          <span className="small text-muted">
            Tổng số: <strong>{products.length}</strong> sản phẩm
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProductList
