import { NavLink } from 'react-router-dom';
import { URL_IMAGE } from '../../../util/variable_global';

const getProductImageUrl = (product) => {
    const image = [product.image, product.imgLink].find(
        (value) =>
            typeof value === 'string' &&
            value.trim() &&
            value.trim().toLowerCase() !== 'string',
    )?.trim();
    const rawImagePath = image || product.alias || product.id;
    if (rawImagePath == null || !String(rawImagePath).trim()) {
        return '';
    }
    const imagePath = String(rawImagePath).trim();

    if (/^(https?:)?\/\//i.test(imagePath) || /^data:/i.test(imagePath)) {
        return imagePath;
    }

    const filename = imagePath
        .replace(/^\/+/, '')
        .replace(/^images\//i, '');
    const filenameWithExtension = /\.[a-z0-9]{2,5}(?:[?#].*)?$/i.test(filename)
        ? filename
        : `${filename}.png`;

    return `${URL_IMAGE}${filenameWithExtension}`;
};

const Card = (props) => {
    const { product, setProduct, addProCart, wishlist, handleWishlist } = props;
    const islike = Boolean(wishlist?.[product.id])
    const imageUrl = getProductImageUrl(product)

    return (
        <NavLink to={`/get-all-product/detail/${product.id}`}>
            <div className="card" style={{ width: '18rem' }} onClick={() => setProduct?.(product)}>
                <div className="text-end">
                    <button
                        onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            if (handleWishlist) {
                                handleWishlist(product.id, islike)
                            }
                        }}
                    >
                        {islike === true ? (
                            <i className="fa-solid fa-heart text-danger"></i>
                        ) : (
                            <i className="fa-regular fa-heart"></i>
                        )}
                    </button>
                </div>
                <img src={imageUrl} className="w-100" alt={product.name || 'Product'} />
                <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.shortDescription}</p>
                    <span href="#">${product.price}</span>
                    <button
                        className='btn btn-outline-primary'
                        onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            if (addProCart) {
                                addProCart(product)
                            }
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
