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

const username = document.querySelector("#username");
const name = sessionStorage.getItem("name");

username.innerHTML = `Welcome, ${name}`;

const logoutBtn = document.querySelector("#signoutBtn");

logoutBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const url = "http://localhost:8000/api/v1/users/logout";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Server Response:", result);
      showAlert("Logout successful!", "success");

      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1500);
    } else {
      showAlert(result.message || "login failed. Please try again.", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showAlert("Something went wrong. Please check your connection.", "error");
  }
});

window.addEventListener("load", async () => {
const url = "http://localhost:8000/api/v1/users/refresh-token";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Server Response:", result);

      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1500);
    } else {
      showAlert(result.message || "login failed. Please try again.", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showAlert("Something went wrong. Please check your connection.", "error");
  }

  
});
