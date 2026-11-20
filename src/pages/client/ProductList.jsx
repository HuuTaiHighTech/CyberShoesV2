import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { clearCredentials } from "../../redux/authSlice";
import { addToCart } from "../../redux/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/wishlistSlice";
import Card from "../../component/ui/product/Card"
import {
  fetchFavoriteProducts,
  fetchProductsByPaging,
  likeProduct,
  setProductPage,
  unlikeProduct,
} from "../../redux/apiSlice";
import { TOKEN_CYBERSOFT, URL_API } from "../../util/variable_global";
import Paging from "../../component/ui/Paging";

const PAGE_SIZE = 30;
const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const wishlist = useSelector((state) => state.wishlist);
  const { accessToken } = useSelector((state) => state.auth);
  const favoritesStatus = useSelector((state) => state.api.favoritesStatus);
  const products = useSelector((state) => state.api.pagedProducts);
  const pagingStatus = useSelector((state) => state.api.pagingStatus);
  const pagingError = useSelector((state) => state.api.pagingError);
  const pageIndex = useSelector((state) => state.api.pageIndex);
  const pageSize = useSelector((state) => state.api.pageSize);
  const [categories, setCategories] = useState([]);
  const [categoriesStatus, setCategoriesStatus] = useState("loading");
  const [categoriesError, setCategoriesError] = useState("");
  const selectedCategoryId = searchParams.get("tab") || "all";
  const queryPage = Number(searchParams.get("page") || 1);
  const activeCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  );
  const keywords =
    selectedCategoryId === "all"
      ? ""
      : activeCategory?.alias || activeCategory?.name || selectedCategoryId;
  const [wishlistError, setWishlistError] = useState("");

  const redirectToSignIn = useCallback(() => {
    window.localStorage.removeItem("userLogin");
    dispatch(clearCredentials());
    navigate("/sign-in", { replace: true });
  }, [dispatch, navigate]);

  const addProCart = (proClick) => {
    dispatch(addToCart({ ...proClick, quantity: 1 }));
  }

  useEffect(() => {
    if (categoriesStatus === "loading") {
      return;
    }

    dispatch(fetchProductsByPaging({ pageSize: PAGE_SIZE, keywords }));
  }, [categoriesStatus, dispatch, keywords])

  useEffect(() => {
    const controller = new AbortController();
    const config = {
      signal: controller.signal,
      ...(TOKEN_CYBERSOFT
        ? { headers: { TokenCybersoft: TOKEN_CYBERSOFT } }
        : {}),
    };

    const loadCategories = async () => {
      try {
        const response = await axios.get(
          `${URL_API}/api/Product/getAllCategory`,
          config,
        );
        const responseCategories = Array.isArray(response.data)
          ? response.data
          : response.data?.content?.categories ?? response.data?.content;

        if (!Array.isArray(responseCategories)) {
          throw new Error("Dữ liệu danh mục trả về không đúng định dạng.");
        }

        const normalizedCategories = responseCategories.map((category) => {
          const id = category.id ?? category.categoryId ?? category.category;
          const name =
            category.category ?? category.name ?? category.categoryName;

          if (id == null || typeof name !== "string" || !name.trim()) {
            throw new Error("Thông tin danh mục trả về không hợp lệ.");
          }

          return {
            id: String(id),
            name: name.trim(),
            alias: category.alias,
          };
        });

        setCategories(normalizedCategories);
        setCategoriesStatus("succeeded");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setCategoriesError(
          error.response?.data?.message ||
            error.message ||
            "Không thể tải danh mục.",
        );
        setCategoriesStatus("failed");
      }
    };

    loadCategories();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (accessToken && favoritesStatus === "idle") {
      dispatch(fetchFavoriteProducts(accessToken))
        .unwrap()
        .catch((error) => {
          if (error?.status === 401) {
            redirectToSignIn();
          }
        });
    }
  }, [accessToken, dispatch, favoritesStatus, redirectToSignIn])

  useEffect(() => {
    if (Number.isInteger(queryPage) && queryPage > 0 && queryPage !== pageIndex) {
      dispatch(setProductPage(queryPage));
    }
  }, [dispatch, pageIndex, queryPage]);
  const handleWishlist = async (productId, iconStatus) => {
    const productClick = products.find((item) => item.id === productId);
    if (!productClick) {
      throw new Error(`Không tìm thấy sản phẩm có id ${productId}`);
    }

    if (!accessToken) {
      navigate("/sign-in");
      return;
    }

    setWishlistError("");
    try {
      if (iconStatus) {
        await dispatch(unlikeProduct({ productId, accessToken })).unwrap();
        dispatch(removeFromWishlist(productId));
      } else {
        await dispatch(likeProduct({ productId, accessToken })).unwrap();
        dispatch(addToWishlist(productClick));
      }
      await dispatch(fetchFavoriteProducts(accessToken)).unwrap();
    } catch (error) {
      if (error?.status === 401) {
        redirectToSignIn();
        return;
      }

      setWishlistError(
        `Không thể thích sản phẩm: ${error?.message || error}`,
      );
    }
  };
  const renderProductList = () => {
    const firstProductIndex = (pageIndex - 1) * PAGE_SIZE;
    const pageProducts = products.slice(
      firstProductIndex,
      firstProductIndex + PAGE_SIZE,
    );
    const arrProduct = pageProducts.map((item) => {
      return (
        <div className="col-4" key={item.id}>
          <Card
            product={item}
            addProCart={addProCart}
            wishlist={wishlist}
            handleWishlist={handleWishlist}
          />
        </div>
      )
    })
    return arrProduct.length
      ? arrProduct
      : pagingStatus === "succeeded"
        ? <p>Không có sản phẩm trong danh mục này.</p>
        : null
  }

  const handlePageChange = (page) => {
    dispatch(setProductPage(page));
    const nextSearchParams = new URLSearchParams();
    nextSearchParams.set("page", String(page));
    nextSearchParams.set("tab", selectedCategoryId);
    setSearchParams(nextSearchParams);
  }

  useEffect(() => {
    const totalPages = Math.ceil(products.length / pageSize);
    if (
      pagingStatus !== "succeeded" ||
      totalPages === 0 ||
      pageIndex <= totalPages
    ) {
      return;
    }

    dispatch(setProductPage(totalPages));
    const nextSearchParams = new URLSearchParams();
    nextSearchParams.set("page", String(totalPages));
    nextSearchParams.set("tab", selectedCategoryId);
    setSearchParams(nextSearchParams, { replace: true });
  }, [
    dispatch,
    pageIndex,
    pageSize,
    pagingStatus,
    products.length,
    selectedCategoryId,
    setSearchParams,
  ]);

  const handleCategoryChange = (categoryId) => {
    const nextSearchParams = new URLSearchParams();
    nextSearchParams.set("page", "1");
    nextSearchParams.set("tab", categoryId);
    setSearchParams(nextSearchParams);
    dispatch(setProductPage(1));
  }

  useEffect(() => {
    const validPage = Number.isInteger(queryPage) && queryPage > 0;
    if (
      searchParams.get("tab") === selectedCategoryId &&
      searchParams.get("page") === String(validPage ? queryPage : 1) &&
      !searchParams.has("group") &&
      validPage
    ) {
      return;
    }

    const nextSearchParams = new URLSearchParams();
    nextSearchParams.set("page", String(validPage ? queryPage : 1));
    nextSearchParams.set("tab", selectedCategoryId);
    setSearchParams(nextSearchParams, { replace: true });
  }, [
    queryPage,
    searchParams,
    selectedCategoryId,
    setSearchParams,
  ]);

  return (
    <div className="container">
      <h2>Product List</h2>
      <div className="d-flex flex-wrap gap-2 my-3" role="tablist" aria-label="Danh mục sản phẩm">
        <button
          type="button"
          role="tab"
          aria-selected={selectedCategoryId === "all"}
          className={`btn ${selectedCategoryId === "all" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => handleCategoryChange("all")}
        >
          Tất cả
        </button>
        {categories.map((category) => (
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategoryId === category.id}
            className={`btn ${selectedCategoryId === category.id ? "btn-primary" : "btn-outline-primary"}`}
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      {categoriesStatus === "loading" && <p>Đang tải danh mục...</p>}
      {categoriesStatus === "failed" && (
        <p role="alert">Không thể tải danh mục: {categoriesError}</p>
      )}
      <div className="product-list">
        {pagingStatus === "loading" && <p>Đang tải sản phẩm...</p>}
        {pagingStatus === "failed" && (
          <p role="alert">Không thể tải sản phẩm: {pagingError}</p>
        )}
        {wishlistError && (
          <p role="alert">{wishlistError}</p>
        )}
        <div className="row">
          {renderProductList()}
        </div>
      </div>
      <Paging
        currentPage={pageIndex}
        totalPages={Math.ceil(products.length / pageSize)}
        onPageChange={handlePageChange}
        disabled={pagingStatus === "loading"}
      />
    </div>
  )
}

export default ProductList