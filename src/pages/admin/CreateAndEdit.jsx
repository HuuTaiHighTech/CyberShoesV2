import { useFormik } from 'formik'
import { Link, useMatch, useNavigate } from 'react-router-dom'

const sampleProducts = [
  {
    id: 3,
    name: 'Converse Chuck Taylor',
    price: 250,
    description: 'Giày Converse Chuck Taylor cổ điển.',
    shortDescription: 'Thiết kế cổ điển, phù hợp sử dụng hằng ngày.',
    quantity: 200,
    imgLink: 'https://apistore.cybersoft.edu.vn/images/converse-chuck-taylor.png',
  },
]

const emptyProduct = {
  name: '',
  price: '',
  description: '',
  shortDescription: '',
  quantity: '',
  imgLink: '',
}

const CreateAndEdit = () => {
  const match = useMatch('/admin/product/:id')
  const navigate = useNavigate()
  const isEdit = Boolean(match)
  const productId = match?.params.id
  const sampleProduct = sampleProducts.find(
    (product) => String(product.id) === productId,
  )

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: sampleProduct ?? emptyProduct,
    validate: (values) => {
      const errors = {}
      if (!values.name.trim()) errors.name = 'Vui lòng nhập tên sản phẩm.'
      if (!values.price || Number(values.price) <= 0) {
        errors.price = 'Giá phải lớn hơn 0.'
      }
      if (values.quantity === '' || Number(values.quantity) < 0) {
        errors.quantity = 'Vui lòng nhập số lượng hợp lệ.'
      }
      if (!values.imgLink.trim()) errors.imgLink = 'Vui lòng nhập URL hình ảnh.'
      return errors
    },
    onSubmit: (_values, { setStatus }) => {
      setStatus('Form đang dùng dữ liệu mẫu; hiện chưa kết nối API để lưu.')
    },
  })

  if (isEdit && !sampleProduct) {
    return (
      <div className="container py-4">
        <p className="text-danger">Không tìm thấy sản phẩm trong dữ liệu mẫu.</p>
        <Link to="/admin/products" className="btn btn-outline-secondary">
          Quay lại danh sách
        </Link>
      </div>
    )
  }

  const fieldProps = (name) => ({
    ...formik.getFieldProps(name),
    className: `form-control${formik.touched[name] && formik.errors[name] ? ' is-invalid' : ''}`,
  })

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">
            {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
          </h1>
          <p className="text-muted small mb-0">
            Biểu mẫu sử dụng dữ liệu mẫu, chưa kết nối API.
          </p>
        </div>
        <Link to="/admin/products" className="btn btn-outline-secondary">
          Quay lại danh sách
        </Link>
      </div>

      <form className="card border-0 shadow-sm rounded-4" onSubmit={formik.handleSubmit}>
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label fw-semibold">Tên sản phẩm</label>
              <input id="name" {...fieldProps('name')} placeholder="Nhập tên sản phẩm" />
              {formik.touched.name && formik.errors.name && (
                <div className="invalid-feedback">{formik.errors.name}</div>
              )}
            </div>
            <div className="col-md-3">
              <label htmlFor="price" className="form-label fw-semibold">Giá</label>
              <input
                id="price"
                type="number"
                min="0"
                step="any"
                {...fieldProps('price')}
                placeholder="Nhập giá"
              />
              {formik.touched.price && formik.errors.price && (
                <div className="invalid-feedback">{formik.errors.price}</div>
              )}
            </div>
            <div className="col-md-3">
              <label htmlFor="quantity" className="form-label fw-semibold">Số lượng</label>
              <input
                id="quantity"
                type="number"
                min="0"
                step="1"
                {...fieldProps('quantity')}
                placeholder="Nhập số lượng"
              />
              {formik.touched.quantity && formik.errors.quantity && (
                <div className="invalid-feedback">{formik.errors.quantity}</div>
              )}
            </div>
            <div className="col-12">
              <label htmlFor="imgLink" className="form-label fw-semibold">URL hình ảnh</label>
              <input
                id="imgLink"
                type="url"
                {...fieldProps('imgLink')}
                placeholder="https://..."
              />
              {formik.touched.imgLink && formik.errors.imgLink && (
                <div className="invalid-feedback">{formik.errors.imgLink}</div>
              )}
            </div>
            <div className="col-12">
              <label htmlFor="shortDescription" className="form-label fw-semibold">
                Mô tả ngắn
              </label>
              <textarea
                id="shortDescription"
                rows="2"
                className="form-control"
                {...formik.getFieldProps('shortDescription')}
                placeholder="Nhập mô tả ngắn"
              />
            </div>
            <div className="col-12">
              <label htmlFor="description" className="form-label fw-semibold">
                Mô tả chi tiết
              </label>
              <textarea
                id="description"
                rows="4"
                className="form-control"
                {...formik.getFieldProps('description')}
                placeholder="Nhập mô tả chi tiết"
              />
            </div>
          </div>

          {formik.status && (
            <div className="alert alert-info mt-4 mb-0" role="status">
              {formik.status}
            </div>
          )}

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-light border"
              onClick={() => navigate('/admin/products')}
            >
              Hủy
            </button>
            <button type="submit" className="btn btn-danger px-4">
              {isEdit ? 'Cập nhật' : 'Thêm sản phẩm'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreateAndEdit
