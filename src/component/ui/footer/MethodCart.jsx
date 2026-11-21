import React from 'react'

const MethodCart = (props) => {
  const { item } = props;
  return (
    <div className='wrapper p-3'>
      <a
        href={item.link}
        className='wrapper ratio ratio-1x1 overflow-hidden'
        style={{ width: "40px", maxWidth: "40px", display: "block" }}
        title={item.name}
      >
        <img
          src={item.url}
          alt={item.name}
          className="w-100 h-100 object-fit-cover"
        />
      </a>
    </div>
  )
}

export default MethodCart
