const menuIcon = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon');
const sidebar = document.querySelector('.sidebar');
const navbar = document.querySelector('.navbar');
const userName = document.querySelector('#user-name');

// Display username from localStorage
if (localStorage.getItem('userName')) {
  userName.textContent = localStorage.getItem('userName');
}

menuIcon.addEventListener('click', () => {
  sidebar.classList.add('active');
  navbar.style.display = 'none';
});

closeIcon.addEventListener('click', () => {
  sidebar.classList.remove('active');
  navbar.style.display = 'flex';
});