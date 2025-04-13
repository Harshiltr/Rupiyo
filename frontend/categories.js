document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');

    // State
    let isEditing = false;
    let editingCard = null;

    // Elements
    const loginContainer = document.getElementById('loginContainer');
    const mainContent = document.getElementById('mainContent');
    const userIcon = document.getElementById('userIcon');
    const userName = document.getElementById('userName');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const navbarNav = document.getElementById('navbarNav');
    const profileDropdown = document.getElementById('profileDropdown');
    const editProfileModal = document.getElementById('editProfileModal');
    const categoryModal = document.getElementById('categoryModal');
    const categoryForm = document.getElementById('categoryForm');
    const modalTitle = document.getElementById('modalTitle');
    const categoryNameInput = document.getElementById('categoryName');
    const categorySelect = document.getElementById('categorySelect');
    const categoryIcon = document.getElementById('categoryIcon');
    const categoryColor = document.getElementById('categoryColor');
    const categoryCurrency = document.getElementById('categoryCurrency');
    const categoryBudget = document.getElementById('categoryBudget');
    const budgetValue = document.getElementById('budgetValue');
    const categoryGrid = document.getElementById('categoryGrid');

    // Initialize session
    function initSession() {
        console.log('Initializing session');
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            loginContainer.classList.remove('active');
            mainContent.style.display = 'block';
            userName.textContent = user.name;
            profileName.textContent = user.name;
            profileEmail.textContent = user.email;
            userIcon.className = `fas ${user.icon}`;
        } else {
            loginContainer.classList.add('active');
            mainContent.style.display = 'none';
            userIcon.className = 'fas fa-user';
            userName.textContent = 'Guest';
            profileName.textContent = 'Guest';
            profileEmail.textContent = 'guest@example.com';
        }
    }

    // Login
    document.getElementById('loginBtn').addEventListener('click', () => {
        console.log('Login button clicked');
        const name = document.getElementById('loginName').value;
        const email = document.getElementById('loginEmail').value;
        const icon = document.getElementById('loginIcon').value;
        if (name && email && icon) {
            localStorage.setItem('user', JSON.stringify({ name, email, icon }));
            initSession();
        } else {
            alert('Please fill all fields.');
        }
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        console.log('Logout button clicked');
        localStorage.removeItem('user');
        initSession();
    });

    // Toggle profile dropdown
    document.getElementById('userProfile').addEventListener('click', () => {
        console.log('User profile clicked');
        profileDropdown.classList.toggle('active');
    });

    // Edit profile
    document.getElementById('editProfileBtn').addEventListener('click', () => {
        console.log('Edit profile button clicked');
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            document.getElementById('editName').value = user.name;
            document.getElementById('editEmail').value = user.email;
            document.getElementById('editIcon').value = user.icon;
        }
        editProfileModal.style.display = 'flex';
        profileDropdown.classList.remove('active');
    });

    document.getElementById('cancelProfileBtn').addEventListener('click', () => {
        console.log('Cancel profile button clicked');
        editProfileModal.style.display = 'none';
    });

    document.getElementById('editProfileForm').addEventListener('submit', (e) => {
        console.log('Edit profile form submitted');
        e.preventDefault();
        const name = document.getElementById('editName').value;
        const email = document.getElementById('editEmail').value;
        const icon = document.getElementById('editIcon').value;
        if (name && email && icon) {
            localStorage.setItem('user', JSON.stringify({ name, email, icon }));
            initSession();
            editProfileModal.style.display = 'none';
        } else {
            alert('Please fill all fields.');
        }
    });

    // Toggle navbar
    document.getElementById('navbarToggler').addEventListener('click', () => {
        console.log('Navbar toggler clicked');
        navbarNav.classList.toggle('active');
    });

    // Budget slider
    function updateBudgetDisplay() {
        console.log('Updating budget display');
        const currency = categoryCurrency.value.split('|')[1] || '$';
        budgetValue.textContent = `${currency}${categoryBudget.value}`;
    }
    categoryBudget.addEventListener('input', updateBudgetDisplay);
    categoryCurrency.addEventListener('change', updateBudgetDisplay);

    // Update category from dropdown
    categorySelect.addEventListener('change', () => {
        console.log('Category select changed');
        if (categorySelect.value) {
            const [name, icon, color] = categorySelect.value.split('|');
            categoryNameInput.value = name;
            categoryIcon.value = icon;
            categoryColor.value = color;
        }
    });

    // Open category modal
    document.getElementById('addCategoryBtn').addEventListener('click', () => {
        console.log('Add category button clicked');
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('Please log in to add categories.');
            return;
        }
        categoryModal.style.display = 'flex';
        modalTitle.textContent = 'Add New Category';
        categoryForm.reset();
        categorySelect.value = '';
        categoryColor.value = '#ff6b6b';
        categoryCurrency.value = 'USD|$';
        budgetValue.textContent = '$0';
        categoryBudget.value = 0;
        isEditing = false;
        editingCard = null;
    });

    // Close category modal
    document.getElementById('cancelCategoryBtn').addEventListener('click', () => {
        console.log('Cancel category button clicked');
        categoryModal.style.display = 'none';
    });

    // Edit category
    categoryGrid.addEventListener('click', (e) => {
        if (e.target.closest('.edit-category')) {
            console.log('Edit category button clicked');
            const card = e.target.closest('.category-card');
            isEditing = true;
            editingCard = card;
            const { name, icon, color, budget, currency } = card.dataset;
            modalTitle.textContent = 'Edit Category';
            categoryNameInput.value = name;
            categoryIcon.value = icon;
            categoryColor.value = color;
            categoryCurrency.value = currency;
            categoryBudget.value = budget;
            budgetValue.textContent = `${currency.split('|')[1]}${budget}`;
            categoryModal.style.display = 'flex';
        }
    });

    // Delete category
    categoryGrid.addEventListener('click', (e) => {
        if (e.target.closest('.delete-category')) {
            console.log('Delete category button clicked');
            if (confirm('Are you sure you want to delete this category?')) {
                e.target.closest('.category-card').remove();
            }
        }
    });

    // Save category
    document.getElementById('saveCategoryBtn').addEventListener('click', () => {
        console.log('Save category button clicked');

        const name = categoryNameInput.value.trim();
        const icon = categoryIcon.value || 'fa-question';
        const color = categoryColor.value || '#ff6b6b';
        const currency = categoryCurrency.value || 'USD|$';
        const budget = categoryBudget.value || 0;

        console.log('Captured inputs:', { name, icon, color, currency, budget });

        if (!name) {
            console.log('Validation failed: No category name');
            alert('Please enter a category name.');
            return;
        }

        try {
            const currencySymbol = currency.split('|')[1];

            if (isEditing && editingCard) {
                console.log('Updating existing category');
                editingCard.querySelector('i').className = `fas ${icon}`;
                editingCard.querySelector('i').style.color = color;
                editingCard.querySelector('h3').textContent = name;
                editingCard.querySelector('.budget').textContent = `Budget: ${currencySymbol}${budget}`;
                editingCard.querySelector('.amount').textContent = `Spent: ${currencySymbol}0`;
                editingCard.style.borderLeft = `5px solid ${color}`;
                editingCard.dataset.name = name;
                editingCard.dataset.icon = icon;
                editingCard.dataset.color = color;
                editingCard.dataset.budget = budget;
                editingCard.dataset.currency = currency;
            } else {
                console.log('Creating new category');
                const card = document.createElement('div');
                card.className = 'category-card';
                card.style.borderLeft = `5px solid ${color}`;
                card.dataset.name = name;
                card.dataset.icon = icon;
                card.dataset.color = color;
                card.dataset.budget = budget;
                card.dataset.currency = currency;
                card.innerHTML = `
                    <i class="fas ${icon}" style="color: ${color};"></i>
                    <h3>${name}</h3>
                    <p class="budget">Budget: ${currencySymbol}${budget}</p>
                    <p class="amount">Spent: ${currencySymbol}0</p>
                    <div class="actions">
                        <button class="edit-category"><i class="fas fa-edit"></i></button>
                        <button class="delete-category"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                categoryGrid.appendChild(card);
                console.log('New category card added');
            }

            console.log('Resetting form and closing modal');
            categoryForm.reset();
            categoryModal.style.display = 'none';
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Failed to save category. Please try again.');
        }
    });

    // Close modals on outside click
    window.addEventListener('click', (e) => {
        console.log('Window clicked');
        if (e.target === categoryModal) {
            categoryModal.style.display = 'none';
        }
        if (e.target === editProfileModal) {
            editProfileModal.style.display = 'none';
        }
        if (!e.target.closest('.user-profile') && profileDropdown.classList.contains('active')) {
            profileDropdown.classList.remove('active');
        }
    });

    // Initialize
    initSession();
});