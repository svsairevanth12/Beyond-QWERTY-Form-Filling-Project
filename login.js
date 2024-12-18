document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    if (email === 'admin@gmail.com') {
        if (password === 'admin') {
            localStorage.setItem('userType', 'admin');
            window.location.href = 'admin-dashboard.html';
        } else {
            errorMessage.textContent = 'Invalid password';
        }
    } else if (email === 'user@gmail.com') {  // Updated email
        if (password === 'user') {
            localStorage.setItem('userType', 'user');
            window.location.href = 'user-dashboard.html';
        } else {
            errorMessage.textContent = 'Invalid password';
        }
    } else {
        errorMessage.textContent = 'Invalid email';
    }
});
