const orderData = {
  name: 'tai',
  email: 'taipro573@gmail.com',
  content: {
    ordersHistory: [
      {
        orderDetail: [
          {
            name: 'vans black',
            quantity: 2,
            price: 200,
            image: 'https://apistore.cybersoft.edu.vn/images/vans-black-black.png',
          },
        ],
        id: 22429,
        date: '2026-11-03T08:08:03',
        status: 'CHUAGIAO',
        email: 'Taipro573@gmail.com',
      },
    ],
  },
}

const statusLabels = {
  CHUAGIAO: 'Chưa giao',
  DAGIAO: 'Đã giao',
  DANGXULY: 'Đang xử lý',
}

const formatDate = (date) =>
  new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN').format(price)

const ManagerOrder = () => {
  const orders = orderData.content.ordersHistory

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="h3 fw-bold text-dark mb-1">Quản lý đơn hàng</h1>
        <p className="text-muted small mb-0">Danh sách đơn hàng của khách hàng</p>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th scope="col" className="py-3 px-3">Mã đơn</th>
                <th scope="col" className="py-3 px-3">Khách hàng</th>
                <th scope="col" className="py-3 px-3">Ngày đặt</th>
                <th scope="col" className="py-3 px-3">Sản phẩm</th>
                <th scope="col" className="py-3 px-3">Tổng tiền</th>
                <th scope="col" className="py-3 px-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-muted">
                    Chưa có đơn hàng nào.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const total = order.orderDetail.reduce(
                    (sum, product) => sum + product.price * product.quantity,
                    0,
                  )

                  return (
                    <tr key={order.id}>
                      <td className="px-3 fw-semibold">#{order.id}</td>
                      <td className="px-3">
                        <div className="fw-semibold">{orderData.name}</div>
                        <small className="text-muted">{order.email}</small>
                      </td>
                      <td className="px-3">{formatDate(order.date)}</td>
                      <td className="px-3">
                        {order.orderDetail.map((product) => (
                          <div key={product.name}>
                            {product.name} <span className="text-muted">× {product.quantity}</span>
                          </div>
                        ))}
                      </td>
                      <td className="px-3">{formatPrice(total)}</td>
                      <td className="px-3">
                        <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis">
                          {statusLabels[order.status] ?? order.status}
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
      </div>
    </div>
  )
}

export default ManagerOrder
