import React from 'react'

const FooterColumn = ({ item }) => {
  return (
    <p>
    {/* <span>
        <i className='fa fa-angle-right text-white me-2'></i>
      </span> */}
      <a href={item.url} className="text-white text-decoration-none">
        {item.name}
      </a>
    </p>
  )
}

export default FooterColumn
