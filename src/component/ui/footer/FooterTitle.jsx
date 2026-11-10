import React from 'react'

const FooterTitle = (props) => {
    const { item } = props;
    return (
        <div className='text-white text-decoration-none'>
            <h4>
                {item.title}
            </h4>
        </div>
    )
}

export default FooterTitle
