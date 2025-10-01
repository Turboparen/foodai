// Food AI Application JavaScript

// Global state
let currentDate = new Date();
let selectedDate = null;
let menuData = {};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupCalendar();
    setupProfile();
    loadUserData();
    
    // Show home page by default
    showPage('home');
}

// Navigation functionality
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            showPage(page);
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Initialize page-specific functionality
        if (pageId === 'menu') {
            renderCalendar();
        }
    }
}

// Calendar functionality
function setupCalendar() {
    const prevButton = document.getElementById('prev-month');
    const nextButton = document.getElementById('next-month');
    
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
        
        nextButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }
}

function renderCalendar() {
    const monthElement = document.getElementById('current-month');
    const calendarGrid = document.getElementById('calendar-grid');
    
    if (!monthElement || !calendarGrid) return;
    
    // Update month display
    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    
    monthElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    // Clear calendar grid
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    
    // Adjust to start from Monday
    const dayOfWeek = (firstDay.getDay() + 6) % 7;
    startDate.setDate(startDate.getDate() - dayOfWeek);
    
    // Generate calendar days
    for (let i = 0; i < 42; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const currentDay = new Date(startDate);
        currentDay.setDate(startDate.getDate() + i);
        
        dayElement.textContent = currentDay.getDate();
        
        // Add classes for styling
        if (currentDay.getMonth() !== currentDate.getMonth()) {
            dayElement.classList.add('other-month');
        }
        
        if (isToday(currentDay)) {
            dayElement.classList.add('today');
        }
        
        if (hasMenu(currentDay)) {
            dayElement.classList.add('has-menu');
        }
        
        // Add click event
        dayElement.addEventListener('click', () => {
            selectDate(currentDay);
        });
        
        calendarGrid.appendChild(dayElement);
    }
}

function isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

function hasMenu(date) {
    const dateKey = formatDateKey(date);
    return menuData[dateKey] && Object.keys(menuData[dateKey]).length > 0;
}

function selectDate(date) {
    selectedDate = date;
    
    // Update selected day display
    const selectedDateElement = document.getElementById('selected-date');
    if (selectedDateElement) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        selectedDateElement.textContent = date.toLocaleDateString('ru-RU', options);
    }
    
    // Update calendar styling
    const calendarDays = document.querySelectorAll('.calendar-day');
    calendarDays.forEach(day => day.classList.remove('selected'));
    
    // Find and highlight selected day
    calendarDays.forEach(day => {
        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(day.textContent));
        if (dayDate.toDateString() === date.toDateString()) {
            day.classList.add('selected');
        }
    });
    
    // Load menu for selected date
    loadMenuForDate(date);
}

function loadMenuForDate(date) {
    const dateKey = formatDateKey(date);
    const meals = menuData[dateKey] || {};
    
    // Update meal slots
    const mealSlots = document.querySelectorAll('.meal-content');
    mealSlots.forEach(slot => {
        const mealType = slot.getAttribute('data-meal');
        const meal = meals[mealType];
        
        if (meal) {
            slot.innerHTML = `
                <div class="meal-item">
                    <h5>${meal.name}</h5>
                    <p>${meal.calories} ккал</p>
                    <button onclick="removeMeal('${dateKey}', '${mealType}')">Удалить</button>
                </div>
            `;
        } else {
            slot.innerHTML = `
                <p>Нажмите для добавления блюда</p>
                <button onclick="addMeal('${dateKey}', '${mealType}')">Добавить</button>
            `;
        }
    });
}

function formatDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function addMeal(dateKey, mealType) {
    // Sample meals for demonstration
    const sampleMeals = {
        breakfast: [
            { name: 'Овсяная каша с ягодами', calories: 320 },
            { name: 'Омлет с овощами', calories: 280 },
            { name: 'Тост с авокадо', calories: 250 }
        ],
        lunch: [
            { name: 'Куриная грудка с рисом', calories: 450 },
            { name: 'Салат Цезарь', calories: 380 },
            { name: 'Суп-пюре из брокколи', calories: 220 }
        ],
        dinner: [
            { name: 'Запеченная рыба с овощами', calories: 350 },
            { name: 'Греческий салат', calories: 280 },
            { name: 'Куриные котлеты на пару', calories: 320 }
        ]
    };
    
    const meals = sampleMeals[mealType] || [];
    const randomMeal = meals[Math.floor(Math.random() * meals.length)];
    
    if (!menuData[dateKey]) {
        menuData[dateKey] = {};
    }
    
    menuData[dateKey][mealType] = randomMeal;
    
    // Save to localStorage
    saveUserData();
    
    // Refresh display
    if (selectedDate) {
        loadMenuForDate(selectedDate);
        renderCalendar(); // Update calendar to show has-menu indicator
    }
}

function removeMeal(dateKey, mealType) {
    if (menuData[dateKey]) {
        delete menuData[dateKey][mealType];
        
        // Remove date entry if no meals left
        if (Object.keys(menuData[dateKey]).length === 0) {
            delete menuData[dateKey];
        }
    }
    
    // Save to localStorage
    saveUserData();
    
    // Refresh display
    if (selectedDate) {
        loadMenuForDate(selectedDate);
        renderCalendar(); // Update calendar to remove has-menu indicator if needed
    }
}

// Profile functionality
function setupProfile() {
    const saveButton = document.querySelector('.save-button');
    if (saveButton) {
        saveButton.addEventListener('click', saveProfile);
    }
}

function saveProfile() {
    const profileData = {
        name: document.getElementById('user-name')?.value || '',
        age: document.getElementById('user-age')?.value || '',
        weight: document.getElementById('user-weight')?.value || '',
        height: document.getElementById('user-height')?.value || '',
        goal: document.querySelector('input[name="goal"]:checked')?.value || '',
        preferences: Array.from(document.querySelectorAll('.preference-option input:checked')).map(cb => cb.value)
    };
    
    localStorage.setItem('foodai-profile', JSON.stringify(profileData));
    
    // Show success message
    alert('Настройки сохранены!');
}

// Data persistence
function saveUserData() {
    localStorage.setItem('foodai-menu', JSON.stringify(menuData));
}

function loadUserData() {
    // Load menu data
    const savedMenu = localStorage.getItem('foodai-menu');
    if (savedMenu) {
        menuData = JSON.parse(savedMenu);
    }
    
    // Load profile data
    const savedProfile = localStorage.getItem('foodai-profile');
    if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        
        // Populate form fields
        if (document.getElementById('user-name')) {
            document.getElementById('user-name').value = profileData.name || '';
        }
        if (document.getElementById('user-age')) {
            document.getElementById('user-age').value = profileData.age || '';
        }
        if (document.getElementById('user-weight')) {
            document.getElementById('user-weight').value = profileData.weight || '';
        }
        if (document.getElementById('user-height')) {
            document.getElementById('user-height').value = profileData.height || '';
        }
        
        // Set goal radio button
        if (profileData.goal) {
            const goalRadio = document.querySelector(`input[name="goal"][value="${profileData.goal}"]`);
            if (goalRadio) goalRadio.checked = true;
        }
        
        // Set preference checkboxes
        if (profileData.preferences) {
            profileData.preferences.forEach(pref => {
                const checkbox = document.querySelector(`.preference-option input[value="${pref}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
    }
}

// Utility functions
function generateAIRecommendation() {
    // Placeholder for AI recommendation functionality
    const recommendations = [
        'Добавьте больше овощей в ваш рацион',
        'Попробуйте увеличить количество белка в завтраке',
        'Рекомендуем добавить полезные жиры в обед',
        'Уменьшите количество углеводов в ужине'
    ];
    
    return recommendations[Math.floor(Math.random() * recommendations.length)];
}

// Export functions for global access
window.showPage = showPage;
window.addMeal = addMeal;
window.removeMeal = removeMeal;