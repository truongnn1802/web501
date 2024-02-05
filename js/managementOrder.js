import { toggleNav } from "../app.js";
import OrderService from "../services/orderService.js";
import OrderDetailService from "../services/orderDetailService.js";
import ProductService from "../services/productService.js";

const orderService = new OrderService();
const orderDetailService = new OrderDetailService();
const productService = new ProductService();

document.addEventListener("DOMContentLoaded", () => {
  const toggleNavBtn = document.getElementById("toggle-nav-btn1");
  toggleNavBtn.addEventListener("click", () => {
    toggleNav();
  });

  handleShowManagementOrder();
  handleFilter()
});

const handleShowManagementOrder = async (data) => {
  let orderManagement = await orderService.get();
  const tbody = document.querySelector("table > tbody");
  tbody.innerHTML = "";
  if(data) orderManagement = data
  for (let order of orderManagement) {
    const row = createTableRow(order);
    tbody.appendChild(row);
  }
};

function createTableRow(order) {
  const row = document.createElement("tr");
  const createCell = (content, className) => {
    const cell = document.createElement("td");
    cell.className = className;
    cell.textContent = content;
    return cell;
  };

  row.appendChild(createCell(order.id, ""));
  row.appendChild(createCell(order.customer_name, "text-truncate"));
  row.appendChild(createCell(order.customer_address, "text-truncate"));
  row.appendChild(createCell(order.customer_phone, "text-truncate"));
  row.appendChild(createCell(order.date_order, "text-truncate"));

  const statusCell = document.createElement("td");
  const statusSpan = document.createElement("span");
  statusSpan.className =  order.status;
  statusSpan.textContent = order.status;
  statusCell.appendChild(statusSpan);
  row.appendChild(statusCell);

  const detailCell = document.createElement("td");
  const detailSpan = document.createElement("span");
  detailSpan.className = "show-detail";
  detailSpan.style = "cursor:pointer;color:var(--primary-color);padding:0 10px";
  detailSpan.textContent = "Chi tiết";
  detailSpan.addEventListener("click", () => showModal(order));

  const completeSpan = document.createElement("span");
  completeSpan.className = "show-detail";
  completeSpan.style = "cursor:pointer;color:var(--complete-color);padding:0 10px";
  completeSpan.textContent = "Hoàn thành";
  completeSpan.addEventListener("click", () => handleComplete(order.Numberid));
  detailCell.appendChild(detailSpan);
  detailCell.appendChild(completeSpan);
  row.appendChild(detailCell);

  return row;
}

function showModal(order) {
  renModalDetail(order);
  if (order.id) {
    const showModal = document.querySelector("#show");
    showModal.checked = true;
  }
}

const handleComplete = async (id) => {
  renModalComplete(id);
  if (id) {
    const showModalDelete = document.getElementById("completemd");
    showModalDelete.checked = true;
  }
};

const handleFilter = async () => {
  const divFilter = document.querySelector("#filterType");

  divFilter.onchange = async function () {
    const orders = await orderService.query({
      _sort: divFilter.value,
    });
    handleShowManagementOrder(orders)
  };
};

const renModalComplete = (id) => {
  const newId = `m-${id}`;
  const div = document.createElement("div");
  div.classList.add(`${newId}`);
  div.innerHTML = ` 
    <input type="checkbox" id="completemd" class="toggle-modal"/>
    <div class="overlay"></div>
    <div class="modal-form">
      <label for="completemd" class="close-btn fas fa-times" title="close"></label>
      <div class="p" style="margin: 20px; font-size: 18px; text-align: center;">Bạn đã giao xong đơn hàng?</div>
      <div class="btn">
        <button type="button" id="btn-complete" style="background-color: var(--complete-color);">Hoàn thành</button>
      </div>
    </div>
  `;
  document.querySelector("body").appendChild(div);

  // Xác nhận sự kiện "Xóa" (Nếu có API gọi ở đây)
  div.querySelector("#btn-complete").addEventListener("click", async () => {
    await orderService.update(id);
    handleShowManagementOrder();
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

const renModalDetail = async (order) => {
  const newId = `m-${order.id}`;
  const div = document.createElement("div");
  div.classList.add(`${newId}`);
  div.innerHTML = ` 
    <input type="checkbox" id="show" class="toggle-modal" />
    <div class="overlay"></div>
    <div class="modal-form" style="width:auto;min-width:50%">
      <label for="show" class="close-btn fas fa-times" title="close"></label>
      <h2 class="text">Chi tiết đơn hàng ${order.id}</h2>
      <div class="customer">
        <div><span>Họ và tên: </span><strong>${order.customer_name}</strong></div>
        <div><span>Địa chỉ: </span><strong>${order.customer_address}</strong></div>
        <div><span>Số điện thoại: </span><strong>${order.customer_phone}</strong></div>
      </div>
      <h4 class="mt-3" style="font-size:18px">Sản phẩm đã đặt</h4>
      <table class="order-product table">
        <thead class="table-light">
          <tr>
            <th class="text-truncate">Mã sản phẩm</th>
            <th class="text-truncate">Tên sản phẩm</th>
            <th class="text-truncate">Hình ảnh</th>
            <th class="text-truncate">Giá sản phẩm</th>
            <th class="text-truncate">Số lượng</th>
            <th class="text-truncate">Thanh toán</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
      
    </div>
  `;
  document.querySelector("body").appendChild(div);
  const orderDetail = await orderDetailService.getOrderDetails(order.id);
  let totalBill = 0;
  const cellProducts = await Promise.all(
    orderDetail.map(async (element) => {
      const product = await productService.getProduct(element.product_id);
      totalBill += Number(product.price) * Number(element.quantity);
      return `
        <tr>
          <td class="text-truncate">${product.id}</td>
          <td class="text-truncate">${product.name}</td>
          <td class="text-truncate">
            <img
              src="${product.image}"
              style="width:60px; height:auto"
              alt="${product.name}"
            />
          </td>
          <td class="text-truncate" style="text-align:center">${Number(
            product.price
          ).toLocaleString()}VND</td>
          <td class="text-truncate" style="text-align:center">${
            element.quantity
          }</td>
          <td class="text-truncate" style="text-align:right">
            <strong>${(
              Number(product.price) * Number(element.quantity)
            ).toLocaleString()}</strong>VND
          </td>
        </tr>
      `;
    })
  );

  cellProducts.push(
    `<tr>
          <td class="text-truncate">Tổng</td>
          <td class="text-truncate"></td>
          <td class="text-truncate"></td>
          <td class="text-truncate"></td>
          <td class="text-truncate"></td>
          <td class="text-truncate" style="text-align:right"><strong>${totalBill.toLocaleString()}</strong>VND</td>
        </tr>`
  );
  document.querySelector(".order-product tbody").innerHTML =
    cellProducts.join("");

  // Xác nhận sự kiện "Đóng Modal"
  div.querySelector("label").addEventListener("click", () => {
    document
      .querySelector("body")
      .removeChild(document.querySelector(`.${newId}`));
  });
};
