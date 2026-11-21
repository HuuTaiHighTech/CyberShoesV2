import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { fetchProducts } from '../../../../redux/apiSlice'

const SearchPopup = ({ isOpen, onClose }) => {
    const inputRef = useRef(null)
    const [query, setQuery] = useState('')
    const dispatch = useDispatch()
    const products = useSelector((state) => state.api.products)
    const productsStatus = useSelector((state) => state.api.productsStatus)
    const productsError = useSelector((state) => state.api.productsError)

    const normalizedQuery = query.trim().toLowerCase()
    const recommendations = normalizedQuery
        ? products
            .filter((product) =>
                [product.name, product.alias, product.description]
                    .some((value) =>
                        typeof value === 'string' &&
                        value.toLowerCase().includes(normalizedQuery),
                    ),
            )
            .slice(0, 6)
        : products.slice(0, 6)

    useEffect(() => {
        if (!isOpen) {
            return undefined
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        inputRef.current?.focus()

        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose])

    useEffect(() => {
        if (isOpen && productsStatus === 'idle') {
            dispatch(fetchProducts())
        }
    }, [dispatch, isOpen, productsStatus])

    if (!isOpen) {
        return null
    }

    return (
        <div
            className="search-popup-backdrop"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose()
                }
            }}
        >
            <section
                className="search-popup-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="search-popup-title"
            >
                <div className="search-popup-heading">
                    <div>
                        <p className="search-popup-eyebrow">CYBERSHOES</p>
                        <h2 id="search-popup-title">Find your next pair</h2>
                    </div>
                    <button
                        type="button"
                        className="search-popup-close"
                        onClick={onClose}
                        aria-label="Close search"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="m6 6 12 12M18 6 6 18" />
                        </svg>
                    </button>
                </div>
                <form
                    className="search-popup-form"
                    role="search"
                    onSubmit={(event) => event.preventDefault()}
                >
                    <svg
                        className="search-popup-input-icon"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle cx="11" cy="11" r="6.5" />
                        <path d="m16 16 4 4" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search products, brands, or styles..."
                        aria-label="Search products, brands, or styles"
                    />
                    <button type="submit">Search</button>
                </form>
                <p className="search-popup-hint">
                    {normalizedQuery ? 'Matching products' : 'Recommended for you'}
                </p>
                <div className="search-popup-results">
                    {productsStatus === 'loading' && (
                        <p className="search-popup-state">Loading recommendations...</p>
                    )}
                    {productsStatus === 'failed' && (
                        <div className="search-popup-state" role="alert">
                            <span>Could not load products: {productsError}</span>
                            <button
                                type="button"
                                onClick={() => dispatch(fetchProducts())}
                            >
                                Try again
                            </button>
                        </div>
                    )}
                    {productsStatus === 'succeeded' && recommendations.length === 0 && (
                        <p className="search-popup-state">No matching products found.</p>
                    )}
                    {productsStatus === 'succeeded' && recommendations.map((product) => (
                        <NavLink
                            className="search-popup-result"
                            key={product.id}
                            to={`/get-all-product/detail/${product.id}`}
                            onClick={onClose}
                        >
                            <img
                                src={product.imgLink || product.image}
                                alt=""
                                loading="lazy"
                            />
                            <span className="search-popup-result-name">{product.name}</span>
                            <span className="search-popup-result-price">${product.price}</span>
                        </NavLink>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default SearchPopup
