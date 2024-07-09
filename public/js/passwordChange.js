document
.getElementById("passwordChangeForm")
.addEventListener("submit", function (event) {
  var currentPassword = document.getElementById("currentPassword").value;
  var newPassword = document.getElementById("newPassword").value;
  var confirmPassword = document.getElementById("confirmPassword").value;
  var errorText = document.getElementById("errorText");

  if (newPassword === currentPassword) {
    errorText.textContent =
      "New password cannot be the same as the old password.";
    event.preventDefault();
  } else if (newPassword !== confirmPassword) {
    errorText.textContent =
      "New password and confirm password do not match.";
    event.preventDefault();
  } else {
    errorText.textContent = ""; // Clear error message if there are no errors
  }
});