document.addEventListener("DOMContentLoaded", (event) => {
    let inputSearch = document.getElementById('input-search');
    let searchHistory = document.getElementById('search__history')

    inputSearch.addEventListener("focusin", ()=>{
        searchHistory.style.visibility = 'visible'
        searchHistory.style.opacity = 1
    })
    inputSearch.addEventListener("focusout", ()=>{
        searchHistory.style.visibility = 'hidden'
        searchHistory.style.opacity = 0
    })
});
// Modal

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