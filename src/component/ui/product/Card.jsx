import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';

const Card = (props) => {
    const { product, setProduct, addProCart, wishlist, handleWishlist } = props;
    const [islike, setIslike] = useState(false)

    useEffect(() => {
        setIslike(wishlist?.some((item) => item.id === product.id))
    }, [wishlist, product.id])

    return (
        <NavLink to={`/get-all-product/detail/${product.id}`}>
            <div className="card" style={{ width: '18rem' }} onClick={() => setProduct(product)}>
                <div className="text-end">
                    <button
                        onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            setIslike(!islike)
                            handleWishlist(product.id, islike)
                        }}
                    >
                        {islike === true ? (
                            <i className="fa-solid fa-heart text-danger"></i>
                        ) : (
                            <i className="fa-regular fa-heart"></i>
                        )}
                    </button>
                </div>
                <img src={product.image} className="w-100" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.shortDescription}</p>
                    <span href="#">${product.price}</span>
                    <button
                        className='btn btn-outline-primary'
                        onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            addProCart(product)
                        }}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </NavLink>
    )
}

export default Card
