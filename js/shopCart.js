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
const account = JSON.parse(localStorage.getItem("account"));
const spanCount = document.querySelector(".count-choose");

document.addEventListener("DOMContentLoaded", (event) => {
  if (JSON.parse(localStorage.getItem("account")).role != "user") {
    window.location.href = "/";
  }
  handleProductsAdd();
  handleProductsBuyed();

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
      const idOrder = await orderService.insert(
        account.id,
        customName.value,
        customAddress.value,
        customPhoneN.value,
        "pending"
      );
      for (let order of arrChoose) {
        const prd = await productService.getProduct(order.idProduct);
        productService.update(order.idProduct, {
          ...prd,
          selled: prd.selled + order.amount,
        });
        await shopCartService.remove(order.id);

        orderDetailService.insert(
          idOrder.id,
          order.idProduct,
          account.id,
          order.amount
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
  let listProduct = await shopCartService.getAll();
  const newProduct = [];
  let products = ``;
  for (let prd of listProduct) {
    let product = await productService.getProduct(prd.idProduct);
    newProduct.push({ ...product, ...prd });
    products += `   
    <tr>
    <td><input type='checkbox' data-id=${prd.key} style="display:inline"/></td>
    <td>${prd.idProduct}</td>
    <td class="text-truncate">${product?.name}</td>
    <td class="text-truncate"><img
    src="${product?.image}" 
    style='width:60px; height:auto '
    alt="${product?.name}"/></td>
    <td class="text-truncate">${Number(product?.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
    <td class="text-truncate">${prd.amount}</td>
    <td class="text-truncate">${Number(
      product.price * prd.amount
    ).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
    <td class="text-truncate"><i class="fas fa-trash" data-id=${
      prd.id
    } style='cursor:pointer'></i></td>
  </tr>
    `;
  }

  const divProductList = document.querySelector(".list-product-added tbody");
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

  document.querySelectorAll("td > i").forEach((cb) => {
    cb.addEventListener("click", () => {
      // Kiểm tra điều kiện trước khi gọi API xóa
      renModalDelete(cb.getAttribute("data-id"));
      if (cb.getAttribute("data-id")) {
        const showModalDelete = document.getElementById("deleteDm");
        showModalDelete.checked = true;
      }
    });
  });
};

const handleProductsBuyed = async () => {
  let listProduct = await orderDetailService.query({ customer_id: account.id });
  let products = ``;
  for (let prd of listProduct) {
    let product = await productService.getProduct(prd.product_id);
    products += `   
    <tr>
      <td>${product.id}</td>
      <td class="text-truncate">${product?.name}</td>
      <td class="text-truncate"><img
      src="${product?.image}" 
      style='width:60px; height:auto '
      alt="${product?.name}"/></td>
      <td class="text-truncate">${Number(product?.price).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })}</td>
      <td class="text-truncate">${prd.quantity}</td>
      <td class="text-truncate">${Number(
        product.price * prd.quantity
      ).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
      </td>
    </tr>
    `;
  }

  const divProductList = document.querySelector(".list-product-buyed tbody");
  divProductList.innerHTML = products;
};
const renModalDelete = async (id) => {
  const newId = `m-${id}`;
  const div = document.createElement("div");
  div.classList.add(`${newId}`);
  div.innerHTML = ` 
    <input type="checkbox" id="deleteDm" class="toggle-modal"/>
    <div class="overlay"></div>
    <div class="modal-form">
      <label for="deleteDm" class="close-btn fas fa-times" title="close"></label>
      <div class="p" style="margin: 20px; font-size: 18px; text-align: center;">Bạn chắc chắn muốn xóa?</div>
      <div class="btn">
        <button type="button" id="btn-delete" style="background-color: red;">Xóa</button>
      </div>
    </div>
  `;
  document.querySelector("body").appendChild(div);
  // Xác nhận sự kiện "Xóa" (Nếu có API gọi ở đây)
  div.querySelector("#btn-delete").addEventListener("click", async () => {
    await shopCartService.remove(id);
    handleProductsAdd();
    // Gọi API xóa ở đây nếu cần
    // Sau khi hoàn thành, có thể đóng modal bằng removeModal
    document
      .querySelector("body")
      .removeChild(document.querySelector(`.${newId}`));
  });
  // Xác nhận sự kiện "Đóng Modal"
  div.querySelector("label").addEventListener("click", () => {
    document
      .querySelector("body")
      .removeChild(document.querySelector(`.${newId}`));
  });
};
