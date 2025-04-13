const container = document.querySelector('.container');
const starsContainer = document.querySelector('.stars');
const showSignupBtn = document.getElementById('show-signup');
const showLoginBtn = document.getElementById('show-login');
const loginForm = document.getElementById('auth-login-form');
const signupForm = document.getElementById('auth-signup-form');
const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');
const loginEmailError = document.getElementById('login-email-error');
const loginPasswordError = document.getElementById('login-password-error');
const signupNameError = document.getElementById('signup-name-error');
const signupEmailError = document.getElementById('signup-email-error');
const signupPasswordError = document.getElementById('signup-password-error');

function createStar() {
  const star = document.createElement('span');
  star.classList.add('star');
  const size = Math.random() * 4 + 2;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  const spread = Math.random() * 40;
  star.style.setProperty('--spread', `${spread}%`);
  const baseOffset = Math.random() * 10;
  star.style.setProperty('--base-offset', `${baseOffset}%`);
  star.style.setProperty('--drift', Math.random() * 2 - 1);
  starsContainer.appendChild(star);
  setTimeout(() => star.remove(), 800);
}

function clearErrors() {
  loginError.textContent = '';
  signupError.textContent = '';
  loginEmailError.textContent = '';
  loginPasswordError.textContent = '';
  signupNameError.textContent = '';
  signupEmailError.textContent = '';
  signupPasswordError.textContent = '';
}

function showSignup() {
  container.classList.add('transition');
  container.classList.remove('login-active');
  container.classList.add('signup-active');
  for (let i = 0; i < 15; i++) {
    setTimeout(createStar, i * 50);
  }
  setTimeout(() => container.classList.remove('transition'), 800);
}

function showLogin() {
  container.classList.add('transition');
  container.classList.remove('signup-active');
  container.classList.add('login-active');
  for (let i = 0; i < 15; i++) {
    setTimeout(createStar, i * 50);
  }
  setTimeout(() => container.classList.remove('transition'), 800);
}

container.classList.add('login-active');

showSignupBtn.addEventListener('click', () => {
  clearErrors();
  showSignup();
});

showLoginBtn.addEventListener('click', () => {
  clearErrors();
  showLogin();
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  return password.length >= 8;
}

function validateSignupPassword(password) {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
}

function validateName(name) {
  const re = /^[A-Za-z\s]{2,50}$/;
  return re.test(name);
}

async function checkUser(email) {
  try {
    const response = await fetch('http://localhost:8000/api/auth/check-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Error checking user');
    return data.exists;
  } catch (error) {
    console.error('Error checking user:', error);
    loginError.textContent = 'Server error. Please try again.';
    return false;
  }
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  let isValid = true;
  if (!validateEmail(email)) {
    loginEmailError.textContent = 'Please enter a valid email address.';
    isValid = false;
  }
  if (!validatePassword(password)) {
    loginPasswordError.textContent = 'Password must be at least 8 characters long.';
    isValid = false;
  }
  if (!isValid) return;

  const userExists = await checkUser(email);
  if (!userExists) {
    loginError.textContent = 'User not registered.';
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('userName', email.split('@')[0]);
      loginForm.reset();
      window.location.href = 'index.html';
    } else {
      loginError.textContent = data.detail || 'Invalid credentials.';
    }
  } catch (error) {
    console.error('Error:', error);
    loginError.textContent = 'Server error. Please try again.';
  }
});

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;

  let isValid = true;
  if (!validateName(name)) {
    signupNameError.textContent = 'Name must be 2–50 characters, letters and spaces only.';
    isValid = false;
  }
  if (!validateEmail(email)) {
    signupEmailError.textContent = 'Please enter a valid email address.';
    isValid = false;
  }
  if (!validateSignupPassword(password)) {
    signupPasswordError.textContent = 'Password must be at least 8 characters, with uppercase, lowercase, number, and special character.';
    isValid = false;
  }
  if (!isValid) return;

  try {
    const response = await fetch('http://localhost:8000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('userName', name);
      signupForm.reset();
      signupError.textContent = 'Signup successful! Please login.';
      showLogin();
    } else {
      signupError.textContent = data.detail || 'Signup failed.';
    }
  } catch (error) {
    console.error('Signup error:', error.message);
    signupError.textContent = 'Unable to connect to server. Please try again.';
  }
});