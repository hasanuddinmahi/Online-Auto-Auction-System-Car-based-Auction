document.addEventListener('DOMContentLoaded', function() {
    const selectYear = document.querySelector(".year-select");
    const currentYear = new Date().getFullYear();

    // Populate the select element with years from 2000 to current year
    for (let year = 2000; year <= currentYear; year++) {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      selectYear.appendChild(option);
    }

    // Check if there's a query parameter 'year' and set the selected option
    const urlParams = new URLSearchParams(window.location.search);
    const selectedYear = urlParams.get('year');

    if (selectedYear) {
      selectYear.value = selectedYear; // Set the selected value based on query parameter
    }
  });