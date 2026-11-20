import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existingProduct = state.find((item) => item.id === product.id);
      const amount = product.quantity || 1;

      if (existingProduct) {
        existingProduct.quantity += amount;
      } else {
        state.push({ ...product, quantity: amount });
      }
    },
    removeFromCart(state, action) {
      return state.filter((item) => item.id !== action.payload);
    },
    changeCartQuantity(state, action) {
      const { id, amount } = action.payload;
      const product = state.find((item) => item.id === id);

      if (product) {
        product.quantity = Math.max(1, product.quantity + amount);
      }
    },
  },
});

export const { addToCart, removeFromCart, changeCartQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
