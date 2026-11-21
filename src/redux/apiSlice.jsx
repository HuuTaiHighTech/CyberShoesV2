import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  TOKEN_CYBERSOFT,
  URL_API,
  USER_SIGN_IN_API,
  USER_SIGN_UP_API,
} from "../util/variable_global";

const getApiConfig = () =>
  TOKEN_CYBERSOFT
    ? { headers: { TokenCybersoft: TOKEN_CYBERSOFT } }
    : undefined;

const REFRESH_TOKEN_URL = `${URL_API}/api/Users/RefeshToken`;
let refreshTokenRequest;

const getStoredUser = () => {
  const storedUser = window.localStorage.getItem("userLogin");
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Không thể đọc thông tin đăng nhập đã lưu:", error);
    return null;
  }
};

const clearSession = () => {
  window.localStorage.removeItem("userLogin");
  window.dispatchEvent(new Event("auth:logout"));
};

const refreshAccessToken = async () => {
  const user = getStoredUser();
  if (!user?.accessToken) {
    throw new Error("Không tìm thấy access token để làm mới phiên đăng nhập.");
  }

  const apiConfig = getApiConfig() || {};
  const response = await axios.get(REFRESH_TOKEN_URL, {
    ...apiConfig,
    headers: {
      ...(apiConfig.headers || {}),
      Authorization: user.accessToken,
    },
  });
  const refreshedUser = response.data?.content;
  const accessToken =
    refreshedUser?.accessToken || response.data?.accessToken;

  if (typeof accessToken !== "string" || !accessToken) {
    throw new Error("API làm mới token không trả về access token hợp lệ.");
  }

  const updatedUser = {
    ...user,
    ...(refreshedUser && typeof refreshedUser === "object"
      ? refreshedUser
      : {}),
    accessToken,
  };
  window.localStorage.setItem("userLogin", JSON.stringify(updatedUser));
  window.dispatchEvent(
    new CustomEvent("auth:token-refreshed", { detail: updatedUser }),
  );
  return accessToken;
};

const isAuthEndpoint = (url = "") =>
  url.includes("/api/Users/signin") ||
  url.includes("/api/Users/signup") ||
  url.includes("/api/Users/RefeshToken");

