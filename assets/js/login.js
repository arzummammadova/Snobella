document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const notAccountLink = document.getElementById("not-account");
    const alreadyHaveAccountLink = document.getElementById("already-have-account");
    
    notAccountLink.addEventListener("click", (e) => {
        e.preventDefault();
        toggleForms("register");
    });

    alreadyHaveAccountLink.addEventListener("click", (e) => {
        e.preventDefault();
        toggleForms("login");
    });

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            handleLogin();
        });
    }

    if (registerForm) {
        const passwordInput = document.getElementById("register-password");
        const confirmPasswordInput = document.getElementById("confirm-password");
        passwordInput?.addEventListener("input", handlePasswordStrength);
        confirmPasswordInput?.addEventListener("input", checkPasswordMatch);

        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            handleRegister();
        });
    }

    function toggleForms(formType) {
        const loginForm = document.getElementById("login-form");
        const registerForm = document.getElementById("register-form");
        const formTitle = document.getElementById("form-title");
        const formDescription = document.getElementById("form-description");
        const notAccountLink = document.getElementById("not-account");
        const alreadyHaveAccountLink = document.getElementById("already-have-account");

        if (formType === "register") {
            loginForm.classList.add("hidden");
            registerForm.classList.remove("hidden");
            formTitle.textContent = "Create Account";
            formDescription.textContent = "Please fill in the form to create an account.";
            notAccountLink.classList.add("hidden");
            alreadyHaveAccountLink.classList.remove("hidden");
        } else {
            registerForm.classList.add("hidden");
            loginForm.classList.remove("hidden");
            formTitle.textContent = "Login";
            formDescription.textContent = "Please enter your details to login.";
            alreadyHaveAccountLink.classList.add("hidden");
            notAccountLink.classList.remove("hidden");
        }
    }

    function handleLogin() {
        const loginEmail = document.getElementById("login-email").value.trim();
        const loginPassword = document.getElementById("login-password").value.trim();
        const emailError = document.getElementById("login-email-error");

        if (!validateEmail(loginEmail)) {
            emailError.textContent = "Invalid email format.";
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || {};

        if (!users[loginEmail]) {
            emailError.textContent = "Email not registered.";
            alert("This email is not registered. Redirecting to the register page...");
            setTimeout(() => {
                toggleForms("register");
            }, 2000);
            return;
        }

        if (users[loginEmail] !== loginPassword) {
            emailError.textContent = "Incorrect email or password.";
        } else {
            alert("Login successful!");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);
        }
    }

    function handleRegister() {
        const email = document.getElementById("register-email").value.trim();
        const password = document.getElementById("register-password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();
        const emailError = document.getElementById("register-email-error");

        if (!validateEmail(email)) {
            emailError.textContent = "Invalid email format.";
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || {};

        if (users[email]) {
            alert("This email is already registered. Redirecting to login...");
            setTimeout(() => {
                toggleForms("login");
            }, 2000);
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        users[email] = password;
        localStorage.setItem("users", JSON.stringify(users));

        alert("Account created successfully!");
        setTimeout(() => {
            toggleForms("login");
        }, 2000);
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

    function checkPasswordMatch() {
        const password = document.getElementById("register-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;
        const matchMessage = document.getElementById("password-match");

        if (password && confirmPassword) {
            matchMessage.textContent = password === confirmPassword ? "Passwords match" : "Passwords do not match";
            matchMessage.className = password === confirmPassword ? "text-green-500" : "text-red-500";
        } else {
            matchMessage.textContent = "";
        }
    }

    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }
});
