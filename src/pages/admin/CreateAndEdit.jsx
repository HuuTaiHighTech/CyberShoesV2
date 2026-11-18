import axios from 'axios'
import { useState } from 'react'
import { useFormik } from 'formik'
import { Link, useMatch, useNavigate } from 'react-router-dom'
import { TOKEN_CYBERSOFT, URL_API } from '../../util/variable_global'

const sampleProduct = {
  id: 3,
  name: 'Converse Chuck Taylor',
  alias: 'converse-chuck-taylor',
  price: 250,
  description: 'Giày Converse Chuck Taylor cổ điển.',
  size: [32, 33, 34, 35],
  sizes: '32, 33, 34, 35',
  shortDescription: 'Thiết kế cổ điển, phù hợp sử dụng hằng ngày.',
  quantity: 200,
  categories: [{ id: 'category-converse', category: 'Giày Converse' }],
  relatedProducts: [],
  image: 'https://apistore.cybersoft.edu.vn/images/converse-chuck-taylor.png',
  imgLink: 'https://apistore.cybersoft.edu.vn/images/converse-chuck-taylor.png',
}

const emptyProduct = {
  id: '',
  name: '',
  alias: '',
  price: '',
  description: '',
  size: [],
  sizes: '',
  shortDescription: '',
  quantity: '',
  categories: [],
  relatedProducts: [],
  image: '',
  imgLink: '',
}

