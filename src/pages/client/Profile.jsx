import { useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCredentials, setCredentials } from '../../redux/authSlice'
import {
  fetchOrderHistory,
  fetchProfile,
  updateProfile,
} from '../../redux/apiSlice'
import './Profile.css'

const orderStatusLabels = {
  CHUAGIAO: 'Chưa giao',
  DAGIAO: 'Đã giao',
  DANGXULY: 'Đang xử lý',
}

const formatOrderDate = (value) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date)
}

const formatPrice = (value) =>
  new Intl.NumberFormat('vi-VN').format(value)

const profileSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
  name: Yup.string()
    .trim()
    .required('Vui lòng nhập họ và tên'),
  phone: Yup.string()
    .trim()
    .max(20, 'Số điện thoại không được vượt quá 20 ký tự'),
  password: Yup.string()
    .transform((value) => (value === '' ? undefined : value))
    .min(6, 'Mật khẩu cần có ít nhất 6 ký tự'),
  gender: Yup.boolean().required('Vui lòng chọn giới tính'),
})

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { accessToken, user } = useSelector((state) => state.auth)
  const profile = useSelector((state) => state.api.profile)
  const profileStatus = useSelector((state) => state.api.profileStatus)
  const profileError = useSelector((state) => state.api.profileError)
  const profileUpdateStatus = useSelector(
    (state) => state.api.profileUpdateStatus,
  )
  const orders = useSelector((state) => state.api.orderHistory)
  const orderHistoryStatus = useSelector(
    (state) => state.api.orderHistoryStatus,
  )
  const orderHistoryError = useSelector(
    (state) => state.api.orderHistoryError,
  )
  useEffect(() => {
    if (!accessToken) {
      navigate('/sign-in', { replace: true })
      return
    }

    const redirectIfUnauthorized = (result, thunk) => {
      if (thunk.rejected.match(result) && result.payload?.status === 401) {
        window.localStorage.removeItem('userLogin')
        dispatch(clearCredentials())
        navigate('/sign-in', { replace: true })
      }
    }

    dispatch(fetchProfile(user?.email)).then((result) =>
      redirectIfUnauthorized(result, fetchProfile),
    )
    dispatch(fetchOrderHistory(accessToken)).then((result) =>
      redirectIfUnauthorized(result, fetchOrderHistory),
    )
  }, [accessToken, dispatch, navigate, user?.email])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: profile?.id ?? user?.id ?? '',
      email: profile?.email ?? user?.email ?? '',
      name: profile?.name ?? user?.name ?? '',
      phone: profile?.phone ?? user?.phone ?? '',
      password: '',
      gender:
        (profile?.gender ?? user?.gender) === true ||
        (profile?.gender ?? user?.gender) === 'true',
    },
    validationSchema: profileSchema,
    onSubmit: async (values, { setStatus, setFieldValue }) => {
      setStatus(undefined)
      const profileId = profile?.id ?? user?.id
      const id = Number(profileId)
      if (
        profileId == null ||
        profileId === '' ||
        !Number.isInteger(id)
      ) {
        setStatus({
          type: 'error',
          message: 'Không tìm thấy mã hồ sơ. Vui lòng tải lại trang.',
        })
        return
      }

      const { password, ...profileValues } = values
      const profileData = {
        ...profileValues,
        ...(password ? { password } : {}),
        id,
        email: values.email.trim(),
        name: values.name.trim(),
        phone: values.phone.trim(),
        gender: Boolean(values.gender),
      }

      try {
        const updatedProfile = await dispatch(
          updateProfile({ profile: profileData, accessToken }),
        ).unwrap()
        const updatedUser = {
          ...user,
          ...updatedProfile,
          accessToken,
        }
        window.localStorage.setItem('userLogin', JSON.stringify(updatedUser))
        dispatch(setCredentials(updatedUser))
        setFieldValue('password', '')
        setStatus({
          type: 'success',
          message: 'Cập nhật thông tin thành công.',
        })
      } catch (error) {
        if (error?.status === 401) {
          window.localStorage.removeItem('userLogin')
          dispatch(clearCredentials())
          navigate('/sign-in', { replace: true })
          return
        }

        setStatus({
          type: 'error',
          message: error?.message || String(error),
        })
      }
    },
  })

  const hasFieldError = (field) =>
    Boolean(formik.touched[field] && formik.errors[field])

  const renderError = (field) =>
    hasFieldError(field) ? (
      <div
        id={`${field}-error`}
        className="invalid-feedback d-block"
        role="alert"
      >
        {formik.errors[field]}
      </div>
    ) : null

  return (
    <div className="container">
      <h1 className="text-center"> ProFile</h1>
      <div>
        {profileStatus === 'loading' && (
          <div role="status">Đang tải hồ sơ...</div>
        )}
        {profileStatus === 'failed' && (
          <p className="text-danger mb-0" role="alert">
            Không thể tải hồ sơ: {profileError}
          </p>
        )}
        <form className="row g-3" onSubmit={formik.handleSubmit} noValidate>
          <div className="col-md-6">
            <label htmlFor="profileId" className="form-label">Mã hồ sơ</label>
            <input
              {...formik.getFieldProps('id')}
              id="profileId"
              type="text"
              className="form-control"
              disabled
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              {...formik.getFieldProps('email')}
              id="email"
              type="email"
              className={`form-control${hasFieldError('email') ? ' is-invalid' : ''}`}
              aria-invalid={hasFieldError('email')}
              aria-describedby={hasFieldError('email') ? 'email-error' : undefined}
            />
            {renderError('email')}
          </div>

          <div className="col-md-6">
            <label htmlFor="name" className="form-label">Họ và tên</label>
            <input
              {...formik.getFieldProps('name')}
              id="name"
              type="text"
              className={`form-control${hasFieldError('name') ? ' is-invalid' : ''}`}
              aria-invalid={hasFieldError('name')}
              aria-describedby={hasFieldError('name') ? 'name-error' : undefined}
            />
            {renderError('name')}
          </div>

          <div className="col-md-6">
            <label htmlFor="phone" className="form-label">Số điện thoại</label>
            <input
              {...formik.getFieldProps('phone')}
              id="phone"
              type="tel"
              className={`form-control${hasFieldError('phone') ? ' is-invalid' : ''}`}
              aria-invalid={hasFieldError('phone')}
              aria-describedby={hasFieldError('phone') ? 'phone-error' : undefined}
            />
            {renderError('phone')}
          </div>

          <div className="col-md-6">
            <label htmlFor="password" className="form-label">Mật khẩu mới</label>
            <input
              {...formik.getFieldProps('password')}
              id="password"
              type="password"
              autoComplete="new-password"
              className={`form-control${hasFieldError('password') ? ' is-invalid' : ''}`}
              aria-invalid={hasFieldError('password')}
              aria-describedby={hasFieldError('password') ? 'password-error' : undefined}
            />
            {renderError('password')}
          </div>

          <fieldset className="col-md-6">
            <legend className="form-label fs-6">Giới tính</legend>
            {[{ label: 'Nam', value: true }, { label: 'Nữ', value: false }].map(
              (option) => (
                <label className="form-check form-check-inline" key={option.label}>
                  <input
                    className={`form-check-input${hasFieldError('gender') ? ' is-invalid' : ''}`}
                    type="radio"
                    name="gender"
                    checked={formik.values.gender === option.value}
                    onBlur={() => formik.setFieldTouched('gender', true)}
                    onChange={() =>
                      formik.setFieldValue('gender', option.value)
                    }
                  />
                  <span className="form-check-label">{option.label}</span>
                </label>
              ),
            )}
            {renderError('gender')}
          </fieldset>

          <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                formik.isSubmitting ||
                profileStatus === 'loading' ||
                profileUpdateStatus === 'loading'
              }
            >
              {profileStatus === 'loading'
                ? 'Đang tải hồ sơ...'
                : formik.isSubmitting || profileUpdateStatus === 'loading'
                ? 'Đang cập nhật...'
                : 'Cập nhật hồ sơ'}
            </button>
            {formik.status?.message && (
              <p
                className={
                  formik.status.type === 'success'
                    ? 'text-success mb-0'
                    : 'text-danger mb-0'
                }
                role={formik.status.type === 'error' ? 'alert' : 'status'}
              >
                {formik.status.message}
              </p>
            )}
          </div>
        </form>
      </div>
      <section className="card border-0 shadow-sm rounded-4 overflow-hidden mt-4">
        <div className="px-3 py-3">
          <h2 className="h5 fw-bold text-dark mb-0">Lịch sử đơn hàng</h2>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th scope="col" className="py-3 px-3">Mã đơn</th>
                <th scope="col" className="py-3 px-3">Ngày đặt</th>
                <th scope="col" className="py-3 px-3">Sản phẩm</th>
                <th scope="col" className="py-3 px-3">Tổng tiền</th>
                <th scope="col" className="py-3 px-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orderHistoryStatus === 'loading' ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-muted">
                    Đang tải lịch sử đơn hàng...
                  </td>
                </tr>
              ) : orderHistoryStatus === 'failed' ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-danger">
                    Không thể tải lịch sử đơn hàng: {orderHistoryError}
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-muted">
                    Chưa có đơn hàng nào.
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => {
                  const orderDetails = Array.isArray(order.orderDetail)
                    ? order.orderDetail
                    : []
                  const total = orderDetails.reduce((sum, product) => {
                    const lineTotal =
                      Number(product.price) * Number(product.quantity)
                    return sum + (Number.isFinite(lineTotal) ? lineTotal : 0)
                  }, 0)

                  return (
                    <tr key={order.id ?? `order-${index}`}>
                      <td className="px-3 fw-semibold">#{order.id}</td>
                      <td className="px-3">{formatOrderDate(order.date)}</td>
                      <td className="px-3">
                        {orderDetails.map((product, productIndex) => (
                          <div key={`${order.id}-${productIndex}`}>
                            {product.name || 'Sản phẩm'}{' '}
                            <span className="text-muted">
                              × {product.quantity}
                            </span>
                          </div>
                        ))}
                      </td>
                      <td className="px-3">{formatPrice(total)}</td>
                      <td className="px-3">
                        <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis">
                          {orderStatusLabels[order.status] ?? order.status ?? '—'}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="card-footer bg-white py-3 px-4 border-top">
          <span className="small text-muted">
            Tổng số: <strong>{orders.length}</strong> đơn hàng
          </span>
        </div>
      </section>
    </div>
  )
}

export default Profile