axios.interceptors.request.use((config) => {
  if (config.headers?.Authorization) {
    const user = getStoredUser();
    if (user?.accessToken) {
      config.headers.Authorization = user.accessToken;
    }
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    const status = error.response?.status;

    const hasSession =
      Boolean(getStoredUser()?.accessToken) ||
      Boolean(config?.headers?.Authorization);
    if (status === 401 && config && !isAuthEndpoint(config.url) && hasSession) {
      clearSession();
    }

    if (
      status !== 403 ||
      !config ||
      config._retriedAfterRefresh ||
      isAuthEndpoint(config.url) ||
      !getStoredUser()?.accessToken
    ) {
      return Promise.reject(error);
    }

    config._retriedAfterRefresh = true;

    try {
      if (!refreshTokenRequest) {
        refreshTokenRequest = refreshAccessToken().finally(() => {
          refreshTokenRequest = null;
        });
      }

      const accessToken = await refreshTokenRequest;
      config.headers = config.headers || {};
      config.headers.Authorization = accessToken;
      return await axios(config);
    } catch (refreshError) {
      if ([401, 403].includes(refreshError.response?.status)) {
        clearSession();
      }
      return Promise.reject(refreshError);
    }
  },
);

const getErrorMessage = (error) => {
  const responseData = error.response?.data;
  if (typeof responseData?.message === "string") {
    return responseData.message;
  }
  if (typeof responseData === "string") {
    return responseData;
  }
  return error.message || "Đã xảy ra lỗi khi gọi API.";
};

export const fetchProducts = createAsyncThunk(
  "api/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${URL_API}/api/Product`, getApiConfig());
      const products = Array.isArray(response.data)
        ? response.data
        : response.data?.content;

      if (!Array.isArray(products)) {
        throw new Error("Dữ liệu trả về từ API không đúng định dạng danh sách.");
      }

      return products;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchProductsByPaging = createAsyncThunk(
  "api/fetchProductsByPaging",
  async ({ pageSize, keywords = "" }, { rejectWithValue }) => {
    try {
      const products = [];
      let totalRow = 0;
      let pageIndex = 1;
      let totalPages = 1;

      do {
        const response = await axios.get(
          `${URL_API}/api/Product/getpaging`,
          {
            ...(getApiConfig() || {}),
            params: { pageIndex, pageSize, keywords },
          },
        );
        const page = response.data?.content;
        const items = page?.items;

        if (!Array.isArray(items)) {
          throw new Error("Dữ liệu sản phẩm phân trang không đúng định dạng.");
        }

        const normalizedItems = items.map((product) => {
          let categories = product.categories;
          if (typeof categories === "string") {
            categories = JSON.parse(categories);
          }
          if (categories == null) {
            categories = [];
          }
          if (!Array.isArray(categories)) {
            throw new Error(
              `Danh mục của sản phẩm ${product.id} không đúng định dạng.`,
            );
          }
          return { ...product, categories };
        });
        products.push(...normalizedItems);

        totalRow = Number(page.totalRow ?? products.length);
        const responsePageSize = Number(page.pageSize ?? pageSize);
        if (!Number.isInteger(totalRow) || totalRow < 0 ||
            !Number.isInteger(responsePageSize) || responsePageSize < 1) {
          throw new Error("Thông tin phân trang trả về không hợp lệ.");
        }

        totalPages = Math.ceil(totalRow / responsePageSize);
        if (pageIndex >= totalPages) {
          break;
        }
        if (items.length === 0) {
          throw new Error("API không trả về sản phẩm ở một trang cần tải.");
        }
        pageIndex += 1;
      } while (pageIndex <= totalPages);

      return {
        products,
        pageSize,
        totalRow,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchProductById = createAsyncThunk(
  "api/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${URL_API}/api/Product/getbyid?id=${id}`,
        getApiConfig(),
      );
      return response.data?.content;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "api/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${URL_API}/api/Product`, {
        params: { ProductId: id },
        ...(getApiConfig() || {}),
      });
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const saveProduct = createAsyncThunk(
  "api/saveProduct",
  async (product, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${URL_API}/api/Product`,
        product,
        getApiConfig(),
      );
      return {
        product:
          response.data?.content && typeof response.data.content === "object"
            ? response.data.content
            : product,
        status: response.status,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const signIn = createAsyncThunk(
  "api/signIn",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        USER_SIGN_IN_API,
        credentials,
        getApiConfig(),
      );
      const responseUser = response.data?.content;

      if (
        !responseUser ||
        typeof responseUser.accessToken !== "string" ||
        !responseUser.accessToken
      ) {
        throw new Error("API không trả về access token hợp lệ.");
      }

      const user = {
        ...responseUser,
        email: responseUser.email || credentials.email,
      };
      localStorage.setItem("userLogin", JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const signUp = createAsyncThunk(
  "api/signUp",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        USER_SIGN_UP_API,
        userData,
        getApiConfig(),
      );
      return response.data?.message || "Đăng ký thành công. Bạn có thể đăng nhập.";
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const placeOrder = createAsyncThunk(
  "api/placeOrder",
  async ({ orderData, accessToken }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${URL_API}/api/Users/order`,
        orderData,
        { headers: { Authorization: accessToken } },
      );
      return response.data?.message || "Đặt hàng thành công.";
    } catch (error) {
      return rejectWithValue({
        status: error.response?.status,
        message: getErrorMessage(error),
      });
    }
  },
);

export const likeProduct = createAsyncThunk(
  "api/likeProduct",
  async ({ productId, accessToken }, { rejectWithValue }) => {
    if (!accessToken) {
      return rejectWithValue("Vui lòng đăng nhập để thích sản phẩm.");
    }

    try {
      await axios.get(`${URL_API}/api/Users/like`, {
        params: { productId },
        headers: { Authorization: accessToken },
      });
      return productId;
    } catch (error) {
      return rejectWithValue({
        status: error.response?.status,
        message: getErrorMessage(error),
      });
    }
  },
);

export const unlikeProduct = createAsyncThunk(
  "api/unlikeProduct",
  async ({ productId, accessToken }, { rejectWithValue }) => {
    if (!accessToken) {
      return rejectWithValue("Vui lòng đăng nhập để bỏ thích sản phẩm.");
    }

    try {
      await axios.get(`${URL_API}/api/Users/unlike`, {
        params: { productId },
        headers: { Authorization: accessToken },
      });
      return productId;
    } catch (error) {
      return rejectWithValue({
        status: error.response?.status,
        message: getErrorMessage(error),
      });
    }
  },
);

export const fetchFavoriteProducts = createAsyncThunk(
  "api/fetchFavoriteProducts",
  async (accessToken, { rejectWithValue }) => {
    if (!accessToken) {
      return rejectWithValue("Vui lòng đăng nhập để xem sản phẩm yêu thích.");
    }

    try {
      const response = await axios.get(
        `${URL_API}/api/Users/getproductfavorite`,
        { headers: { Authorization: accessToken } },
      );
      const products = response.data?.content?.productsFavorite;

      if (!Array.isArray(products)) {
        throw new Error("Dữ liệu sản phẩm yêu thích không đúng định dạng.");
      }

      return products;
    } catch (error) {
      return rejectWithValue({
        status: error.response?.status,
        message: getErrorMessage(error),
      });
    }
  },
);

export const fetchProfile = createAsyncThunk(
  "api/fetchProfile",
  async (email, { rejectWithValue }) => {
    if (!email) {
      return rejectWithValue("Không tìm thấy email để tải hồ sơ.");
    }

    try {
      const response = await axios.get(
        `${URL_API}/api/Users/detail`,
        { params: { email } },
      );
      const profile = response.data?.content;

      if (
        !profile ||
        typeof profile !== "object" ||
        Array.isArray(profile) ||
        profile.id == null
      ) {
        throw new Error("Dữ liệu hồ sơ trả về không đúng định dạng.");
      }

      return {
        id: profile.id,
        email: profile.email ?? email,
        name: profile.name ?? "",
        gender: profile.gender,
        phone: profile.phone ?? "",
        avatar: profile.avatar,
        image: profile.image,
      };
    } catch (error) {
      return rejectWithValue({
        status: error.response?.status,
        message: getErrorMessage(error),
      });
    }
  },
);

export const fetchOrderHistory = createAsyncThunk(
  "api/fetchOrderHistory",
  async (accessToken, { rejectWithValue }) => {
    if (!accessToken) {
      return rejectWithValue({
        message: "Vui lòng đăng nhập để xem lịch sử đơn hàng.",
      });
    }

    try {
      const response = await axios.post(
        `${URL_API}/api/Users/getProfileV2`,
        null,
        { headers: { Authorization: accessToken } },
      );
      const responseContent = response.data?.content;
      const orders = [
        responseContent?.ordersHistory,
        responseContent?.content?.ordersHistory,
        responseContent?.profile?.ordersHistory,
        responseContent?.profile?.content?.ordersHistory,
      ].find(Array.isArray);

      if (!orders) {
        throw new Error("Dữ liệu lịch sử đơn hàng trả về không đúng định dạng.");
      }

      return orders;
    } catch (error) {
      return rejectWithValue({
        status: error.response?.status,
        message: getErrorMessage(error),
      });
    }
  },
);

export const updateProfile = createAsyncThunk(
  "api/updateProfile",
  async ({ profile, accessToken }, { rejectWithValue }) => {
    if (!accessToken) {
      return rejectWithValue("Vui lòng đăng nhập để cập nhật hồ sơ.");
    }

    try {
      const response = await axios.post(
        `${URL_API}/api/Users/updateProfile`,
        profile,
        { headers: { Authorization: accessToken } },
      );
      const responseProfile = response.data?.content;

      const updatedProfile = {
        ...profile,
        ...(responseProfile &&
        typeof responseProfile === "object" &&
        !Array.isArray(responseProfile)
          ? responseProfile
          : {}),
      };
      delete updatedProfile.password;
      return updatedProfile;
    } catch (error) {
      return rejectWithValue({
        status: error.response?.status,
        message: getErrorMessage(error),
      });
    }
  },
);

const apiSlice = createSlice({
  name: "api",
  initialState: {
    products: [],
    pagedProducts: [],
    pageIndex: 1,
    pageSize: 30,
    totalRow: 0,
    productDetail: null,
    productsStatus: "idle",
    pagingStatus: "idle",
    pagingError: null,
    productDetailStatus: "idle",
    productsError: null,
    productDetailError: null,
    favoritesStatus: "idle",
    favoritesError: null,
    profile: null,
    profileStatus: "idle",
    profileError: null,
    profileUpdateStatus: "idle",
    profileUpdateError: null,
    orderHistory: [],
    orderHistoryStatus: "idle",
    orderHistoryError: null,
  },
  reducers: {
    setProductPage(state, action) {
      state.pageIndex = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.productsStatus = "loading";
        state.productsError = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.productsStatus = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.productsStatus = "failed";
        state.productsError = action.payload || action.error.message;
      })
      .addCase(fetchProductsByPaging.pending, (state) => {
        state.pagingStatus = "loading";
        state.pagingError = null;
        state.pagedProducts = [];
        state.totalRow = 0;
      })
      .addCase(fetchProductsByPaging.fulfilled, (state, action) => {
        state.pagingStatus = "succeeded";
        state.pagedProducts = action.payload.products;
        state.pageSize = action.payload.pageSize;
        state.totalRow = action.payload.totalRow;
      })
      .addCase(fetchProductsByPaging.rejected, (state, action) => {
        state.pagingStatus = "failed";
        state.pagingError = action.payload || action.error.message;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.productDetailStatus = "loading";
        state.productDetailError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productDetailStatus = "succeeded";
        state.productDetail = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.productDetailStatus = "failed";
        state.productDetailError = action.payload || action.error.message;
      })
      .addCase(fetchFavoriteProducts.pending, (state) => {
        state.favoritesStatus = "loading";
        state.favoritesError = null;
      })
      .addCase(fetchFavoriteProducts.fulfilled, (state) => {
        state.favoritesStatus = "succeeded";
      })
      .addCase(fetchFavoriteProducts.rejected, (state, action) => {
        state.favoritesStatus = "failed";
        state.favoritesError =
          action.payload?.message || action.payload || action.error.message;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.profileStatus = "loading";
        state.profileError = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profileStatus = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.profileStatus = "failed";
        state.profileError =
          action.payload?.message || action.payload || action.error.message;
      })
      .addCase(fetchOrderHistory.pending, (state) => {
        state.orderHistoryStatus = "loading";
        state.orderHistoryError = null;
        state.orderHistory = [];
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.orderHistoryStatus = "succeeded";
        state.orderHistory = action.payload;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.orderHistoryStatus = "failed";
        state.orderHistoryError =
          action.payload?.message || action.payload || action.error.message;
      })
      .addCase(updateProfile.pending, (state) => {
        state.profileUpdateStatus = "loading";
        state.profileUpdateError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileUpdateStatus = "succeeded";
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileUpdateStatus = "failed";
        state.profileUpdateError =
          action.payload?.message || action.payload || action.error.message;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.id !== action.payload,
        );
      })
      .addCase(saveProduct.fulfilled, (state, action) => {
        const savedProduct = action.payload.product;
        const productIndex = state.products.findIndex(
          (product) => product.id === savedProduct.id,
        );

        if (productIndex === -1) {
          state.products.push(savedProduct);
        } else {
          state.products[productIndex] = savedProduct;
        }
      });
  },
});

export const { setProductPage } = apiSlice.actions;
export default apiSlice.reducer;
