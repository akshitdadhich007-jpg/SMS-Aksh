(function(){
  const form = document.getElementById('loginForm');
  const btn = document.getElementById('loginBtn');
  const alertBox = document.getElementById('alert');
  const toggle = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  function showAlert(message, type = 'error'){
    alertBox.style.display = 'block';
    alertBox.className = 'alert ' + (type === 'error' ? 'alert-error' : 'alert-info');
    alertBox.textContent = message;
  }

  function clearAlert(){
    alertBox.style.display = 'none';
    alertBox.textContent = '';
  }

  toggle.addEventListener('click', function(e){
    e.preventDefault();
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    toggle.classList.toggle('active');
  });

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    clearAlert();
    btn.disabled = true;

    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value;

    try{
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        showAlert(data.message || 'Login failed');
        btn.disabled = false;
        return;
      }

      // Redirect based on role
      if (data.role === 'admin') window.location.href = '/admin.html';
      else window.location.href = '/resident.html';

    } catch(err){
      showAlert('Network error. Try again.');
      btn.disabled = false;
    }
  });
})();