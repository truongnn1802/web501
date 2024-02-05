import CategoryService from "../services/categoryService.js";
import ProductServices from "../services/productService.js";
import { convertDbToList, toggleNav } from "../app.js";

const categoryService = new CategoryService();
const productService = new ProductServices();
let idCate = null;

const handleGetAllCate = async () => {
  const listCateTag = document.getElementById("list-cate");
  const getAllCate = await categoryService.getAll();
  const listCate = convertDbToList(getAllCate);
  let list = ``;
  for (let category of listCate) {
    list += `
    <button class="accordion" data-id=${category.id}>
    ${category.name}
    <i class="fas fa-trash" data-id=${category.id}></i>
    <i class="fas fa-plus" style="margin-right: 10px;" data-id=${category.id}></i>
  </button>
  <div class="accordion-content" data-id=${category.id}>
    <div class="table-responsive">
        <table class="table">
          <thead class="table-light">
            <tr>
              <th class="text-truncate">Mã sản phẩm</th>
              <th class="text-truncate">Tên sản phẩm</th>
              <th class="text-truncate">Hình ảnh</th>
              <th class="text-truncate">Mô tả sản phẩm</th>
              <th class="text-truncate">Giá sản phẩm</th>
              <th class="text-truncate">Số lượng</th>
              <th class="text-truncate">Đã bán</th>
              <th class="text-truncate"></th>
            </tr>
          </thead>
          <tbody>
          </tbody>
          </table>
        </div>
  </div>
    `;
  }
  listCateTag.innerHTML = list;
  const accordionBtns = document.querySelectorAll(".accordion");
  accordionBtns.forEach((accordion) => {
    const btnAdd = accordion?.children.item(1);
    const btnDelete = accordion?.children.item(0);
    // Thêm mới sản phẩm
    btnAdd.onclick = (e) => {
      renModalAddProduct()
      idCate = btnAdd.getAttribute("data-id");
      e.stopPropagation();
      let srcImg = null;
      const showModal = document.querySelector("#show");
      showModal.checked = true;
      // Modal sản phẩm
      const fileUpload = document.querySelector("#upload-img");
      const preview = document.getElementById("preview");
      fileUpload.addEventListener("change", async (event) => {
        const input = event.target;
        if (input.files && input.files[0]) {
          const reader = new FileReader();
          reader.onload = function (e) {
            // Tạo một thẻ <img> để hiển thị ảnh
            const image = document.createElement("img");
            srcImg = e.target.result;
            image.src = srcImg;
            image.style.width = "100px"; // Đặt kích thước ảnh theo ý muốn

            // Xóa nội dung cũ và thêm ảnh mới vào div
            preview.innerHTML = "";
            preview.appendChild(image);
          };

          // Đọc dữ liệu từ tệp tin hình ảnh
          reader.readAsDataURL(input.files[0]);
        }
      });

      const btnAddProduct = document.getElementById("btn-add-product");
      // click button thêm mới
      btnAddProduct.addEventListener("click", async (e) => {
        e.preventDefault();
        const nameProduct = document.querySelector("#name-product");
        const descProduct = document.querySelector("#desc-product");
        const priceProduct = document.querySelector("#price-product");
        const quanProduct = document.querySelector("#quantity-product");
        // if (nameCate.value != "") {
        const data = await productService.insertProduct(
          nameProduct.value,
          idCate,
          Number(priceProduct.value),
          descProduct.value,
          srcImg,
          Number(quanProduct.value)
        );

        nameProduct.value = "";
        (priceProduct.value = ""),
          (descProduct.value = ""),
          (quanProduct.value = "");
        srcImg = null;
        preview.innerHTML = "";
        renderProduct(idCate);
      });
      const close = document.querySelector("#show ~ .modal-form > .close-btn");
      close.addEventListener("click", () => {
        if (preview.querySelector("img"))
          preview.removeChild(preview.querySelector("img"));
      });
    };
    // Show, Hide sản phẩm
    accordion.onclick = function (e) {
      const dataId = e.target.getAttribute("data-id");
      idCate = dataId;
      renderProduct(dataId);
      this.classList.toggle("is-open");
      let content = this.nextElementSibling;
      if (content.style.maxHeight) {
        //this is if the accordion is open
        content.style.maxHeight = null;
      } else {
        //if the accordion is currently closed
        content.style.maxHeight = 500 + "px";
        content.setAttribute("style", "overflow:auto;max-height:500px");
      }
    };
    // Xóa danh mục
    const handleDelete = async (e) => {
      e.stopPropagation();
      const categoryId = e.target.getAttribute("data-id");
      renModalDelete(categoryId, "dm");

      // Kiểm tra điều kiện trước khi gọi API xóa
      if (categoryId) {
        const showModalDelete = document.getElementById("deleteDm");
        showModalDelete.checked = true;
      }
    };
    // Gắn sự kiện click
    btnDelete.addEventListener("click", handleDelete);
  });
};

