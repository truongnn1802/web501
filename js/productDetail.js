import ProductServices from "../services/productService.js";
import ShopCartService from "../services/shopCartService.js";

const productService = new ProductServices();
const shopCartService = new ShopCartService();
const productDetail = JSON.parse(localStorage.getItem("product"));
let currentProducts = [];
document.addEventListener("DOMContentLoaded", (event) => {
  showDetailProduct();
  handleGetProductsCate();
  handleCountShopCart();
  handleSearch();
  handleFilter();
  handleSort();
});
const handleCountShopCart = async () => {
  document.querySelector(".count").textContent = Object.keys(
    await shopCartService.getAll()
  ).length;
};

const handleSearch = async () => {
  const divSearch = document.querySelector(".search");
  divSearch.querySelector("button").addEventListener("click", async () => {
    const products = await productService.getProductSearch(
      divSearch.querySelector("#input-search").value
    );
    currentProducts = products;
    handleShowProducts(products);
  });
};

const handleFilter = async () => {
  const divFilter = document.querySelector("#productType");

  divFilter.onchange = async function () {
    const op = this.options[this.selectedIndex];
    const products = await productService.getProductQuery({
      ...query,
      _sort: divFilter.value,
    });
    currentProducts = products;
    handleShowProducts(products);
  };
};
const handleSort = async () => {
  const divFilter = document.querySelector("#sortPrice");
  divFilter.onchange = async function () {
    const op = this.options[this.selectedIndex];
    const splitValue = op.textContent.split(" - ");
    const products = currentProducts.filter((product) => {
      if ((splitValue[0] <= product.price) & (splitValue[1] >= product.price)) {
        return true;
      } else {
        return false;
      }
    });
    handleShowProducts(products);
  };
};

const showDetailProduct = async () => {
  const divProduct = document.querySelector(".product-detail");
  divProduct.innerHTML = `
    <div class="row mt-4">
    <div class="col-4">
        <img src="${productDetail.image}" 
         alt="${productDetail.name}" class="product-detail__img">
    </div>
    <div class="col-8 product-detail__info">
        <h2 class="name">${productDetail.name}</h2>
        <p class="price">${Number(productDetail.price).toLocaleString()}đ</p>
        <div class="detail">${productDetail.desc}</div>
        <div class="quantity">
            <span>Số lượng</span>
            <input type="number" value="1"><span>Sản phẩm sẵn có:${
              Number(productDetail.quantity) - Number(productDetail.selled)
            }</span>
            <div class="message" style="color:red;font-size:14px">${
              Number(productDetail.quantity) - Number(productDetail.selled) <= 0
                ? "Sản phẩm hiện đang hết hàng"
                : ""
            }</div>
        </div>
        <div>
            <button class="btn-s btn--l add-cart">Thêm vào giỏ hàng</button>
        </div>
    </div>
    </div>
  `;
  const btnAddCart = document.querySelector(".add-cart");
  btnAddCart.addEventListener("click", async () => {
    const inputNumber = document.querySelector('input[type="number"]');
    if (
      inputNumber.value < 1 ||
      inputNumber.value >
        Number(productDetail.quantity) - Number(productDetail.selled)
    ) {
      document.querySelector(".message").textContent =
        "Số sản phẩm đặt mua phải lớn hơn 0 và nhỏ hơn số sản phẩm hiện có";
    } else {
      await shopCartService.insert(productDetail.key, inputNumber.value);
      handleCountShopCart();
    }
  });
};

const handleGetProductsCate = async () => {
  let listProductCate = await productService.getProductQuery({
    cate_id: productDetail.cate_id,
  });
  let products = ``;
  for (let key in listProductCate) {
    products += ` 
      <div class="mb-3" style="width:200px">
        <a href="./product-detail.html">
    <div class="card product-card product" data-id="${key}">
      <div class="product__img" style="min-height:200px ">
        <img
            src="${listProductCate[key].image}" 
            style='width:100%'
            alt="${listProductCate[key].name}"/>
      </div>
      <div class="card-body">
        <h5 class="card-title">${listProductCate[key].name}</h5>
        <p class="card-text" style="margin:0">Đã bán: ${
          listProductCate[key].selled
        }</p>
        <p class="card-text text-muted" style='font-weight:600;font-size:18px'>${Number(
          listProductCate[key].price
        ).toLocaleString()}đ</p>
        <a href="#" class="cart-icon" style="display:block;text-align:right">
          <i class="fas fa-shopping-cart"></i>
        </a>
      </div>
    </div>
    </a>
    </div>
    `;
  }
  const divProductList = document.querySelector(".products-related");
  divProductList.innerHTML = products;
  document.querySelectorAll(".product-card.product").forEach((card) => {
    card.addEventListener("click", (e) => {
      localStorage.setItem(
        "product",
        JSON.stringify({
          key: card.getAttribute("data-id"),
          ...listProductCate[card.getAttribute("data-id")],
        })
      );
    });
    const iShopCart = card.querySelector("a i");
    iShopCart.addEventListener("click", async (e) => {
      e.preventDefault();
      await shopCartService.insert(iShopCart.getAttribute("data-id"), 1);
      handleCountShopCart();
    });
  });
};
