// Function to format the date and time
function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);

    // Options for formatting date
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
    };

    // Format date
    const formattedDate = date.toLocaleDateString("en-US", options);

    // Format time
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${formattedDate}, ${formattedTime}`;
  }

  // Select all div elements with the class 'datetime'
  const dateTimeElements = document.querySelectorAll(".target-date");

  // Iterate over each div element and format its content
  dateTimeElements.forEach((element) => {
    // Get the text content of the current div element
    const dateTimeString = element.textContent.trim();
    // Format the date and time
    const formattedDateTime = formatDateTime(dateTimeString);
    // Set the formatted date and time back to the div element
    element.textContent = formattedDateTime;
  });