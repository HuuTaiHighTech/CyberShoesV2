import { createSlice } from "@reduxjs/toolkit";
import { fetchFavoriteProducts } from "./apiSlice";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {},
  reducers: {
    addToWishlist(state, action) {
      const product = action.payload;
      state[product.id] = product;
    },
    removeFromWishlist(state, action) {
      delete state[action.payload];
    },
  },
  extraReducers: (builder) => builder.addCase(
    fetchFavoriteProducts.fulfilled,
    (_state, action) =>
      action.payload.reduce((favorites, product) => {
        favorites[product.id] = product;
        return favorites;
      }, {}),
  ),
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
