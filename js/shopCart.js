import { convertDbToList } from "../app.js";
import OrderDetailServices from "../services/orderDetailService.js";
import OrderServices from "../services/orderService.js";
import ProductServices from "../services/productService.js";
import ShopCartService from "../services/shopCartService.js";

const productService = new ProductServices();
const shopCartService = new ShopCartService();
const orderService = new OrderServices();
const orderDetailService = new OrderDetailServices();

let countCheck = 0;
let arrChoose = [];
let pay = 0;

const spanCount = document.querySelector(".count-choose");

document.addEventListener("DOMContentLoaded", (event) => {
  handleProductsAdd();
  const customName = document.getElementById("custom-name");
  const customAddress = document.getElementById("custom-address");
  const customPhoneN = document.getElementById("custom-phoneN");
  const btnModal = document.querySelector(".modal-footer button");
  btnModal.addEventListener("click", async () => {
    if (customName.value && customAddress.value && customPhoneN.value) {
      document.querySelector(".modal-warning").style = "display:none";
      customName.style = "border-color:#c0c0c0;height: 40px;";
      customAddress.style = "border-color:#c0c0c0;height: 40px;";
      customPhoneN.style = "border-color:#c0c0c0;height: 40px;";
      const idOrder = await orderService.insertProduct(
        customName.value,
        customAddress.value,
        customPhoneN.value,
        "pending"
      );
      for (let product of arrChoose) {
        const prd = await productService.getProduct(product.idProduct);
        productService.updateProduct(product.idProduct, {
          ...prd,
          selled: prd.selled + product.amount,
        });
        await shopCartService.removeShopCart(product.key);
        orderDetailService.insertOrderDetail(
          idOrder,
          product.idProduct,
          product.amount
        );
        handleProductsAdd();
      }
      pay = 0;
      countCheck = [];
      pay = 0;
      spanCount.innerHTML = "0";
    } else {
      document.querySelector(".modal-warning").style = "display:block";
      customName.style = "border-color:red;height: 40px;";
      customAddress.style = "border-color:red;height: 40px;";
      customPhoneN.style = "border-color:red;height: 40px;";
    }
  });
});

const showInfoPayment = async () => {
  let divShowProduct = document.querySelector(".show-added");
  let divTotal = document.querySelector(".show-added ~ p");
  divShowProduct.innerHTML = "";
  arrChoose.forEach((choose) => {
    divShowProduct.innerHTML += `<div style="display: flex;justify-content: space-between;">
    <span style="flex: 1;">${choose.name}</span>
    <span style="width: 50px; text-align: center;">${choose.amount}</span>
    <span style="width: 100px; text-align: right;">${Number(
      choose.price * choose.amount
    ).toLocaleString()}</span>
    </div>`;
  });
  divTotal.innerHTML = `<strong>${Number(pay).toLocaleString()}</strong>`;
};

const handleProductsAdd = async () => {
  let listProduct = convertDbToList(await shopCartService.getShopCart());
  const newProduct = [];
  let products = ``;
  for (let prd of listProduct) {
    let product = await productService.getProduct(prd.idProduct);
    newProduct.push({ ...prd, ...product });
    products += `   
    <tr>
    <td><input type='checkbox' data-id=${prd.key} style="display:inline"/></td>
    <td>${prd.idProduct}</td>
    <td class="text-truncate">${product?.name}</td>
    <td class="text-truncate"><img
    src="${product?.image}" 
    style='width:60px; height:auto '
    alt="${product?.name}"/></td>
    <td class="text-truncate">${Number(product?.price).toLocaleString()}đ</td>
    <td class="text-truncate">${prd.amount}</td>
    <td class="text-truncate">${Number(
      product.price * prd.amount
    ).toLocaleString()}đ</td>
    <td class="text-truncate"><i class="fas fa-trash" data-id=${
      prd.key
    }></i></td>
  </tr>
    `;
  }

  const divProductList = document.querySelector("tbody");
  divProductList.innerHTML = products;

  document.querySelectorAll("td > input").forEach((cb, index) => {
    cb.addEventListener("click", () => {
      if (cb.checked) {
        countCheck++;
        arrChoose.push({ index, ...newProduct[index] });
        pay +=
          Number(newProduct[index].price) * Number(newProduct[index].amount);
      } else {
        countCheck--;
        arrChoose = [...arrChoose.filter((i) => i.index != index)];
        pay -=
          Number(newProduct[index].price) * Number(newProduct[index].amount);
      }
      spanCount.innerHTML = `${pay.toLocaleString()}đ(${countCheck})`;
      if (arrChoose.length > 0) {
        document.querySelector('a[role="button"]').href = "#exampleModalToggle";
        document.querySelector('a[role="button"]').style =
          "background-color: #0d6efd";
      } else {
        document.querySelector('a[role="button"]').href = "";
        document.querySelector('a[role="button"]').style =
          "background-color: #ccc;border:none";
      }
      showInfoPayment();
    });
  });
};
