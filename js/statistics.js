import { toggleNav } from "../app.js";
import CategorytService from "../services/categoryService.js";
import ProductService from "../services/productService.js";

const categorytService = new CategorytService();
const productService = new ProductService();

document.addEventListener("DOMContentLoaded", () => {
  const toggleNavBtn = document.getElementById("toggle-nav-btn2");

  toggleNavBtn.addEventListener("click", () => {
    toggleNav();
  });
  handletotalSales();
  renderTopSelling();
  renderTopRevenue();
  renderTopCategories();
});

const handletotalSales = async () => {
  const listProduct = await productService.getProduct();
  const selleds = listProduct.reduce(
    (initValue, curValue) => {
      return {
        sold: initValue.sold + curValue.selled,
        totalSales: initValue.totalSales + curValue.price * curValue.selled,
      };
    },
    { sold: 0, totalSales: 0 }
  );
  document.querySelector(`.revenue strong`).textContent = selleds.sold;
  document.querySelector(`.revenue h4 strong`).textContent =
    selleds.totalSales.toLocaleString();
};

const renderTopSelling = async () => {
  const listProduct = await productService.getProductQuery({ _sort: "selled" });
  const htmlListProduct = document.querySelector(".card-body .row");
  htmlListProduct.innerHTML = "";
  let stringListProduct = ``;
  listProduct
    .slice(0, 4)
    .reverse()
    .forEach((product) => {
      stringListProduct += `
    <div class="col-md-3 col-6">
      <div class="d-flex align-items-center">
        <div class="avatar">
          <img
            src="${product.image}" 
            style='width:36px; height:36px'
            alt="${product.name}"
          />
        </div>
        <div class="ms-3">
          <span class="small mb-1">${product.name}</span>
          <h5 class="mb-0"><strong>${product.selled}</strong> sản phẩm</h5>
        </div>
      </div>
     </div>
    `;
    });
  htmlListProduct.innerHTML = stringListProduct;
};

const renderTopRevenue = async () => {
  const sortProduct = await productService.sortProduct();
  const htmlListProduct = document.querySelector(".top-revenue");
  htmlListProduct.innerHTML = "";
  let stringListProduct = ``;
  htmlListProduct.innerHTML = "";
  sortProduct.forEach((product) => {
    stringListProduct += `
    <div
    class="d-flex flex-wrap justify-content-between align-items-center mb-4"
  >
    <div class="d-flex align-items-center">
      <div class="avatar me-3">
        <img
        src="${product.image}" 
        style='width:36px; height:36px'
        alt="${product.name}"
        />
      </div>
      <div>
        <div class="d-flex align-items-center gap-1">
          <h6 class="mb-0">${product.name}</h6>
        </div>
        <small>Giá: <strong>${product.price.toLocaleString()}</strong></small>
        <small>Bán: <strong>${product.selled}</strong></small>
      </div>
    </div>
    <div class="text-end">
      <h6 class="mb-0 text-primary" style="font-size: 20px">${product.totalSales.toLocaleString()}$</h6>
    </div>
  </div>
    `;
  });
  htmlListProduct.innerHTML = stringListProduct;
};

const renderTopCategories = async () => {
  const promiseProduct = productService.getProduct();
  const promiseCategories = categorytService.get();
  const arrProdCate = await Promise.all([promiseCategories, promiseProduct]);
  const topSellingCategories = arrProdCate?.[0]?.map((category) => {
    const productsInCategory = arrProdCate?.[1]?.filter(
      (product) => product.cate_id === category.id
    );
    const totalSalesInCategory = productsInCategory.reduce((total, product) => {
      return {
        sold: total.sold + product.selled,
        totalSales: total.totalSales + product.price * product.selled,
      };
    },
    { sold: 0, totalSales: 0 });
    return { ...category, ...totalSalesInCategory };
  });

  const sortedCategories = topSellingCategories.sort(
    (a, b) => b.totalSales - a.totalSales
  );

  const htmlListCate = document.querySelector(".top-categories");
  htmlListCate.innerHTML = "";
  let stringListCate = ``;
  htmlListCate.innerHTML = "";
  sortedCategories.forEach((cate,index) => {
    stringListCate += `
    <div
    class="d-flex flex-wrap justify-content-between align-items-center mb-4"
    >
      <div class="d-flex align-items-center">
        <div class="avatar me-3">${index + 1}</div>
        <div>
          <div class="d-flex align-items-center gap-1">
            <h6 class="mb-0">${cate.name}</h6>
          </div>
          <small>Bán: <strong>${cate.sold}</strong></small>
        </div>
      </div>
      <div class="text-end">
        <h6 class="mb-0 text-primary" style="font-size: 20px">${cate.totalSales.toLocaleString()}</h6>
      </div>
    </div>        
    `;
  });
  htmlListCate.innerHTML = stringListCate;
};
