import React from "react";

const ProFile = () => {
  return (
    <div className="container">
      <h1 className="text-center"> ProFile</h1>
      <div className="avatar">
        <img id="preview" src="" alt="Avatar" />
      </div>

      <div>
        <form className="row g-3">
          <div className="col-md-6">
            <label htmlFor="inputEmail4" className="form-label">
              Email
            </label>
            <input type="email" className="form-control" id="inputEmail4" />
          </div>
          <div className="col-md-6">
            <label htmlFor="inputName4" className="form-label">
              Name
            </label>
            <input type="name" className="form-control" id="inputinputName4" />
          </div>
          <div className="col-md-6">
            <label htmlFor="inputIphone4" className="form-label">
              Iphone
            </label>
            <input
              type="iphone"
              className="form-control"
              id="inputinputIphone4"
            />
          </div>
          <div className="col-md-6 ">
            <div className="gender-group">
              <span>Giới tính:</span>
              <label className="gender-option">
                <input
                  type="radio" name="gender"defaultValue="nam" defaultChecked/> Nam</label>
              <label className="gender-option">
                <input type="radio" name="gender" defaultValue="nu"/>Nữ</label>
            </div>
          </div>
      <button type="button" className="btn btn-primary " onclick="{&quot;&quot;}">UpData</button>

        </form>
      </div>
   <div className="">
      <p className="text-center">Order hitstory</p>
      <table className="table">
        <thead>
          <tr>
            <th>Mã SP</th>
            <th>Tên SP</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
      </table>
    </div>

  


    </div>
  );
};

export default ProFile;
