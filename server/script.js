document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission

    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;

    try {
        const response = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, gender })
        });

        if (response.ok) {
            alert('Sign up successful! Redirecting to login page...');
            window.location.href = 'login.html'; // Redirect to the login page
        } else {
            const errorMessage = await response.text();
            alert('Error: ' + errorMessage);
        }
    } catch (err) {
        console.error('Error:', err);
        alert('An error occurred during sign-up.');
    }
});
