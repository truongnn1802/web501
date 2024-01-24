document.addEventListener("DOMContentLoaded", (event) => {
  let inputSearch = document.getElementById("input-search");
  let searchHistory = document.getElementById("search__history");

  inputSearch.addEventListener("focusin", () => {
    searchHistory.style.visibility = "visible";
    searchHistory.style.opacity = 1;
  });
  inputSearch.addEventListener("focusout", () => {
    searchHistory.style.visibility = "hidden";
    searchHistory.style.opacity = 0;
  });
});

const navBar = document.querySelector("nav");
let rootStyle = document.documentElement.style;

export const toggleNav = () => {
  if (navBar.classList.contains("nav-min")) {
    openNav();
  } else {
    closeNav();
  }
};

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
// convert data of Json server to Array
export const convertDbToList = (data) => {
  const arr = [];
  for (let property in data) {
    arr.push({ key: property, ...data[property] });
  }
  return arr;
};

// Toast
export function showToast(content) {
  const div = document.createElement("div");
  div.setAttribute("id", "myToast");
  div.setAttribute("class", "toast");
  div.innerHTML = content;
  document.querySelector("body").append(div);
  var toast = document.getElementById("myToast");
  // Hiển thị toast
  toast.style.display = "block";
  // Ẩn toast sau 3 giây (3000 milliseconds)
  setTimeout(function () {
    toast.style.display = "none";
  }, 3000);
}
