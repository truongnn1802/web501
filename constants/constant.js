export const baseUrl = 'http://localhost:3000'

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
      document
        .querySelector("body")
        .removeChild(document.querySelector(`#myToast`));
    }, 3000);
  }

 