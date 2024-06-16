(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();

// Set the current date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split("T")[0];

// Set the max attribute value to the current date
document.getElementById("date").max = currentDate;

 // Populate the select element with years
 const selectYear = document.querySelector(".year-select");
 const currentYear = new Date().getFullYear();
 const selectedYear = selectYear.getAttribute("data-selected-year");

 for (let year = 2000; year <= currentYear; year++) {
   const option = document.createElement("option");
   option.value = year;
   option.textContent = year;
   if (selectedYear && year == selectedYear) {
     option.selected = true;
   }
   selectYear.appendChild(option);
 }

// Restrict input to positive numeric values
function restrictToPositiveNumeric(input) {
  input.addEventListener("input", function () {
    let value = this.value;
    this.value = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
  });
}

document.querySelectorAll(".numericInput").forEach(function (input) {
  restrictToPositiveNumeric(input);
});
