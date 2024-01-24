import { convertDbToList } from "../app.js";
import CategoryService from "../services/categoryService.js";
import ProductServices from "../services/productService.js";
import ShopCartService from "../services/shopCartService.js";

const categoryService = new CategoryService();
const productService = new ProductServices();
const shopCartService = new ShopCartService();

document.addEventListener("DOMContentLoaded", async () => {
  handleGetAllCategory();
  handleGetProducts(null);
  handleCountShopCart();
  handleSearch();
  handleFilter();
});

const handleCountShopCart = async () => {
  document.querySelector(".count").textContent = Object.keys(
    await shopCartService.getShopCart()
  ).length;
};

const handleSearch = async () => {
  const divSearch = document.querySelector(".search");
  divSearch.querySelector("button").addEventListener("click", async () => {
    const products = await productService.getProductCate(
      divSearch.querySelector("#input-search").value,
      "name"
    );
    handleShowProducts(products);
  });
};

const handleFilter = async () => {
  const divFilter = document.querySelector("#productType");

  divFilter.onchange = async function () {
    const op = this.options[this.selectedIndex]
    const splitValue = op.textContent.split(" - ");
    console.log(splitValue);
    const products = await productService.getProductSort(
      divFilter.value,
      Number(splitValue[0]),
      Number(splitValue[1])
    );
    console.log(products);
    handleShowProducts(products);
  };
};

const handleGetAllCategory = async () => {
  const getAllCate = await categoryService.getAllCategory();
  const listCate = convertDbToList(getAllCate);
  const divCate = document.querySelector(".category__body");
  let categories = ``;
  for (let cate of listCate) {
    categories += `<li class="item" data-id ='${cate.key}'>${cate?.name}</li>`;
  }
  divCate.innerHTML = categories;
  document.querySelectorAll(".category__body li").forEach((li, index, arr) => {
    li.addEventListener("click", () => {
      arr.forEach((a) => (a.classList = "item"));
      li.classList.add("active");
      handleGetProducts(li.getAttribute("data-id"));
    });
  });
};

const handleGetProducts = async (id) => {
  let listProductCate = null;
  if (id) {
    listProductCate = await productService.getProductCate(id);
  } else {
    listProductCate = await productService.getProduct();
  }
  handleShowProducts(listProductCate);
};

const handleShowProducts = (listProduct) => {
  let products = " ";
  for (let key in listProduct) {
    products += ` 
      <div class="mb-3" style="width:200px">
        <a href="/product-detail.html">
    <div class="card product-card product" data-id="${key}">
      <div class="product__img" style="height:200px">
        <img
            src="${listProduct[key].image}" 
            style='width:100%; height:200px '
            alt="${listProduct[key].name}"/>
      </div>
      <div class="card-body">
        <h5 class="card-title">${listProduct[key].name}</h5>
        <p class="card-text" style="margin:0">Đã bán: ${
          listProduct[key].selled
        }</p>
        <p class="card-text text-muted" style='font-weight:600;font-size:18px'>${Number(
          listProduct[key].price
        ).toLocaleString()}đ</p>
        <a href="#" class="cart-icon" style="display:block;text-align:right">
          <i class="fas fa-shopping-cart" data-id="${key}"></i>
        </a>
      </div>
    </div>
    </a>
    </div>
    `;
  }
  const divProductList = document.querySelector(".list-product > .row");
  divProductList.innerHTML = !listProduct
    ? "<p>Không có sản phẩm!</p>"
    : products;
  document.querySelectorAll(".product-card.product").forEach((card) => {
    card.addEventListener("click", () => {
      localStorage.setItem(
        "product",
        JSON.stringify({
          ...listProduct[card.getAttribute("data-id")],
          key: card.getAttribute("data-id"),
        })
      );
    });
    const iShopCart = card.querySelector("a i");
    iShopCart.addEventListener("click", async (e) => {
      e.preventDefault();
      shopCartService.insertShopCart(iShopCart.getAttribute("data-id"), 1);
      handleCountShopCart();
    });
  });
};
