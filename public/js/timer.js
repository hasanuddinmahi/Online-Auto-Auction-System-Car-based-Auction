 // Step 3: JavaScript
  // Function to update the timer
  function updateTimer() {
    // Get all elements with class 'target-date'
    const targetDateElements = document.getElementsByClassName('target-date');

    // Loop through each target date element
    for (let i = 0; i < targetDateElements.length; i++) {
        const targetDateElement = targetDateElements[i];
        const targetDate = new Date(targetDateElement.textContent);
        const now = new Date();

        const timeDifference = targetDate - now;

        if (timeDifference > 0) {
            const hours = Math.floor(timeDifference / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            // Get the corresponding timer element and update its text content
            const timerElements = document.getElementsByClassName('timer');
            timerElements[i].textContent = `${hours}h: ${minutes}m: ${seconds}s`;
        } else {
            // If time is up, set timer text content to "Time's up!"
            const timerElements = document.getElementsByClassName('timer');
            timerElements[i].textContent = "Time's up!";
        }
    }
}

// Update the timer every second
const timerInterval = setInterval(updateTimer, 1000);

// Initial call to display the timer immediately
updateTimer();