function showAlert(message, type = "info", duration = 2000) {
  const alertBox = document.getElementById("global-alert");
  const alertMessage = document.getElementById("alert-message");

  // Reset classes
  alertBox.className = `alert ${type}`;
  alertMessage.textContent = message;
  alertBox.classList.remove("hidden");

  // Auto-hide after duration
  setTimeout(() => {
    hideAlert();
  }, duration);
}

function hideAlert() {
  const alertBox = document.getElementById("global-alert");
  alertBox.classList.add("hidden");
}

const login_btn = document.querySelector("#loginBtn_A");

login_btn.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#login_emailInput").value;
  const password = document.querySelector("#login_passwordInput").value;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password) {
    showAlert("All fields are required", "error");
    return;
  }

  if (!emailRegex.test(email)) {
    showAlert("Please enter a valid email address.", "error");
    return;
  }

  if (password.length < 8) {
    showAlert("Password must be at least 8 characters long.", "error");
    return;
  }

  const url = "http://localhost:8000/api/v1/users/login";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const result = await response.json();
    const name = result.data.user.username;
    console.log(name);

    if (response.ok) {
      console.log("Server Response:", result);
      showAlert("login successful!", "success");

      sessionStorage.setItem("name", name);

      // setTimeout(() => {
      //   window.location.href = "./welcome.html";
      // }, 1500);
    } else {
      showAlert(result.message || "login failed. Please try again.", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showAlert("Something went wrong. Please check your connection.", "error");
  }
});
