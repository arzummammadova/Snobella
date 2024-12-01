document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
  
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleLogin();
      });
    }
  
    if (registerForm) {
      const passwordInput = document.getElementById("register-password");
      passwordInput?.addEventListener("input", handlePasswordStrength);
    }
  });
  
  function handleLogin() {
    const loginEmail = document.getElementById("login-email").value.trim();
    const emailError = document.getElementById("login-email-error");
  
    if (!validateEmail(loginEmail)) {
      emailError.textContent = "Invalid email format.";
      return;
    }
  
    emailError.textContent = "";
    alert("Login form submitted");
  }
  
  function handlePasswordStrength() {
    const passwordInput = document.getElementById("register-password");
    const passwordStrength = document.getElementById("password-strength");
  
    const value = passwordInput.value;
    if (!value) {
      passwordStrength.textContent = "";
      return;
    }
  
    const strength = value.length > 8 ? (/[A-Z]/.test(value) && /[0-9]/.test(value) ? "Strong" : "Medium") : "Weak";
    passwordStrength.textContent = `Strength: ${strength}`;
    passwordStrength.className = strength === "Strong" ? "text-green-500" : strength === "Medium" ? "text-yellow-500" : "text-red-500";
  }
  
  function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  