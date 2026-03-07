const login = () => {
    const userName = document.getElementById("user-name").value;
    const password = document.getElementById("password").value;
    if (userName === "admin" && password === "admin123") {
        window.location.href = "./home.html";
    } else {
        alert("Invalid username or password");
    }
}