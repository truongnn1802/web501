import AccountService from "./services/accountService.js";

const accountService = new AccountService();

document.addEventListener("DOMContentLoaded", () => {
  
  // sign in, sign up
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  loginForm.querySelector("button").onclick = async (e) => {
    e.preventDefault();
    const username = loginForm.querySelector('input[name="username"]').value;
    const password = loginForm.querySelector('input[name="password"]').value;
    if (username != "" && password != "") {
      const getAccounts = await accountService.query({
        username,
        password,
      });
      if (getAccounts[0]) {
        localStorage.setItem('account',JSON.stringify(getAccounts[0]))
        window.location.href = getAccounts[0].role;
      } else {
        alert("Tên đăng nhập hoặc mật khẩu không đúng");
      }
    } else {
      alert("Nhập đủ username và password");
    }
  };

  registerForm.querySelector("button").onclick = async (e) => {
    e.preventDefault();
    const username = registerForm.querySelector('input[name="username"]').value;
    const password = registerForm.querySelector('input[name="password"]').value;
    if (username != "" && password != "") {
      const getAccounts = await accountService.query({
        role: "user",
        username,
      });
      if (getAccounts.length > 0) {
        alert("Tài khoản đã tồn tại");
        return;
      }
      accountService.insert(username, password);
      registerForm.querySelector('input[name="username"]').value = "";
      password = registerForm.querySelector('input[name="password"]').value =
        "";
    } else {
      alert("Nhập đủ username và password");
    }
  };
});
