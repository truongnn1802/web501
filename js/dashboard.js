const navBar = document.querySelector("nav");
const toggleNavBtn = document.getElementById("toggle-nav-btn");
let rootStyle = document.documentElement.style;

async function a(){
  const r = await fetch('https://learn-firebase-aa896-default-rtdb.asia-southeast1.firebasedatabase.app/products.json');
  return await r.json()
}
toggleNavBtn.addEventListener("click", (event) => {
  toggleNav();
});

function toggleNav() {
  if (navBar.classList.contains("nav-min")) {
    openNav();
  } else {
    closeNav();
  }
}

const openNav = () => {
  navBar.classList.remove("nav-min");
  navBar.classList.add("nav-max");
  rootStyle.setProperty("--width-nav", "300px");
};

const closeNav = () => {
  navBar.classList.remove("nav-max");
  navBar.classList.add("nav-min");
  rootStyle.setProperty("--width-nav", "80px");
};

// // Medias
// const phone = window.matchMedia("(width <= 480px)")
// function media(e) {
//   if (e.matches) {
//     closeNav()
//   } else {
//     openNav()
//   }
// }

// phone.addListener(media)

const accordionBtns = document.querySelectorAll(".accordion");

accordionBtns.forEach((accordion) => {
  const iconAdd = accordion?.children.item(0);
  iconAdd.onclick=(e)=>{
    e.stopPropagation();
    const showModal = document.querySelector("#show");
    showModal.checked = true
  }
  accordion.onclick = function () {
    this.classList.toggle("is-open");

    let content = this.nextElementSibling;

    if (content.style.maxHeight) {
      //this is if the accordion is open
      content.style.maxHeight = null;
    } else {
      //if the accordion is currently closed
      content.style.maxHeight = content.scrollHeight + "px";
      console.log(content.style.maxHeight);
    }
  };
});
