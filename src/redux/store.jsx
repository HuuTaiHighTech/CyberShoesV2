// quản lý tập trung tất cả state của dự án
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import wishlistReducer from "./wishlistSlice";
import apiReducer from "./apiSlice";

//  Nhiệm vụ của reducer: Hàm trả về state, khi state thay đổi sẽ tự động kiểm tra và render lại component
// hàm kích hoạt khi ứng dụng được gởi tạo, và mỗi lần đưa dữ liệu lên reducer
// B1: thiết lập store (thiết lập 1 lần khi cài đặt store)
// B2: tạo state tập trung (reducer)

export const store = configureStore({
    reducer:{
        cart: cartReducer,
        auth: authReducer,
        wishlist: wishlistReducer,
        api: apiReducer,
    }
})