import { useEffect, useState } from 'react'
import Card from '../../component/ui/product/Card';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { URL_API } from '../../util/variable_global';

const DetailProduct = () => {
  const params = useParams()
  const [productDetail, setProductDetail] = useState({
    "id": 3,
    "name": "converse chuck taylor",
    "alias": "converse-chuck-taylor",
    "price": 250,
    "feature": false,
    "description": "about this shoe:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ",
    "size": [
      "32",
      "33",
      "34",
      "35"
    ],
    "shortDescription": "about this shoe:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "quantity": 200,
    "detaildetailedImages": [
      "rotate(0deg)",
      "rotateY(180deg)",
      "rotate(45deg)",
      "rotate(-45deg)"
    ],
    "image": "http://apistore.cybersoft.edu.vn/images/converse-chuck-taylor.png",
    "imgLink": "converse-chuck-taylor.png",
    "categories": [
      {
        "id": "VANS_CONVERSE",
        "category": "VANS_CONVERSE"
      }
    ],
    "relatedProducts": [
      {
        "id": 2,
        "name": "vans old school",
        "alias": "vans-old-school",
        "feature": false,
        "price": 200,
        "description": "about this shoe:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ",
        "shortDescription": "about this shoe:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "image": "http://apistore.cybersoft.edu.vn/images/van-old-school.png",
        "imgLink": null
      },
      {
        "id": 3,
        "name": "converse chuck taylor",
        "alias": "converse-chuck-taylor",
        "feature": false,
        "price": 250,
        "description": "about this shoe:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ",
        "shortDescription": "about this shoe:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "image": "http://apistore.cybersoft.edu.vn/images/converse-chuck-taylor.png",
        "imgLink": null
      },
      {
        "id": 1,
        "name": "vans black",
        "alias": "vans-black-black",
        "feature": false,
        "price": 200,
        "description": "about this shoe:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ",
        "shortDescription": "about this shoe:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "image": "http://apistore.cybersoft.edu.vn/images/vans-black-black.png",
        "imgLink": null
      }
    ]
  })
  const getDetail = async () => {
    try {
      //thành công
      // axios rút gọn, fetch()
      const res = await axios.get(`${URL_API}/api/Product/getbyid?id=${params.id}`)
      console.log(res)

      //set lại state 
      setProductDetail(res.data.content)

    } catch (error) {
      //thất bại
      console.log(error)
    }
  }

  useEffect(() => {
    //gọi lại API khi id thay đổi
    getDetail();
  }, [params.id])
  const renderRelatedProduct = () => {
    const arrRelatedPro = productDetail.relatedProducts.map((item, index) => {
      return (
        <div className="col-4" key={item.id}>
          <Card product={item}/>
        </div>
      )
    })

    return arrRelatedPro;
  }

  return (
    <div className='container'>
      <h2>Trang chi tiết sản phẩm</h2>
      <div className="detail-product">
        <div className="row">
          <div className="col-6">
            <img src={productDetail.image} className="w-100" alt={productDetail.name} />
          </div>
          <div className="col-6">
            <h2>{productDetail.name}</h2>
            <p>{productDetail.description}</p>
            <h4>Select size</h4>
            <div className="row">
              {productDetail.size.map((size) => (
                <div className="col-3" key={size}>
                  <span className="card p-3 text-center">{size}</span>
                </div>
              ))}
            </div>
            <span className="h4">${productDetail.price}</span>
            <div>
              <button className="btn btn-primary p-3">+</button>
              <span className="p-3">2</span>
              <button className="btn btn-secondary p-3">-</button>
            </div>
            <div>
              <button className="btn btn-primary">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
      <h2>Related Products</h2>
      <div className="related-products">
        <div className="row">
          {renderRelatedProduct()}
        </div>
      </div>
    </div>
  )
}

export default DetailProduct
