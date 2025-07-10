const pwShowHide = document.querySelectorAll(".eye-icon");

pwShowHide.forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", () => {
    let pwFields =
      eyeIcon.parentElement.parentElement.querySelectorAll(".password");

    pwFields.forEach((password) => {
      if (password.type === "password") {
        password.type = "text";
        eyeIcon.classList.replace("fa-eye", "fa-eye-slash");
        return;
      }
      password.type = "password";
      eyeIcon.classList.replace("fa-eye-slash", "fa-eye");
    });
  });
});

const API_BASE = "/api/v1/users";

// REGISTER
const registerHandler = async (e) => {
  e.preventDefault();
  const username = document.getElementById("signUp_usernameInput").value.trim();
  const email = document.getElementById("signUp_emailInput").value.trim();
  const password = document.getElementById("signUp_passwordInput").value;
  const confirm = document.getElementById("signUp_confPasswordInput").value;

  if (password !== confirm) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    if (data.success) {
      alert("Registration successful. Redirecting to login...");
      window.location.href = "login.html";
    }
  } catch (err) {
    alert(err.message);
    console.error("Registration error:", err);
  }
};

// LOGIN
const loginHandler = async (e) => {
  e.preventDefault();
  const email = document.getElementById("login_emailInput").value.trim();
  const password = document.getElementById("login_passwordInput").value;

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (data.success) {
      // Store tokens and user data
      localStorage.setItem("accessToken", data.message.accessToken);
      localStorage.setItem("refreshToken", data.message.refreshToken);

      // Check if user data exists before storing
      if (data.message.user) {
        localStorage.setItem("username", data.message.user.username);
      }

      window.location.href = "welcome.html";
    } else {
      throw new Error(data.message || "Invalid credentials");
    }
  } catch (err) {
    alert(err.message);
    console.error("Login error:", err);
  }
};

// LOGOUT
const logoutHandler = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`${API_BASE}/logout`, {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Logout failed");
    }

    if (data.success) {
      // Clear all stored data
      localStorage.removeItem("username");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "index.html";
    }
  } catch (err) {
    alert(err.message);
    console.error("Logout error:", err);
  }
};

// DOM event bindings
document.addEventListener("DOMContentLoaded", () => {
  // Register form
  const signUpForm = document.querySelector(".signup form");
  if (signUpForm) {
    signUpForm.addEventListener("submit", registerHandler);
  }

  // Login form
  const loginForm = document.querySelector(".login form");
  if (loginForm) {
    loginForm.addEventListener("submit", loginHandler);
  }

  // Logout button
  const signOutBtn = document.getElementById("signoutBtn");
  if (signOutBtn) {
    signOutBtn.addEventListener("click", logoutHandler);
  }

  // Auto insert username on welcome page
  const welcomeEl = document.querySelector(".welcome-title");
  if (welcomeEl) {
    const username = localStorage.getItem("username") || "User";
    welcomeEl.textContent = `Welcome, ${username}`;
  }
});
