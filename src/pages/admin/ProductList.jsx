import { useState } from 'react'
import { Link } from 'react-router-dom'

const ProductList = () => {
  const [products] = useState([
    {
      id: 3,
      name: 'Converse Chuck Taylor',
      price: 250,
      quantity: 200,
      sizes: [32, 33, 34, 35],
      image: 'https://apistore.cybersoft.edu.vn/images/converse-chuck-taylor.png',
      featured: true,
    },
  ])
 
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
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-muted">
                    Chưa có sản phẩm nào.
                  </td>
                </tr>
              ) : (
                products.map((product, index) => (
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
                    <td className="px-3">{product.sizes.join(', ')}</td>
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
                          title="Chức năng xóa chưa khả dụng"
                          aria-label={`Xóa ${product.name} (chưa khả dụng)`}
                          disabled
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
                ))
              )}
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
