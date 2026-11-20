import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import './HomePage.css'

const getTokenExpiration = (token) => {
  try {
    const payload = token.split('.')[1]
    if (!payload) {
      return null
    }

    const base64Payload = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decodedPayload = atob(
      base64Payload.padEnd(Math.ceil(base64Payload.length / 4) * 4, '='),
    )
    const expiration = Number(JSON.parse(decodedPayload).exp)

    return Number.isFinite(expiration) && expiration > 0
      ? expiration * 1000
      : null
  } catch {
    return null
  }
}

const formatRemainingTime = (totalSeconds) => {
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const time = [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':')

  return days > 0 ? `${days} ngày ${time}` : time
}

const HomePage = () => {
  const accessToken = useSelector((state) => state.auth.accessToken)
  const [currentTime, setCurrentTime] = useState(() => Date.now())
  const expiresAt = useMemo(
    () => (accessToken ? getTokenExpiration(accessToken) : null),
    [accessToken],
  )

  useEffect(() => {
    if (!expiresAt) {
      return undefined
    }

    const timerId = window.setInterval(() => setCurrentTime(Date.now()), 1000)
    return () => window.clearInterval(timerId)
  }, [expiresAt])

  const remainingSeconds = expiresAt
    ? Math.max(0, Math.ceil((expiresAt - currentTime) / 1000))
    : null

  return (
    <div className='container'>
      <h1>Đây là trang chủ</h1>
      {remainingSeconds !== null && (
        <aside className='token-expiry-popup' aria-label='Thời gian hết hạn token'>
          <span className='token-expiry-popup__label'>Token hết hạn sau</span>
          <strong className='token-expiry-popup__time'>
            {remainingSeconds === 0
              ? 'Đã hết hạn'
              : formatRemainingTime(remainingSeconds)}
          </strong>
        </aside>
      )}
    </div>
  )
}

export default HomePage
