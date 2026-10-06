// 1. Function to retrieve data from local storage
function loadHabits() {
    const dataString = localStorage.getItem("habit_tracker_data");
    if (!dataString) return [];
    return JSON.parse(dataString);
}

// Load habits from local storage if available, otherwise fallback to initial array
let habitsArray = loadHabits();

if (habitsArray.length === 0) {
    habitsArray = [
        {
            id: Date.now(),
            name: "Exercise",
            category: "Healthy",
            createdAt: formatDate(),
            completedDates: []
        }
    ];
}

// 2. Function to store data to local storage
function saveHabits(habits) {
    const dataString = JSON.stringify(habits);
    localStorage.setItem("habit_tracker_data", dataString);
}

// 3. Function to format date
function formatDate(dateObj) {
    if (!dateObj) {
        dateObj = new Date();
    } else if (!(dateObj instanceof Date)) {
        dateObj = new Date(dateObj);
    }
    
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

// 4. Access DOM elements
const habitList = document.getElementById("habit-list");
const habitForm = document.getElementById("habit-form");
const nameInput = document.getElementById("habit-name-input");
const categorySelect = document.getElementById("habit-category-select");
const categoryFilter = document.getElementById("category-filter");

// 5. Function for rendering habit cards
function renderHabits(habits) {

    if (habits.length === 0) {
    habitList.innerHTML = "<p>No habits found. Add one above!</p>";
    return;
    }

    habitList.innerHTML = "";
    const today = formatDate();

    for (const habit of habits) {
        const card = document.createElement("div");
        card.className = "habit-card";

        if (habit.completedDates.includes(today)) {
            card.classList.add("completed");
        }

        const name = document.createElement("h3");
        name.textContent = habit.name;

        const category = document.createElement("p");
        category.textContent = `Category: ${habit.category}`;

        const button = document.createElement("button");
        button.textContent = habit.completedDates.includes(today) ? "Completed ✅" : "Mark as Completed";
        button.addEventListener("click", () => toggleHabitCompletion(habit.id));

        const streak = document.createElement("p");
        streak.textContent = `Current Streak: ${calculateStreak(habit.completedDates)} days`;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete 🗑️";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => deleteHabit(habit.id));

        card.appendChild(name);
        card.appendChild(category);
        card.appendChild(button);
        card.appendChild(streak);
        card.appendChild(deleteBtn);

        habitList.appendChild(card);

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit ✏️";
        editBtn.className = "edit-btn";
        editBtn.addEventListener("click", () => editHabit(habit.id));

        // Append to card alongside other buttons
        card.appendChild(editBtn);
    }
}

// 6. Function to toggle habit completion
function toggleHabitCompletion(habitId) {
    const today = formatDate();
    const habit = habitsArray.find(h => h.id === habitId);

    if (habit) {
        if (habit.completedDates.includes(today)) {
            habit.completedDates = habit.completedDates.filter(date => date !== today);
        } else {
            habit.completedDates.push(today);
        }
        saveHabits(habitsArray);
        applyFilterAndRender();
    }
}

// 7. Function to delete a habit
// Function to delete a habit with confirmation
function deleteHabit(habitId) {
    const isConfirmed = confirm("Are you sure you want to delete this habit?");
    if (!isConfirmed) return;

    habitsArray = habitsArray.filter(habit => habit.id !== habitId);
    saveHabits(habitsArray);
    applyFilterAndRender();
}

// 8. Function to calculate streaks for a habit
function calculateStreak(completedDates) {
    if (!completedDates || completedDates.length === 0) {
        return 0;
    }

    const todayStr = formatDate(new Date());
    const yesterdayObj = new Date();
    yesterdayObj.setDate(yesterdayObj.getDate() - 1);
    const yesterdayStr = formatDate(yesterdayObj);

    let streak = 0;
    let checkDateObj;

    if (completedDates.includes(todayStr)) {
        checkDateObj = new Date();
    } else if (completedDates.includes(yesterdayStr)) {
        checkDateObj = yesterdayObj;
    } else {
        return 0;
    }

    while (true) {
        const checkStr = formatDate(checkDateObj);
        if (completedDates.includes(checkStr)) {
            streak++;
            checkDateObj.setDate(checkDateObj.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
}

// 9. Helper function to render habits respecting active filter
function applyFilterAndRender() {
    const selectedCategory = categoryFilter.value;

    if (selectedCategory === "All") {
        renderHabits(habitsArray);
    } else {
        const filteredHabits = habitsArray.filter(
            (habit) => habit.category === selectedCategory
        );
        renderHabits(filteredHabits);
    }
}

// Event Listeners
habitForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameValue = nameInput.value.trim();
    const categoryValue = categorySelect.value;

    if (!nameValue) return;

    const newHabit = {
        id: Date.now(),
        name: nameValue,
        category: categoryValue,
        createdAt: formatDate(),
        completedDates: []
    };

    habitsArray.push(newHabit);
    saveHabits(habitsArray);

    if (categoryFilter.value !== "All" && categoryFilter.value !== categoryValue) {
        categoryFilter.value = "All";
    }

    applyFilterAndRender();
    nameInput.value = "";
});

categoryFilter.addEventListener("change", applyFilterAndRender);

// Initial application load
applyFilterAndRender();

// Function to edit habits
function editHabit(habitId) {
    const habit = habitsArray.find(h => h.id === habitId);
    if (!habit) return;

    const newName = prompt("Edit habit name:", habit.name);
    if (newName && newName.trim() !== "") {
        habit.name = newName.trim();
        saveHabits(habitsArray);
        applyFilterAndRender();
    }
}

// Array of available habit categories
const CATEGORIES = [
  "Healthy",
  "Productivity",
  "Fitness",
  "Learning",
  "Mindfulness",
  "Personal",
  "Finance",
  "Work"
];

// Populate Select Dropdowns Dynamically
function setupCategoryDropdowns() {
  const formSelect = document.getElementById("habit-category-select");
  const filterSelect = document.getElementById("category-filter");

  // Populate Habit Creation Form Select
  formSelect.innerHTML = CATEGORIES.map(
    cat => `<option value="${cat}">${cat}</option>`
  ).join("");

  // Populate Filter Select (including "All")
  filterSelect.innerHTML = `
    <option value="All">All Categories</option>
    ${CATEGORIES.map(cat => `<option value="${cat}">${cat}</option>`).join("")}
  `;
}

// Call on app load
setupCategoryDropdowns();