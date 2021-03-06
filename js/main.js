// All months in Icelandic to display in the calendar
const allMonths = ['Janúar', 'Febrúar', 'Mars', 'Apríl', 'Maí', 'Júní', 'Júlí', 'Ágúst', 'September', 'Október', 'Nóvember', 'Desember'];

// DOM element variables
const calendarLink = document.getElementById('calendar-link');
const calendarButton = document.getElementById('calendar-button');
const calendarElement = document.getElementById('calendar');
const currentMonthElement = document.getElementById('current-month');
const currentYearElement = document.getElementById('current-year');
const prevMonthElement = document.getElementById('prev-month');
const nextMonthElement = document.getElementById('next-month');
const calAdvice = document.getElementById('calendar-advice');
const conditionPreview = document.getElementById('condition-preview');
const conditionOther = document.getElementById('condition-other');
const conditionBtn = document.getElementById('condition-label');
const strenghtBar1 = document.getElementById('strength-display-one');
const strenghtBar2 = document.getElementById('strength-display-two');
const strenghtBar3 = document.getElementById('strength-display-three');
const displayBars = [strenghtBar1, strenghtBar2, strenghtBar3];

// Initialize today as the date today, then use the variable for navigating the months
let today = new Date();
// List to be filled with the current month's conditions
let thisMonthsConditions = [];

// Add event listeners once the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    prevMonthElement.addEventListener('click', changeMonth);
    nextMonthElement.addEventListener('click', changeMonth);
    calendarLink.addEventListener('click', openCalendar);
    calendarButton.addEventListener('click', openCalendar);
});

// Fetches the condition list from storage, displays the month passed in as parameter and loads the conditions to the calendar
function updateMonth(daysInMonth) {
    let conditionsList = getConditionsFromStorage();
    displayMonthInCalendar(daysInMonth);
    if(conditionsList.length > 0) {
        loadConditionsToCalendar(conditionsList);
    }
}

// Call this each time the next or previous month button is clicked
function changeMonth(ev) {
    if(ev.currentTarget.id === 'prev-month') {
        today = new Date(today.getFullYear(), today.getMonth() - 1);
        let newMonth = getDaysInMonth(today.getMonth(), today.getFullYear());
        updateMonth(newMonth);
    }
    if(ev.currentTarget.id === 'next-month') {
        today = new Date(today.getFullYear(), today.getMonth() + 1);
        let newMonth = getDaysInMonth(today.getMonth(), today.getFullYear());
        updateMonth(newMonth);
    }
}

// Function for the calendar nav-links on the page, first time you open it opens the current month, then the month last viewed by the user
function openCalendar(ev) {
    let daysInCurrentMonth = getDaysInMonth(today.getMonth(), today.getFullYear());
    updateMonth(daysInCurrentMonth);
    hideConditionInfo();
}

// Returns an array of every day in given month and year as date objects
function getDaysInMonth(month, year) {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
}

// Remove every element that has the .calendar-item class from the site
function clearCalendar() {
    const datesArray = document.querySelectorAll('.calendar-item');
    for(let i = 0; i < datesArray.length; i++) {
        datesArray[i].remove();
    }
}

// Pass in an array of days in a month and display them in the calendar
function displayMonthInCalendar(month) {
    clearCalendar();
    let highlightedDay = new Date();
    let firstDayIndex = month[0].getDay();
    let currentDay = 0;
    
    currentMonthElement.innerHTML = allMonths[month[0].getMonth()];
    currentYearElement.innerHTML = month[0].getFullYear();
    // Create 42 div elements (7 columns, 6 rows)
    for(let i = 0; i < 42; i++) {
        let dayElement = document.createElement('div');
        dayElement.classList.add('calendar-item');
        // If i is equal or greater then firstDayIndex we know we are positioned on the correct weekday and we can start marking the dates
        if(i >= firstDayIndex && currentDay < month.length) {
            dayElement.innerHTML = month[currentDay].getDate();
            dayElement.classList.add('calendar-date');  
            // Check if current day being inserted into the calendar is the same as the day today          
            if(compareTwoDates(month[currentDay], highlightedDay)) {
                dayElement.classList.add('current-day');
            }
            // Incrementing currentDay to access the next day of the month array
            currentDay++;
        } else {
            dayElement.classList.add('calendar-filler');
        }
        dayElement.addEventListener('click', handleDateClick);
        calendarElement.appendChild(dayElement);
    }
}

// Goes through a list of conditions and checks if any conditions year and month in the list matches the currently shown year and month
// If it does, give the element a color and a data-date attribute
function loadConditionsToCalendar(conditions) {
    thisMonthsConditions = [];
    const currentYear = document.getElementById('current-year').innerHTML;
    const currentMonth = document.getElementById('current-month').innerHTML;
    let dateElements = document.querySelectorAll('.calendar-date');
    for(let i = 0; i < conditions.length; i++) {
        // If the current conditions year and month match the calendar year and month, give that element a different style
        // TODO: maybe change the way we access the correct dateElements element, currently we're using the condition date as index.
        if(conditions[i].date.getFullYear() === parseInt(currentYear) && allMonths[conditions[i].date.getMonth()] === currentMonth) {
            // Change the date color to the condition's color
            dateElements[conditions[i].date.getDate() - 1].style.backgroundColor = conditions[i].color;
            // Give the date element the data-date attribute  
            dateElements[conditions[i].date.getDate() - 1].setAttribute('data-date', conditions[i].date.getDate());
            // Push the condition into an array representing this month's conditions
            thisMonthsConditions.push(conditions[i]);
        }
    }
}

// Used to compare two dates to each other and returns true if the year, month and date is the same
function compareTwoDates(date1, date2) {
    if(date1.getFullYear() + '-' + date1.getMonth() + '-' + date1.getDate() === date2.getFullYear() + '-' + date2.getMonth() + '-' + date2.getDate()) {
        return true;
    }
    return false;
}

// Each time the user clicks a date with a condition, display detailed info
function handleDateClick(ev) {
    // If the element has a data-date attribute fetch the condition's info
    if(ev.currentTarget.hasAttribute('data-date')) {
        const clickedDate = ev.currentTarget.getAttribute('data-date');
        const condition = getCondition(parseInt(clickedDate));
        conditionOther.innerHTML = condition.other;
        conditionBtn.innerHTML = condition.description;
        conditionBtn.style.backgroundColor = condition.color;
        fillStrengthBars(condition.intensity);
        showConditionInfo();
    }
}

// Fill the strength bar icons in the condition info window
function fillStrengthBars(intensity) {
    // If there is no intensity clear the bars
    if(intensity === null) {
        displayBars.forEach(element => element.classList.remove('strength-display-active'));
        return;
    }
    // Add the strength-display-active class to the elements based on the intensity
    for(let i = 0; i < displayBars.length; i++) {
        if(i <= intensity) {
            displayBars[i].classList.add('strength-display-active');
        } else {
            displayBars[i].classList.remove('strength-display-active');
        }
    }
}

// Display the condition info window
function showConditionInfo() {
    calAdvice.style.display = 'none';
    conditionPreview.style.display = 'flex';
}

function hideConditionInfo() {
    conditionPreview.style.display = 'none';
}

// Currently working with 'thisMonthsConditions' array to retrieve correct condition
function getCondition(date) {
    return thisMonthsConditions.find(element => element.date.getDate() === date);
}