handleGetAllCate();

const toggleNavBtn = document.getElementById("toggle-nav-btn");
toggleNavBtn.addEventListener("click", () => {
  toggleNav();
});

const showFormDm = document.getElementById("addDm");

// Modal danh mục
const showModal = document.querySelector("#showDm");
showFormDm.addEventListener("click", async () => {
  showModal.checked = true;
  const btnAddCate = document.getElementById("btn-add-cate");
  btnAddCate.addEventListener("click", async (e) => {
    e.preventDefault();
    const nameCate = document.getElementById("name-cate");
    if (nameCate.value != "") {
      await categoryService.insert(nameCate.value);
      nameCate.value = "";
      handleGetAllCate();
    }
  });
});

const renModalDelete = (id, type) => {
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
    if (type == "dm") {
      const listProductCate = await productService.getProductQuery({
        cate_id: id,
      });
      await listProductCate.forEach((product) => {
        productService.removeProduct(product.id);
      });
      await categoryService.remove(id);
      handleGetAllCate();
    }
    await productService.removeProduct(id);
    renderProduct(idCate);
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

const renModalAddProduct = (id, type) => {
  const newId = `m-${id}`;
  const div = document.createElement("div");
  div.classList.add(`${newId}`);
  div.innerHTML = ` 
  <input type="checkbox" id="show" class="toggle-modal" />
  <div class="overlay"></div>
  <div class="modal-form">
    <label for="show" class="close-btn fas fa-times" title="close"></label>
    <div class="text">Thêm sản phẩm mới</div>
    <form action="#">
      <div class="data">
        <label>Tên sản phẩm</label>
        <input type="text" id="name-product" />
      </div>
      <div class="data">
        <label>Mô tả sản phẩm</label>
        <input type="text" id="desc-product" />
      </div>
      <div
        class="data"
        style="display: inline-block; width: 45%; margin: 0 30px 0 0"
      >
        <label>Giá sản phẩm</label>
        <input type="number" id="price-product" />
      </div>
      <div
        class="data"
        style="display: inline-block; width: 45%; margin: 0"
      >
        <span>Số lượng</span>
        <input type="number" id="quantity-product" />
      </div>
      <div class="data" style="margin-top: 16px">
        <label
          for="upload-img"
          style="
            cursor: pointer;
            text-decoration: underline;
            color: var(--primary-color);
            display: block;
          "
          >Tải hình ảnh sản phẩm</label
        >
        <span id="preview"></span>
        <input
          type="file"
          id="upload-img"
          accept="image/*"
          style="opacity: 0; visibility: hidden; height: 0"
        />
      </div>
      <div class="btn">
        <button type="submit" id="btn-add-product">Thêm mới</button>
      </div>
    </form>
  </div>
  `;
  document.querySelector("body").appendChild(div);
  // Xác nhận sự kiện "Đóng Modal"
  div.querySelector("label").addEventListener("click", () => {
    document
      .querySelector("body")
      .removeChild(document.querySelector(`.${newId}`));
  });
};

const renderProduct = async function (dataId) {
  const listProductCate = await productService.getProductQuery({
    cate_id: dataId,
  });
  if (!listProductCate) {
    return;
  }
  // render sản phẩm
  const divAccordionContent = document.querySelector(
    `.accordion-content[data-id='${dataId}'] tbody`
  );
  let htmlProducts = ``;
  for (let product of listProductCate) {
    htmlProducts += ` 
            <tr>
              <td>${product.id}</td>
              <td>${product.name}</td>
              <td>
              <img
                src="${product.image}" 
                style='width:60px; height:auto'
                alt="${product.name}"/>
              </td>
              <td>${product.desc}</td>
              <td>${Number(product.price).toLocaleString()} VNĐ</td>
              <td>${product.quantity}</td>
              <td>${product.selled}</td>
              <td >
                <i class="fas fa-trash" data-id=${product.id}
                 style="cursor:pointer"></i>
              </td>
            </tr>`;
  }
  divAccordionContent.innerHTML = htmlProducts;
  document.querySelectorAll("td i").forEach((icon) => {
    icon.addEventListener("click", (e) => {
      const productId = e.target.getAttribute("data-id");
      renModalDelete(productId, "prd");

      // Kiểm tra điều kiện trước khi gọi API xóa
      if (productId) {
        const showModalDelete = document.getElementById("deleteDm");
        showModalDelete.checked = true;
      }
    });
  });
};
