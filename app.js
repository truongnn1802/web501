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