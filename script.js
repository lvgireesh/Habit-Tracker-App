// 1. An array to track user habits
habitsArray = [
    {
        id: 1,
        name: "Exercise",
        category: "Healthy",
        createdAt: "2026-10-03",
        completedDates: ["2026-10-01",]
    }
];

// 2. Function to store data to local storage
function saveHabits(habits) {
    // Convert JS array to string
    const dataString = JSON.stringify(habits);

    // Save to local storage
    localStorage.setItem("habit_tracker_data", dataString);
}

// 3. Function to retrieve data from local storage
function loadHabits() {
    // Get string from local storage
    const dataString = localStorage.getItem("habit_tracker_data");

    // If no data exists yet, return an empty array
    if (!dataString) {
        return [];
    }

    // Convert the string back to JS array
    return JSON.parse(dataString);
}