import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { clearCredentials } from '../../../redux/authSlice'
import SearchPopup from '../header/searchbar/SearchPopup'

const IconHeaderRight = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { accessToken, user } = useSelector((state) => state.auth)
    const cart = useSelector((state) => state.cart)
    const cartQuantity = cart.reduce(
        (total, item) => total + (item.quantity || 0),
        0,
    )
    const avatarUrl = [user?.avatar, user?.image, user?.avatarUrl]
        .find((value) => typeof value === 'string' && value.trim())
    const avatarInitial = (user?.name || user?.email || 'U').charAt(0).toUpperCase()

    const handleLogout = () => {
        window.localStorage.removeItem('userLogin')
        dispatch(clearCredentials())
        setIsAccountMenuOpen(false)
        navigate('/sign-in')
    }

    return (
        <>
        <div className='d-flex'>
            <div className='wrapper p-3'>
                <button
                    type="button"
                    className="header-search-trigger"
                    aria-label="Open search"
                    aria-haspopup="dialog"
                    aria-expanded={isSearchOpen}
                    onClick={() => setIsSearchOpen(true)}
                >
                    <svg className='icon' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="11" cy="11" r="6" stroke="#222222" strokeWidth="2" />
                        <path d="M20 20L17 17" stroke="#222222" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            </div>
            <div
                className='wrapper p-3 header-account-menu'
                onMouseEnter={() => accessToken && setIsAccountMenuOpen(true)}
                onMouseLeave={() => setIsAccountMenuOpen(false)}
                onFocus={() => accessToken && setIsAccountMenuOpen(true)}
                onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                        setIsAccountMenuOpen(false)
                    }
                }}
            >
                <NavLink
                    to={accessToken ? '/profile' : '/sign-in'}
                    aria-label={accessToken ? 'Tài khoản' : 'Đăng nhập'}
                    className="header-account-link"
                >
                    {accessToken ? (
                        avatarUrl ? (
                            <img
                                className="header-account-avatar"
                                src={avatarUrl}
                                alt=""
                            />
                        ) : (
                            <span className="header-account-avatar header-account-avatar--fallback">
                                {avatarInitial}
                            </span>
                        )
                    ) : (
                        <svg className='icon' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="8" r="3.5" stroke="#222222" strokeWidth="2" strokeLinecap="round" />
                            <path d="M4.84913 16.9479C5.48883 14.6034 7.91473 13.5 10.345 13.5H13.655C16.0853 13.5 18.5112 14.6034 19.1509 16.9479C19.282 17.4287 19.3868 17.9489 19.4462 18.5015C19.5052 19.0507 19.0523 19.5 18.5 19.5H5.5C4.94772 19.5 4.49482 19.0507 4.55382 18.5015C4.6132 17.9489 4.71796 17.4287 4.84913 16.9479Z" strokeWidth="2" stroke="#222222" strokeLinecap="round" />
                        </svg>
                    )}
                </NavLink>
                {accessToken && isAccountMenuOpen && (
                    <div className='header-account-popup' role='menu'>
                        <span className='header-account-popup-user'>
                            {user?.name || user?.email || 'Personal'}
                        </span>
                        <button
                            type='button'
                            className='header-account-popup-logout'
                            role='menuitem'
                            onClick={handleLogout}
                        >
                            Log out
                        </button>
                    </div>
                )}
            </div>
            <div className='wrapper p-3'>
                <NavLink to="/wishlist" aria-label="Wishlist">
                    <svg className='icon' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8C12 8 12 8 11.24 7C10.36 5.84 9.06 5 7.5 5C5.01 5 3 7.01 3 9.5C3 10.43 3.28 11.29 3.76 12C4.57 13.21 12 21 12 21M12 8C12 8 12 8 12.76 7C13.64 5.84 14.94 5 16.5 5C18.99 5 21 7.01 21 9.5C21 10.43 20.72 11.29 20.24 12C19.43 13.21 12 21 12 21" stroke="#1C1A1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </NavLink>
            </div>
            <div className='wrapper p-3'>
                <NavLink to="/Cart" aria-label={`Cart, ${cartQuantity} items`} className="header-cart-link">
                    <svg className='icon' width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 12L8 8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8L16 12" stroke="#222222" stroke-width="2" strokeLinecap="round" />
                        <path d="M3.69435 12.6678C3.83942 10.9269 3.91196 10.0565 4.48605 9.52824C5.06013 9 5.9336 9 7.68053 9H16.3195C18.0664 9 18.9399 9 19.514 9.52824C20.088 10.0565 20.1606 10.9269 20.3057 12.6678L20.8195 18.8339C20.904 19.8474 20.9462 20.3542 20.6491 20.6771C20.352 21 19.8435 21 18.8264 21H5.1736C4.15655 21 3.64802 21 3.35092 20.6771C3.05382 20.3542 3.09605 19.8474 3.18051 18.8339L3.69435 12.6678Z" stroke-width="2" stroke="#222222" />
                    </svg>
                    {cartQuantity > 0 && (
                        <span className="header-cart-badge">{cartQuantity}</span>
                    )}
                </NavLink>
            </div>
        </div>
        <SearchPopup
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
        />
        </>
    )
}

export default IconHeaderRight
