import CategoryService from "../services/categoryService.js";
import ProductServices from "../services/productService.js";
import { convertDbToList, toggleNav } from "../app.js";
import { saveFileStorage } from "../constants/FirebaseContants.js";

const categoryService = new CategoryService();
const productService = new ProductServices();
let idCate = null;

const handleGetAllCate = async () => {
  const listCateTag = document.getElementById("list-cate");
  const getAllCate = await categoryService.getAllCategory();
  const listCate = convertDbToList(getAllCate);
  let list = ``;
  for (let category of listCate) {
    list += `
    <button class="accordion" data-id=${category.key}>
    ${category.name}
    <i class="fas fa-trash" data-id=${category.key}></i>
    <i class="fas fa-plus" style="margin-right: 10px;" data-id=${category.key}></i>
  </button>
  <div class="accordion-content" data-id=${category.key}>
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
      idCate = btnAdd.getAttribute("data-id");
      e.stopPropagation();
      let urlImg = null;
      const showModal = document.querySelector("#show");
      showModal.checked = true;
      // Modal sản phẩm
      const fileUpload = document.querySelector("#upload-img");
      const preview = document.getElementById("preview");
      fileUpload.addEventListener("change", async (event) => {
        const { files } = event.target;
        urlImg = await saveFileStorage(files[0]);
        preview.src = urlImg;
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
        await productService.insertProduct(
          nameProduct.value,
          idCate,
          Number(priceProduct.value),
          descProduct.value,
          urlImg,
          Number()
        );
        nameProduct.value = "";
        (priceProduct.value = ""),
          (descProduct.value = ""),
          (quanProduct.value = "");
        (urlImg = null), (preview.src = "");
      });
      const close = document.querySelector("#show ~ .modal-form > .close-btn");
      close.addEventListener("click", () => {
        (preview.src = ""), (urlImg = null), handleGetAllCate();
      });
    };
    // Show, Hide sản phẩm
    accordion.onclick = async function (e) {
      const dataId = e.target.getAttribute("data-id");
      const listProductCate = await productService.getProductCate(dataId);
      if (!listProductCate) {
        return;
      }
      // render sản phẩm
      const divAccordionContent = document.querySelector(
        `.accordion-content[data-id=${dataId}] tbody`
      );
      let products = ``;
      for (let key in listProductCate) {
        products += ` 
            <tr>
              <td>${key}</td>
              <td>${listProductCate[key].name}</td>
              <td>
              <img
                src="${listProductCate[key].image}" 
                style='width:60px; height:auto'
                alt="${listProductCate[key].name}"/>
              </td>
              <td>${listProductCate[key].desc}</td>
              <td>${listProductCate[key].price}</td>
              <td>${listProductCate[key].quantity}</td>
              <td>${listProductCate[key].selled}</td>
              <td >
                <i class="fas fa-trash" data-id=${key}
                 style="cursor:pointer"></i>
              </td>
            </tr>`;
      }
      divAccordionContent.innerHTML = products;
      this.classList.toggle("is-open");
      document.querySelectorAll("td i").forEach((icon) => {
        icon.addEventListener("click", () => {
          const showModalDelete = document.getElementById("deleteDm");
          showModalDelete.checked = true;
          document
            .getElementById("btn-delete")
            .addEventListener("click", async () => {
              await productService.removeProduct(icon.getAttribute("data-id"));
              showModalDelete.checked = false;
              setTimeout(() => {
                location.reload();
              }, 1000);
            });
        });
      });
      let content = this.nextElementSibling;
      if (content.style.maxHeight) {
        //this is if the accordion is open
        content.style.maxHeight = null;
      } else {
        //if the accordion is currently closed
        content.style.maxHeight = content.scrollHeight + "px";
      }
    };
    // Xóa danh mục
    btnDelete.addEventListener("click", (e) => {
      e.stopPropagation();
      const showModalDelete = document.getElementById("deleteDm");
      showModalDelete.checked = true;
      document
        .getElementById("btn-delete")
        .addEventListener("click", async () => {
          await categoryService.removeCategory(
            e.target.getAttribute("data-id")
          );
          showModalDelete.checked = false;
          setTimeout(() => {
            location.reload();
          }, 1000);
        });
    });
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
      categoryService.insertCategory(nameCate.value);
      nameCate.value = "";
    }
  });
  const close = document.querySelector("#showDm ~ .modal-form > .close-btn");
  close.addEventListener("click", handleGetAllCate);
});
