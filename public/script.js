function switchToRegister() {
  document.getElementById("loginForm").classList.remove("active");
  document.getElementById("registerForm").classList.add("active");
  document.getElementById("sidePanelTitle").textContent = "Welcome Back!";
  document.getElementById("sidePanelText").textContent =
    "To keep connected with us please login with your personal info";
  document.getElementById("sidePanelBtn").textContent = "Sign In";
}

function switchToLogin() {
  document.getElementById("registerForm").classList.remove("active");
  document.getElementById("loginForm").classList.add("active");
  document.getElementById("sidePanelTitle").textContent = "New Here?";
  document.getElementById("sidePanelText").textContent =
    "Sign up and discover a great amount of new opportunities!";
  document.getElementById("sidePanelBtn").textContent = "Sign Up";
}

function toggleForms() {
  if (document.getElementById("loginForm").classList.contains("active")) {
    switchToRegister();
  } else {
    switchToLogin();
  }
}