const CreateAndEdit = () => {
  const match = useMatch('/admin/product/:id')
  const navigate = useNavigate()
  const isEdit = Boolean(match)
  const productId = match?.params.id
  const [addedProducts, setAddedProducts] = useState([])
  const [categoriesInput, setCategoriesInput] = useState(() =>
    (isEdit ? sampleProduct.categories : [])
      .map(({ id, category }) => `${id}|${category}`)
      .join('\n'),
  )
  const [relatedProductsInput, setRelatedProductsInput] = useState(() =>
    (isEdit ? sampleProduct.relatedProducts : []).join(', '),
  )

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: isEdit ? sampleProduct : emptyProduct,
    onSubmit: async (values, { setStatus }) => {
      const product = {
        ...values,
        id: Number(values.id),
        price: Number(values.price),
        quantity: Number(values.quantity),
      }
      const config = TOKEN_CYBERSOFT
        ? { headers: { TokenCybersoft: TOKEN_CYBERSOFT } }
        : undefined

      try {
        const response = await axios.post(`${URL_API}/api/Product`, product, config)
        const responseProduct = response.data?.content
        const addedProduct = responseProduct && typeof responseProduct === 'object'
          ? responseProduct
          : product

        setAddedProducts((currentProducts) =>
          isEdit ? [addedProduct] : [...currentProducts, addedProduct],
        )
        setStatus({
          type: 'success',
          message: `${isEdit ? 'Cập nhật' : 'Thêm'} sản phẩm thành công (HTTP ${response.status}).`,
        })
      } catch (error) {
        const responseData = error.response?.data
        const message = typeof responseData?.message === 'string'
          ? responseData.message
          : typeof responseData === 'string'
            ? responseData
            : error.message
        setStatus({
          type: 'danger',
          message: `Gửi sản phẩm thất bại: ${message}`,
        })
      }
    },
  })

  if (isEdit && String(sampleProduct.id) !== productId) {
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
    className: 'form-control',
  })

  const handleNameChange = (event) => {
    const name = event.target.value
    const alias = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/gi, 'd')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    formik.setFieldValue('name', name)
    formik.setFieldValue('alias', alias)
  }

  const handleSizesChange = (event) => {
    const sizes = event.target.value
    formik.setFieldValue('sizes', sizes)
    formik.setFieldValue(
      'size',
      sizes
        .split(',')
        .map((size) => size.trim())
        .filter(Boolean)
        .map(Number)
        .filter(Number.isFinite),
    )
  }

  const handleCategoriesChange = (event) => {
    const input = event.target.value
    setCategoriesInput(input)
    const categories = input
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [id, ...categoryParts] = line.split('|')
        return { id: id.trim(), category: categoryParts.join('|').trim() }
      })
      .filter(({ id, category }) => id && category)

    formik.setFieldValue('categories', categories)
  }

  const handleRelatedProductsChange = (event) => {
    const input = event.target.value
    setRelatedProductsInput(input)
    formik.setFieldValue(
      'relatedProducts',
      input
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean)
        .map(Number)
        .filter(Number.isFinite),
    )
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">
            {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
          </h1>
          <p className="text-muted small mb-0">
            Thêm sản phẩm sẽ gửi dữ liệu đến API /api/Product.
          </p>
        </div>
        <Link to="/admin/products" className="btn btn-outline-secondary">
          Quay lại danh sách
        </Link>
      </div>

      <form
        className="card border-0 shadow-sm rounded-4"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-2">
              <label htmlFor="id" className="form-label fw-semibold">ID</label>
              <input
                id="id"
                type="number"
                {...fieldProps('id')}
                placeholder="Nhập ID sản phẩm"
              />
              <small className="text-muted">ID sẽ được gửi dưới dạng số.</small>
            </div>
            <div className="col-md-6">
              <label htmlFor="name" className="form-label fw-semibold">Tên sản phẩm</label>
              <input
                id="name"
                {...fieldProps('name')}
                onChange={handleNameChange}
                placeholder="Nhập tên sản phẩm"
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="price" className="form-label fw-semibold">Giá</label>
              <input
                id="price"
                type="number"
                {...fieldProps('price')}
                placeholder="Nhập giá"
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="alias" className="form-label fw-semibold">Alias</label>
              <input
                id="alias"
                className="form-control"
                value={formik.values.alias}
                readOnly
                placeholder="Tự động tạo từ tên sản phẩm"
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="quantity" className="form-label fw-semibold">Số lượng</label>
              <input
                id="quantity"
                type="number"
                {...fieldProps('quantity')}
                placeholder="Nhập số lượng"
              />
            </div>
            <div className="col-md-9">
              <label htmlFor="sizes" className="form-label fw-semibold">Kích cỡ</label>
              <input
                id="sizes"
                type="text"
                className="form-control"
                value={formik.values.sizes}
                onChange={handleSizesChange}
                placeholder="32, 33, 34, 35"
              />
              <small className="text-muted">
                Nhập cách nhau bằng dấu phẩy; dữ liệu sẽ lưu thành mảng số.
              </small>
            </div>
            <div className="col-md-6">
              <label htmlFor="image" className="form-label fw-semibold">
                Ảnh (image)
              </label>
              <input
                id="image"
                type="url"
                {...fieldProps('image')}
                placeholder="https://..."
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="imgLink" className="form-label fw-semibold">
                URL hình ảnh (imgLink)
              </label>
              <input
                id="imgLink"
                type="url"
                {...fieldProps('imgLink')}
                placeholder="https://..."
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="categories" className="form-label fw-semibold">Danh mục</label>
              <textarea
                id="categories"
                rows="3"
                className="form-control"
                value={categoriesInput}
                onChange={handleCategoriesChange}
                placeholder={'category-sport|Giày thể thao\ncategory-converse|Giày Converse'}
              />
              <small className="text-muted">
                Mỗi dòng nhập theo dạng ID|Tên danh mục.
              </small>
            </div>
            <div className="col-md-6">
              <label htmlFor="relatedProducts" className="form-label fw-semibold">
                Sản phẩm liên quan
              </label>
              <input
                id="relatedProducts"
                type="text"
                className="form-control"
                value={relatedProductsInput}
                onChange={handleRelatedProductsChange}
                placeholder="1, 2, 3"
              />
              <small className="text-muted">
                Nhập ID sản phẩm, cách nhau bằng dấu phẩy.
              </small>
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
            <div className={`alert alert-${formik.status.type} mt-4 mb-0`} role="status">
              {formik.status.message}
            </div>
          )}

          {addedProducts.length > 0 && (
            <div className="mt-4">
              <h2 className="h5 fw-semibold">
                {isEdit ? 'Sản phẩm đã cập nhật' : 'Sản phẩm đã thêm'}
              </h2>
              <ul className="list-group">
                {addedProducts.map((product, index) => (
                  <li
                    className="list-group-item d-flex justify-content-between gap-3"
                    key={`${product.id ?? product.alias}-${index}`}
                  >
                    <span>{product.name}</span>
                    <span className="text-muted">
                      ID: {product.id} · Giá: {product.price} · Số lượng: {product.quantity}
                    </span>
                  </li>
                ))}
              </ul>
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
            <button
              type="submit"
              className="btn btn-danger px-4"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Đang gửi...' : isEdit ? 'Cập nhật' : 'Thêm sản phẩm'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreateAndEdit
