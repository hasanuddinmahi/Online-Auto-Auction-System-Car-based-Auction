// Example starter JavaScript for disabling form submissions if there are invalid fields
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

// for registration date
// Get the current date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split("T")[0];

// Set the max attribute value to the current date
document.getElementById("date").max = currentDate;

// for select year
const selectYear = document.getElementById("year");
const currentYear = new Date().getFullYear();

for (let year = 2000; year <= currentYear; year++) {
  const option = document.createElement("option");
  option.value = year;
  option.textContent = year;
  selectYear.appendChild(option);
}

// for image section preview
function previewBeforeUpload(id) {
  document.querySelector("#" + id).addEventListener("change", function (e) {
    if (e.target.files.length == 0) {
      return;
    }
    let file = e.target.files[0];
    let url = URL.createObjectURL(file);
    document.querySelector("#" + id + "-preview div").innerText = file.name;
    document.querySelector("#" + id + "-preview img").src = url;
  });
}

previewBeforeUpload("file-1");
previewBeforeUpload("file-2");
previewBeforeUpload("file-3");
previewBeforeUpload("file-4");
previewBeforeUpload("file-5");
previewBeforeUpload("file-6");
previewBeforeUpload("file-7");
previewBeforeUpload("file-8");

// for image validation
document
  .getElementById("imageUploadForm")
  .addEventListener("submit", function (event) {
    // Count the number of files uploaded
    let fileCount = 0;
    for (let i = 1; i <= 8; i++) {
      let fileInput = document.getElementById("file-" + i);
      if (fileInput.files.length > 0) {
        fileCount++;
      }
    }

    // Show feedback message
    let feedbackMessage = document.getElementById("feedbackMessage");
    if (fileCount < 4) {
      feedbackMessage.classList.remove("d-none", "alert-success");
      feedbackMessage.classList.add("alert-danger");
      feedbackMessage.textContent = "Please upload at least 4 images.";
    } else {
      feedbackMessage.classList.add("alert", "d-none");
    }
  });

// set number input as numeric
function restrictToPositiveNumeric(input) {
  input.addEventListener("input", function () {
    var value = this.value;
    // Allow only digits and one decimal point
    this.value = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"); // Allow only one decimal point
  });
}

// Get all elements with the class 'numericInput' and apply the function
var numericInputs = document.querySelectorAll(".numericInput");
numericInputs.forEach(function (input) {
  restrictToPositiveNumeric(input);
});