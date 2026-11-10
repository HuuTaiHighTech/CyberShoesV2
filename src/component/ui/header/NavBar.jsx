import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ArrowBelow from '../icons/ArrowBelow';

const NavBar1 = (props) => {
    const {item, isOpen, onMouseEnter, onMouseLeave} = props;
    const [hoveredCategoryId, setHoveredCategoryId] = useState(null);

    return (
        <ul className='list-unstyled mb-0'>
            <li
                className='d-inline position-relative'
                onMouseEnter={onMouseEnter}
                onMouseLeave={() => {
                    onMouseLeave?.();
                    setHoveredCategoryId(null);
                }}
            >
                <Link to={item.link} className='text-decoration-none text-black'>
                    {item.name}
                </Link>
                {item.dropdown && <ArrowBelow />}
                {item.dropdown && isOpen && (
                    <ul
                        className='list-unstyled d-flex flex-column gap-3 position-absolute top-100 start-0'
                        style={{backgroundColor: '#f55f8d', borderRadius: '5px', padding: '10px', width: 'max-content'}}
                    >
                        {item.dropdownItems.map((category) => (
                            <li
                                key={category.id}
                                className='ms-3 position-relative'
                                onMouseEnter={() => setHoveredCategoryId(category.id)}
                            >
                                <Link to={`/products/${category.name.toLowerCase()}`} className='fw-bold text-decoration-none text-black'>
                                    {category.name}
                                    <i className="fa-solid fa-angle-down ms-2" aria-hidden="true"></i>
                                </Link>
                                {hoveredCategoryId === category.id && (
                                    <ul className='category list-unstyled' style={{borderRadius: '5px', padding: '10px', width: 'max-content'}}>
                                        {category.shoes.map((shoe) => (
                                            <li key={shoe.id} className='mb-2'>
                                                <Link to={`/product/${shoe.id}`} className='product text-black text-decoration-none'>{shoe.name}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </li>
        </ul>
    )
}

export default NavBar1
