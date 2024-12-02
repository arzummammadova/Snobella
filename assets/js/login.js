document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const notAccountLink = document.getElementById("not-account");
    const alreadyHaveAccountLink = document.getElementById("already-have-account");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            handleLogin();
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            handleRegister();
        });
    }

    if (notAccountLink) {
        notAccountLink.addEventListener("click", () => {
            loginForm.classList.add("hidden");
            registerForm.classList.remove("hidden");
            notAccountLink.classList.add("hidden");
            alreadyHaveAccountLink.classList.remove("hidden");
        });
    }

    if (alreadyHaveAccountLink) {
        alreadyHaveAccountLink.addEventListener("click", () => {
            registerForm.classList.add("hidden");
            loginForm.classList.remove("hidden");
            alreadyHaveAccountLink.classList.add("hidden");
            notAccountLink.classList.remove("hidden");
        });
    }

    function handleLogin() {
        const loginEmail = document.getElementById("login-email").value.trim();
        const loginPassword = document.getElementById("login-password").value.trim();
        const emailError = document.getElementById("login-email-error");

        if (!validateEmail(loginEmail)) {
            emailError.textContent = "Invalid email format.";
            return;
        }

        fetch(`http://localhost:3000/users?email=${loginEmail}`)
            .then(response => response.json())
            .then(users => {
                if (users.length === 0) {
                    emailError.textContent = "Email not registered.";
                    var toast = new Toasty();
                    toast.error("This email is not registered. Redirecting to the register page...");
               
                    // setTimeout(() => {
                    //     window.location.href = "register.html";
                    // }, 2000);
                    return;
                }

                const user = users[0];
                if (user.password !== loginPassword) {
                    emailError.textContent = "Incorrect email or password.";
                } else {
                    localStorage.setItem("loggedInUser", JSON.stringify(user));
                   
                    var toast = new Toasty();
                    toast.info("Login successful!");
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 2000);
                }
            });
    }

    function handleRegister() {
        const registerEmail = document.getElementById("register-email").value.trim();
        const registerPassword = document.getElementById("register-password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();
        const emailError = document.getElementById("register-email-error");
        const passwordMatch = document.getElementById("password-match");

        if (!validateEmail(registerEmail)) {
            emailError.textContent = "Invalid email format.";
            return;
        }

        if (registerPassword !== confirmPassword) {
            passwordMatch.textContent = "Passwords do not match.";
            return;
        }

        fetch(`http://localhost:3000/users?email=${registerEmail}`)
            .then(response => response.json())
            .then(users => {
                if (users.length > 0) {
                    emailError.textContent = "Email already registered.";
                    return;
                }

                const newUser = {
                    email: registerEmail,
                    password: registerPassword,
                    username: registerEmail.split('@')[0] // or another method to get a username
                };

                fetch("http://localhost:3000/users", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newUser)
                })
                .then(response => response.json())
                .then(data => {
                    var toast = new Toasty();
                    toast.info("Registration successful!");
                 
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 2000);
                });
            });
    }

    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }
});
